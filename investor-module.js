// Investor Profit Calculation Module
// This module handles automatic profit calculation and distribution for investors

import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/**
 * Calculate investor share for an order
 * @param {number} orderTotal - Total order value
 * @param {number} costPrice - Product cost price
 * @param {number} shipping - Shipping cost
 * @param {number} packaging - Packaging cost
 * @param {number} otherExpenses - Other direct expenses
 * @param {string} profitType - 'revenue' or 'net-profit'
 * @param {number} percentage - Investor's profit share percentage
 * @returns {object} - Calculation result
 */
export function calculateInvestorShare(orderTotal, costPrice, shipping, packaging, otherExpenses, profitType, percentage) {
    const netProfit = orderTotal - costPrice - shipping - packaging - otherExpenses;
    
    let shareBase, shareAmount;
    
    if (profitType === 'revenue') {
        // Revenue share (7% on order total)
        shareBase = orderTotal;
        shareAmount = orderTotal * (percentage / 100);
    } else {
        // Net profit share
        shareBase = Math.max(0, netProfit);
        shareAmount = netProfit > 0 ? netProfit * (percentage / 100) : 0;
    }
    
    return {
        orderTotal,
        costPrice,
        shipping,
        packaging,
        otherExpenses,
        netProfit,
        profitType,
        percentage,
        shareBase,
        shareAmount,
        ownerProfit: netProfit - shareAmount,
        calculatedAt: new Date().toISOString()
    };
}

/**
 * Get active investors (no cap limit - 1 year contract)
 * @returns {Promise<Array>} - Array of active investors
 */
export async function getActiveInvestors() {
    try {
        const investorsQuery = query(collection(db, 'investors'), where('status', '==', 'active'));
        const snapshot = await getDocs(investorsQuery);

        const activeInvestors = [];
        snapshot.forEach(doc => {
            const investor = { id: doc.id, ...doc.data() };
            // All active investors are included (no cap check)
            activeInvestors.push(investor);
        });

        return activeInvestors;
    } catch (error) {
        console.error('Error getting active investors:', error);
        return [];
    }
}

/**
 * Record investor earning for an order
 * @param {string} orderId - Order ID
 * @param {string} investorId - Investor ID
 * @param {object} calculation - Calculation result from calculateInvestorShare
 * @param {string} productName - Product name
 * @returns {Promise<string>} - Earning record ID
 */
export async function recordInvestorEarning(orderId, investorId, calculation, productName) {
    try {
        const investorRef = doc(db, 'investors', investorId);
        const investorDoc = await getDocs(query(collection(db, 'investors'), where('code', '==', calculation.investorCode)));

        let investorData = null;
        investorDoc.forEach(doc => {
            investorData = { id: doc.id, ...doc.data() };
        });

        if (!investorData) {
            throw new Error('Investor not found');
        }

        // No cap limit - full amount is paid
        const finalAmount = calculation.shareAmount;

        // Create earning record
        const earningData = {
            orderId,
            investorId,
            investorCode: investorData.code,
            investorName: investorData.name,
            productName,
            netProfit: calculation.netProfit,
            percentage: calculation.percentage,
            amount: finalAmount,
            status: 'pending', // pending -> paid
            date: new Date().toISOString(),
            totalEarnedAfter: (investorData.totalEarned || 0) + finalAmount,
            hasCap: false, // No cap limit
            contractType: 'revenue-share-1year'
        };

        const earningRef = await addDoc(collection(db, 'investor_earnings'), earningData);

        // Update investor total earned
        await updateDoc(investorRef, {
            totalEarned: increment(finalAmount)
        });
        
        // Update order with investor share info
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            investorShare: {
                investorId,
                investorCode: investorData.code,
                netProfit: calculation.netProfit,
                percentage: calculation.percentage,
                amount: finalAmount,
                recordedAt: new Date().toISOString()
            }
        });
        
        console.log(`Investor earning recorded: ${earningRef.id}`);
        return earningRef.id;
    } catch (error) {
        console.error('Error recording investor earning:', error);
        throw error;
    }
}

