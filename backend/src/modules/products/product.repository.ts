import { prisma } from '../../config/prisma';

export const productRepository = {
  findMany: (category?: string) =>
    prisma.product.findMany({
      where: category ? { category } : {},
      orderBy: { id: 'asc' },
    }),
  findById: (id: number) => prisma.product.findUnique({ where: { id } }),
  create: (data: any) => prisma.product.create({ data }),
  update: (id: number, data: any) => prisma.product.update({ where: { id }, data }),
  delete: (id: number) => prisma.product.delete({ where: { id } }),
  countOrderItemsByProduct: (productId: number) =>
    prisma.orderItem.count({
      where: { productId },
    }),
};
