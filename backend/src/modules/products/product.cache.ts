import { prisma } from '../../config/prisma';
import { isRedisConnected, redis } from '../../config/redis';

const CACHE_TTL = 3600;

export const CACHE_KEYS = {
  allProducts: 'products:all',
  productById: (id: number) => `products:${id}`,
};

export const productCache = {
  async cacheProduct(product: any) {
    if (!isRedisConnected()) return;
    try {
      await redis.set(CACHE_KEYS.productById(product.id), JSON.stringify(product), 'EX', CACHE_TTL);
    } catch (err) {
      console.warn('Redis cache set error:', err);
    }
  },

  async getCachedProduct(id: number) {
    if (!isRedisConnected()) return null;
    try {
      const cached = await redis.get(CACHE_KEYS.productById(id));
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.warn('Redis cache get error:', err);
      return null;
    }
  },

  async getCachedProducts(cacheKey: string) {
    if (!isRedisConnected()) return null;
    try {
      const cached = await redis.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      console.warn('Redis cache get error:', err);
      return null;
    }
  },

  async invalidateProductsList() {
    await redis.del(CACHE_KEYS.allProducts).catch(() => {});
  },

  async deleteCachedProduct(id: number) {
    if (!isRedisConnected()) return;
    try {
      await redis.del(CACHE_KEYS.productById(id));
      await redis.del(CACHE_KEYS.allProducts);
    } catch (err) {
      console.warn('Redis cache delete error:', err);
    }
  },

  async refreshProductsCache() {
    if (!isRedisConnected()) return;
    try {
      const keys = await redis.keys('products:*');
      if (keys.length > 0) await redis.del(...keys);
      const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
      await redis.set(CACHE_KEYS.allProducts, JSON.stringify(products), 'EX', CACHE_TTL);
      for (const p of products) {
        await redis.set(CACHE_KEYS.productById(p.id), JSON.stringify(p), 'EX', CACHE_TTL);
      }
    } catch (err) {
      console.warn('Redis refresh cache error:', err);
    }
  },
};