/**
 * Process order and distribute investor profits
 * This should be called when an order status changes to 'delivered'
 * @param {string} orderId - Order ID
 * @param {object} orderData - Order data
 * @returns {Promise<void>}
 */
export async function processOrderInvestorDistribution(orderId, orderData) {
    try {
        console.log('[InvestorModule] Processing distribution for order:', orderId);
        
        const activeInvestors = await getActiveInvestors();
        console.log('[InvestorModule] Found', activeInvestors.length, 'active investors:', activeInvestors.map(i => i.code));

        if (activeInvestors.length === 0) {
            console.log('[InvestorModule] No active investors found - skipping distribution');
            return;
        }

        // Get settings
        const settingsQuery = query(collection(db, 'investment_settings'), limit(1));
        const settingsSnapshot = await getDocs(settingsQuery);

        let settings = {
            profitType: 'revenue', // Default to Revenue Share
            defaultPercentage: 7 // 7% revenue share
        };

        if (!settingsSnapshot.empty) {
            settings = settingsSnapshot.docs[0].data();
        }
        console.log('[InvestorModule] Settings:', settings);

        // Calculate costs
        const orderTotal = orderData.total || 0;
        const items = orderData.items || [];
        console.log('[InvestorModule] Order total:', orderTotal, 'Items:', items.length);

        // Get product costs
        let totalCostPrice = 0;
        let totalShipping = orderData.shippingCost || 0;
        let totalPackaging = orderData.packagingCost || 10; // Default packaging
        let totalDelivery = orderData.deliveryCost || 250; // Fixed delivery cost

        for (const item of items) {
            const productRef = doc(db, 'products', item.id);
            // Note: You may need to fetch product details separately
            totalCostPrice += item.costPrice || 0;
        }
        console.log('[InvestorModule] Costs - CostPrice:', totalCostPrice, 'Shipping:', totalShipping, 'Packaging:', totalPackaging, 'Delivery:', totalDelivery);

        // For each active investor, calculate and record share
        for (const investor of activeInvestors) {
            const percentage = investor.profitPercentage || settings.defaultPercentage;
            console.log('[InvestorModule] Processing investor:', investor.code, 'Percentage:', percentage);

            const calculation = calculateInvestorShare(
                orderTotal,
                totalCostPrice,
                totalShipping,
                totalPackaging,
                0, // other expenses
                settings.profitType,
                percentage
            );
            console.log('[InvestorModule] Calculation result:', calculation);

            // Record earning for this investor
            await recordInvestorEarning(
                orderId,
                investor.id,
                calculation,
                items[0]?.name || 'Order Items'
            );
            console.log('[InvestorModule] Earning recorded for investor:', investor.code);
        }

        console.log(`[InvestorModule] Investor distribution completed for order: ${orderId}`);
    } catch (error) {
        console.error('[InvestorModule] Error processing investor distribution:', error);
    }
}

/**
 * Get investor earnings summary
 * @param {string} investorId - Investor ID
 * @returns {Promise<object>} - Earnings summary
 */
export async function getInvestorEarningsSummary(investorId) {
    try {
        const earningsQuery = query(collection(db, 'investor_earnings'), where('investorId', '==', investorId));
        const snapshot = await getDocs(earningsQuery);
        
        let total = 0;
        let paid = 0;
        let pending = 0;
        const earnings = [];
        
        snapshot.forEach(doc => {
            const earning = { id: doc.id, ...doc.data() };
            earnings.push(earning);
            total += earning.amount || 0;
            
            if (earning.status === 'paid') {
                paid += earning.amount || 0;
            } else {
                pending += earning.amount || 0;
            }
        });
        
        return {
            total,
            paid,
            pending,
            earnings
        };
    } catch (error) {
        console.error('Error getting earnings summary:', error);
        return { total: 0, paid: 0, pending: 0, earnings: [] };
    }
}

