import { prisma } from '../../config/prisma';

export const orderRepository = {
  createCheckoutOrder: (
    userId: string | null,
    customerEmail: string,
    customerPhone: string,
    shippingAddr: string,
    items: any[],
    paymentMethod: string = 'cod',
  ) =>
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

      // Set initial status based on payment method:
      // - COD: order is immediately PENDING (confirmed)
      // - PayOS: order is PENDING_PAYMENT until webhook confirms payment
      const status = paymentMethod === 'payos' ? 'PENDING_PAYMENT' : 'PENDING';

      return tx.order.create({
        data: {
          userId,
          customerEmail,
          customerPhone,
          shippingAddr,
          totalAmount,
          status,
          paymentMethod,
          orderItems: { create: orderItemsData },
        },
        include: { orderItems: { include: { product: true } } },
      });
    }),

  /**
   * Update order after successful PayOS payment.
   * Sets status to PENDING (payment confirmed), stores paymentId and paidAt timestamp.
   */
  updateOrderPayment: (orderCode: number, paymentId: string) =>
    prisma.order.update({
      where: { orderCode },
      data: {
        status: 'PENDING',
        paymentId,
        paidAt: new Date(),
      },
      include: { orderItems: { include: { product: true } } },
    }),

  /**
   * Find order by PayOS orderCode (Int).
   */
  findOrderByCode: (orderCode: number) =>
    prisma.order.findUnique({
      where: { orderCode },
      include: { orderItems: { include: { product: true } } },
    }),

  findMyOrders: (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
};
