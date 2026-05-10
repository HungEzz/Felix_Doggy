import { Router } from 'express';
import { productController } from './product.controller';
import { verifyAdmin } from '../../middlewares/auth';

export const productRoutes = Router();

productRoutes.get('/', productController.getProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', verifyAdmin, productController.createProduct);
productRoutes.put('/:id', verifyAdmin, productController.updateProduct);
productRoutes.delete('/:id', verifyAdmin, productController.deleteProduct);
