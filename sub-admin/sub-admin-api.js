// Sub-Admin API - Filtered CRUD operations for sub-admins (only their own data)
import { db } from '../firebase-config.js';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ========== PRODUCTS ==========

// Get all products (view all)
export async function getAllProducts() {
    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
}

// Get sub-admin's own products (client-side filtering to avoid index requirement)
export async function getMyProducts(ownerId) {
    try {
        // Get all products and filter client-side
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter by ownerId client-side
        return allProducts.filter(product => product.ownerId === ownerId);
    } catch (error) {
        console.error('Error getting my products:', error);
        throw error;
    }
}

// Get single product
export async function getProduct(productId) {
    try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting product:', error);
        throw error;
    }
}

// Create product (always tagged with owner)
export async function createProduct(productData, ownerId, ownerEmail) {
    try {
        productData.createdAt = new Date().toISOString();
        productData.updatedAt = new Date().toISOString();
        productData.ownerId = ownerId;
        productData.ownerEmail = ownerEmail;
        const docRef = await addDoc(collection(db, 'products'), productData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update product (only if owner)
export async function updateProduct(productId, productData, ownerId) {
    try {
        // First check if user owns this product
        const product = await getProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.ownerId !== ownerId) {
            throw new Error('You do not have permission to update this product');
        }

        productData.updatedAt = new Date().toISOString();
        const docRef = doc(db, 'products', productId);
        await updateDoc(docRef, productData);
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete product (only if owner)
export async function deleteProduct(productId, ownerId) {
    try {
        // First check if user owns this product
        const product = await getProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.ownerId !== ownerId) {
            throw new Error('You do not have permission to delete this product');
        }

        await deleteDoc(doc(db, 'products', productId));
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// ========== ORDERS ==========

// Get all orders (view all)
export async function getAllOrders() {
    try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting orders:', error);
        throw error;
    }
}

// Get sub-admin's own orders (client-side filtering)
export async function getMyOrders(adminOwnerId) {
    try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        return allOrders.filter(order => order.adminOwnerId === adminOwnerId);
    } catch (error) {
        console.error('Error getting my orders:', error);
        throw error;
    }
}

// Get single order
export async function getOrder(orderId) {
    try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting order:', error);
        throw error;
    }
}

// Update order status (only if owner)
export async function updateOrderStatus(orderId, status, ownerId) {
    try {
        // First check if user owns this order
        const order = await getOrder(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.adminOwnerId !== ownerId) {
            throw new Error('You do not have permission to update this order');
        }

        const docRef = doc(db, 'orders', orderId);
        await updateDoc(docRef, {
            status,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

// ========== DIGITAL PRODUCTS ==========

// Get all digital products (view all)
export async function getAllDigitalProducts() {
    try {
        const q = query(collection(db, 'digital-products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting digital products:', error);
        throw error;
    }
}

// Get sub-admin's own digital products (client-side filtering)
export async function getMyDigitalProducts(ownerId) {
    try {
        const q = query(collection(db, 'digital-products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        return allProducts.filter(product => product.ownerId === ownerId);
    } catch (error) {
        console.error('Error getting my digital products:', error);
        throw error;
    }
}

// Create digital product (always tagged with owner)
export async function createDigitalProduct(productData, ownerId, ownerEmail) {
    try {
        productData.createdAt = new Date().toISOString();
        productData.updatedAt = new Date().toISOString();
        productData.ownerId = ownerId;
        productData.ownerEmail = ownerEmail;
        const docRef = await addDoc(collection(db, 'digital-products'), productData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating digital product:', error);
        throw error;
    }
}

// Update digital product (only if owner)
export async function updateDigitalProduct(productId, productData, ownerId) {
    try {
        const product = await getDigitalProduct(productId);
        if (!product) {
            throw new Error('Digital product not found');
        }
        
        if (product.ownerId !== ownerId) {
            throw new Error('You do not have permission to update this product');
        }

        productData.updatedAt = new Date().toISOString();
        const docRef = doc(db, 'digital-products', productId);
        await updateDoc(docRef, productData);
        return true;
    } catch (error) {
        console.error('Error updating digital product:', error);
        throw error;
    }
}

// Delete digital product (only if owner)
export async function deleteDigitalProduct(productId, ownerId) {
    try {
        const product = await getDigitalProduct(productId);
        if (!product) {
            throw new Error('Digital product not found');
        }
        
        if (product.ownerId !== ownerId) {
            throw new Error('You do not have permission to delete this product');
        }

        await deleteDoc(doc(db, 'digital-products', productId));
        return true;
    } catch (error) {
        console.error('Error deleting digital product:', error);
        throw error;
    }
}

// Get single digital product
export async function getDigitalProduct(productId) {
    try {
        const docRef = doc(db, 'digital-products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting digital product:', error);
        throw error;
    }
}

// ========== DIGITAL ORDERS ==========

// Get all digital orders (view all)
export async function getAllDigitalOrders() {
    try {
        const q = query(collection(db, 'digital-orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting digital orders:', error);
        throw error;
    }
}

// Get sub-admin's own digital orders (client-side filtering)
export async function getMyDigitalOrders(adminOwnerId) {
    try {
        const q = query(collection(db, 'digital-orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        return allOrders.filter(order => order.adminOwnerId === adminOwnerId);
    } catch (error) {
        console.error('Error getting my digital orders:', error);
        throw error;
    }
}

// ========== STATS & ANALYTICS ==========

// Get sub-admin dashboard stats
export async function getSubAdminDashboardStats(ownerId) {
    try {
        const [myProducts, myOrders, myDigitalProducts, myDigitalOrders] = await Promise.all([
            getMyProducts(ownerId),
            getMyOrders(ownerId),
            getMyDigitalProducts(ownerId),
            getMyDigitalOrders(ownerId)
        ]);

        const totalProducts = myProducts.length;
        const totalOrders = myOrders.length;
        const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
        const totalRevenue = myOrders
            .filter(o => o.status === 'delivered' || o.status === 'confirmed')
            .reduce((sum, o) => sum + (o.total || 0), 0);
        
        const totalDigitalProducts = myDigitalProducts.length;
        const totalDigitalOrders = myDigitalOrders.length;

        return {
            totalProducts,
            totalOrders,
            pendingOrders,
            totalRevenue,
            totalDigitalProducts,
            totalDigitalOrders
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw error;
    }
}
