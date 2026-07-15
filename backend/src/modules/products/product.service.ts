import { redis } from '../../config/redis';
import { CACHE_KEYS, productCache } from './product.cache';
import { productRepository } from './product.repository';

const VALID_CATEGORIES = ['vinyl', 'cd', 'merch'];

const validateProductInput = (body: any): string | null => {
  const { title, artist, price, imgUrl, category, stock } = body;

  if (!title?.trim() || !artist?.trim() || !imgUrl?.trim()) {
    return 'Product title, artist, and image URL are required.';
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return 'Price must be a valid positive number.';
  }

  const parsedStock = parseInt(stock, 10);
  if (isNaN(parsedStock) || parsedStock < 0) {
    return 'Stock quantity must be an integer >= 0.';
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return `Invalid category. Only accepted values are: ${VALID_CATEGORIES.join(', ')}.`;
  }

  return null;
};

export const productService = {
  async getProducts(category?: string) {
    if (!category) {
      const cached = await productCache.getCachedProducts(CACHE_KEYS.allProducts);
      if (cached) return cached;
    }

    const products = await productRepository.findMany(category);
    if (!category) {
      await redis.set(CACHE_KEYS.allProducts, JSON.stringify(products), 'EX', 3600).catch(() => {});
    }
    return products;
  },

  async getProductById(id: number) {
    const cached = await productCache.getCachedProduct(id);
    if (cached) return cached;

    const product = await productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    await productCache.cacheProduct(product);
    return product;
  },

  async createProduct(body: any) {
    const validationError = validateProductInput(body);
    if (validationError) throw new Error(validationError);

    const product = await productRepository.create({
      title: body.title.trim(),
      artist: body.artist.trim(),
      price: parseFloat(body.price),
      imgUrl: body.imgUrl.trim(),
      category: body.category,
      stock: parseInt(body.stock, 10),
      description: body.description?.trim() || null,
    });

    await productCache.cacheProduct(product);
    await productCache.invalidateProductsList();
    return product;
  },

  async updateProduct(id: number, body: any) {
    const validationError = validateProductInput(body);
    if (validationError) throw new Error(validationError);

    const product = await productRepository.update(id, {
      title: body.title.trim(),
      artist: body.artist.trim(),
      price: parseFloat(body.price),
      imgUrl: body.imgUrl.trim(),
      category: body.category,
      stock: parseInt(body.stock, 10),
      description: body.description?.trim() || null,
    });

    await productCache.cacheProduct(product);
    await productCache.invalidateProductsList();
    return product;
  },

  async deleteProduct(id: number) {
    const orderItemsCount = await productRepository.countOrderItemsByProduct(id);
    if (orderItemsCount > 0) {
      throw new Error(
        'Cannot delete this product because it is already in customer orders. To hide the product, you can set its stock to 0.',
      );
    }

    await productRepository.delete(id);
    await productCache.deleteCachedProduct(id);
  },
};
