import { Request, Response } from 'express';
import { productService } from './product.service';

export const productController = {
  async getProducts(req: Request, res: Response) {
    try {
      const category = req.query.category ? String(req.query.category) : undefined;
      const products = await productService.getProducts(category);
      res.json(products);
    } catch (error) {
      console.error('GET /api/products error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error('GET /api/products/:id error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('POST /api/products error:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await productService.updateProduct(id, req.body);
      res.json(product);
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('PUT /api/products error:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await productService.deleteProduct(id);
      res.json({ message: 'Product deleted' });
    } catch (error: any) {
      if (error.message?.includes('Cannot delete')) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('DELETE /api/products error:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  },
};