/**
 * Create withdrawal request
 * @param {string} investorId - Investor ID
 * @param {string} investorCode - Investor code
 * @param {number} amount - Withdrawal amount
 * @param {string} method - Withdrawal method (JazzCash/Easypaisa/Bank)
 * @param {string} account - Account number
 * @param {string} title - Account title
 * @returns {Promise<string>} - Withdrawal request ID
 */
export async function createWithdrawalRequest(investorId, investorCode, amount, method, account, title) {
    try {
        const withdrawalData = {
            investorId,
            investorCode,
            amount,
            method,
            account,
            title: title || '',
            status: 'pending',
            date: new Date().toISOString()
        };
        
        const withdrawalRef = await addDoc(collection(db, 'withdrawal_requests'), withdrawalData);
        
        // Update investor pending withdrawal
        const investorRef = doc(db, 'investors', investorId);
        await updateDoc(investorRef, {
            pendingWithdrawal: increment(amount)
        });
        
        console.log(`Withdrawal request created: ${withdrawalRef.id}`);
        return withdrawalRef.id;
    } catch (error) {
        console.error('Error creating withdrawal request:', error);
        throw error;
    }
}

/**
 * Process withdrawal request (admin function)
 * @param {string} withdrawalId - Withdrawal request ID
 * @param {string} status - 'approved' or 'rejected'
 * @returns {Promise<void>}
 */
export async function processWithdrawalRequest(withdrawalId, status) {
    try {
        const withdrawalRef = doc(db, 'withdrawal_requests', withdrawalId);
        const withdrawalDoc = await getDocs(query(collection(db, 'withdrawal_requests'), where('__name__', '==', withdrawalId)));
        
        let withdrawalData = null;
        withdrawalDoc.forEach(doc => {
            withdrawalData = { id: doc.id, ...doc.data() };
        });
        
        if (!withdrawalData) {
            throw new Error('Withdrawal request not found');
        }
        
        // Update withdrawal status
        await updateDoc(withdrawalRef, {
            status,
            processedDate: new Date().toISOString(),
            processedBy: 'admin'
        });
        
        // Update investor pending withdrawal
        const investorRef = doc(db, 'investors', withdrawalData.investorId);
        
        if (status === 'approved') {
            await updateDoc(investorRef, {
                pendingWithdrawal: increment(-withdrawalData.amount),
                totalPaid: increment(withdrawalData.amount)
            });
            
            // Mark earnings as paid (FIFO)
            const earningsQuery = query(
                collection(db, 'investor_earnings'),
                where('investorId', '==', withdrawalData.investorId),
                where('status', '==', 'pending')
            );
            const earningsSnapshot = await getDocs(earningsQuery);
            
            let remainingAmount = withdrawalData.amount;
            
            for (const earningDoc of earningsSnapshot.docs) {
                if (remainingAmount <= 0) break;
                
                const earningData = earningDoc.data();
                const earningAmount = earningData.amount || 0;
                
                if (earningAmount <= remainingAmount) {
                    await updateDoc(doc(db, 'investor_earnings', earningDoc.id), {
                        status: 'paid',
                        paidDate: new Date().toISOString()
                    });
                    remainingAmount -= earningAmount;
                } else {
                    // Partial payment (shouldn't happen normally)
                    await updateDoc(doc(db, 'investor_earnings', earningDoc.id), {
                        status: 'paid',
                        paidAmount: remainingAmount,
                        paidDate: new Date().toISOString()
                    });
                    break;
                }
            }
        } else {
            // Rejected - remove from pending
            await updateDoc(investorRef, {
                pendingWithdrawal: increment(-withdrawalData.amount)
            });
        }
        
        console.log(`Withdrawal ${status}: ${withdrawalId}`);
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        throw error;
    }
}

// Export functions for global access
window.investorModule = {
    calculateInvestorShare,
    getActiveInvestors,
    recordInvestorEarning,
    processOrderInvestorDistribution,
    getInvestorEarningsSummary,
    createWithdrawalRequest,
    processWithdrawalRequest
};
