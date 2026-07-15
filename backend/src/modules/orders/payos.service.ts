import PayOS from '@payos/node';
import { env } from '../../config/env';

// Initialize PayOS SDK with credentials from environment
const payos = new PayOS(
  env.PAYOS_CLIENT_ID,
  env.PAYOS_API_KEY,
  env.PAYOS_CHECKSUM_KEY,
);

interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
}

interface CreatePaymentLinkParams {
  orderCode: number;
  amount: number;
  description: string;
  items: PaymentItem[];
}

export const payosService = {
  /**
   * Create a PayOS payment link for an order.
   * Returns the checkoutUrl to redirect the user to PayOS checkout page.
   */
  async createPaymentLink(params: CreatePaymentLinkParams) {
    const { orderCode, amount, description, items } = params;

    const paymentLink = await payos.createPaymentLink({
      orderCode,
      amount: Math.round(amount), // PayOS requires integer VND amount
      description: description.substring(0, 25), // PayOS limits description to 25 chars
      items: items.map((item) => ({
        name: item.name.substring(0, 256),
        quantity: item.quantity,
        price: Math.round(item.price),
      })),
      returnUrl: `${env.FRONTEND_URL}/order-success?orderCode=${orderCode}`,
      cancelUrl: `${env.FRONTEND_URL}/checkout`,
    });

    return paymentLink;
  },

  /**
   * Verify webhook data from PayOS using checksum signature.
   * Throws if signature is invalid.
   */
  verifyWebhookData(body: any) {
    return payos.verifyPaymentWebhookData(body);
  },

  /**
   * Get payment information from PayOS API by orderCode.
   * Used to double-check payment status when webhook hasn't arrived yet.
   */
  async getPaymentInfo(orderCode: number) {
    return payos.getPaymentLinkInformation(orderCode);
  },
};
