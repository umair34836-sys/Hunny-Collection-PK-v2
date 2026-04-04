// Client-side caching utility for faster product loading

const CACHE_CONFIG = {
  products: {
    ttl: 5 * 60 * 1000, // 5 minutes
    key: 'hc_products_cache'
  },
  categories: {
    ttl: 10 * 60 * 1000, // 10 minutes
    key: 'hc_categories_cache'
  }
};

/**
 * Get data from cache or fetch from Firebase
 * @param {string} cacheKey - Cache identifier
 * @param {Function} fetchFn - Function to fetch data if cache miss
 * @returns {Promise<any>} Cached or fresh data
 */
export async function getCachedData(cacheKey, fetchFn) {
  const config = CACHE_CONFIG[cacheKey];
  if (!config) {
    console.warn(`Cache config not found for: ${cacheKey}`);
    return fetchFn();
  }

  try {
    // Try to get from localStorage
    const cached = localStorage.getItem(config.key);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      // Check if cache is still valid
      if (age < config.ttl) {
        console.log(`✅ Cache hit for ${cacheKey} (${Math.round(age / 1000)}s old)`);
        return data;
      } else {
        console.log(`⏰ Cache expired for ${cacheKey}`);
      }
    } else {
      console.log(`📭 Cache miss for ${cacheKey}`);
    }
  } catch (error) {
    console.warn(`Cache read error for ${cacheKey}:`, error);
  }

  // Fetch fresh data
  console.log(`🔄 Fetching fresh data for ${cacheKey}...`);
  try {
    const data = await fetchFn();
    
    // Save to cache
    try {
      localStorage.setItem(config.key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log(`💾 Cached ${cacheKey} successfully`);
    } catch (cacheError) {
      // localStorage might be full
      console.warn(`Failed to cache ${cacheKey}:`, cacheError);
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * Clear specific cache
 */
export function clearCache(cacheKey) {
  const config = CACHE_CONFIG[cacheKey];
  if (config) {
    localStorage.removeItem(config.key);
    console.log(`🗑️ Cache cleared for ${cacheKey}`);
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  Object.values(CACHE_CONFIG).forEach(config => {
    localStorage.removeItem(config.key);
  });
  console.log('🗑️ All caches cleared');
}

/**
 * Force refresh cache
 */
export async function refreshCache(cacheKey, fetchFn) {
  clearCache(cacheKey);
  return getCachedData(cacheKey, fetchFn);
}
