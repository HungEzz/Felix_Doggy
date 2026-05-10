import { prisma } from '../../config/prisma';

export const orderRepository = {
  createCheckoutOrder: (userId: string | null, customerEmail: string, customerPhone: string, shippingAddr: string, items: any[]) =>
    prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Product ID ${item.id} not found`);
        if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.title}`);

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        totalAmount += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtTime: product.price,
        });
      }

      return tx.order.create({
        data: {
          userId,
          customerEmail,
          customerPhone,
          shippingAddr,
          totalAmount,
          status: 'PENDING',
          orderItems: { create: orderItemsData },
        },
        include: { orderItems: true },
      });
    }),
  findMyOrders: (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
};
