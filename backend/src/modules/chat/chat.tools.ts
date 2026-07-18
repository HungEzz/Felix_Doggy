import { productRepository } from '../products/product.repository';
import { orderRepository } from '../orders/order.repository';
import { adminRepository } from '../admin/admin.repository';
import { adminService } from '../admin/admin.service';

export interface UserContext {
  userId: string | null;
  role: 'USER' | 'ADMIN' | 'GUEST';
}

export interface ToolDef {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

const PUBLIC_TOOLS: ToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description:
        'YOU HAVE THE ABILITY to actually add products to the user\'s shopping cart — not just send links. Use this tool EVERY TIME the user wants to buy / add to cart / "add for me" / "order for me" / confirms purchase. Flow: first user asks to buy -> find product using search_products, ask confirmation "Would you like me to add X to your cart?". When user answers "ok/yes/sure/go ahead"... -> CALL this tool with confirmed=true. NEVER tell user to "click the link" — you do it directly.',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'number',
            description: 'The ID of the product to add.',
          },
          quantity: {
            type: 'number',
            description: 'The quantity to add. Defaults to 1.',
          },
          confirmed: {
            type: 'boolean',
            description: 'Must be true. If not confirmed yet, DO NOT call the tool, ask the user first.',
          },
        },
        required: ['productId', 'confirmed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_products',
      description:
        'Search products in the dog store by keyword, category, or price range. Use when customer asks about dogs, dog food, dog toys, dog clothes, or wants to find by price.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keyword (product name, brand, description). Leave blank if none.',
          },
          category: {
            type: 'string',
            enum: ['dogs', 'food', 'toys', 'clothes'],
            description: 'Filter by product category.',
          },
          max_price: {
            type: 'number',
            description: 'Maximum price (USD).',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return, defaults to 5.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_details',
      description: 'Retrieve detailed information of a product by ID.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'number', description: 'ID of the product.' },
        },
        required: ['productId'],
      },
    },
  },
];

const USER_TOOLS: ToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'get_my_orders',
      description:
        'Retrieve the order history of the currently logged-in user. Requires authentication. Returns id, status, total amount, and items.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

const ADMIN_TOOLS: ToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'list_all_orders',
      description:
        'ADMIN ONLY: List all orders in the system, optionally filtered by status.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
            description: 'Filter by order status.',
          },
          limit: { type: 'number', description: 'Maximum number of results, defaults to 10.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_order_details',
      description: 'ADMIN ONLY: Get detailed information of an order by ID.',
      parameters: {
        type: 'object',
        properties: {
          orderId: { type: 'string', description: 'Order ID (UUID).' },
        },
        required: ['orderId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_order_status',
      description:
        'ADMIN ONLY: Update an order\'s status. ALWAYS confirm with the user before calling this tool.',
      parameters: {
        type: 'object',
        properties: {
          orderId: { type: 'string', description: 'Order ID.' },
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
            description: 'The new status.',
          },
          confirmed: {
            type: 'boolean',
            description:
              'Must be true to confirm. If the user has not explicitly confirmed yet, ask again instead of calling the tool.',
          },
        },
        required: ['orderId', 'status', 'confirmed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_order',
      description:
        'ADMIN ONLY: PERMANENTLY delete an order from the system. This action CANNOT BE UNDONE. MUST ask for explicit confirmation from the user and only call when they agree.',
      parameters: {
        type: 'object',
        properties: {
          orderId: { type: 'string', description: 'ID of the order to delete.' },
          confirmed: {
            type: 'boolean',
            description:
              'Must be true. If the user has not explicitly said "agree/confirm/delete it" yet, DO NOT call the tool, ask again.',
          },
        },
        required: ['orderId', 'confirmed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_statistics',
      description:
        'ADMIN ONLY: Get general overview statistics (number of users, products, orders, total revenue).',
      parameters: { type: 'object', properties: {} },
    },
  },
];

export function getToolsForRole(role: UserContext['role']): ToolDef[] {
  if (role === 'ADMIN') return [...PUBLIC_TOOLS, ...USER_TOOLS, ...ADMIN_TOOLS];
  if (role === 'USER') return [...PUBLIC_TOOLS, ...USER_TOOLS];
  return PUBLIC_TOOLS;
}

const trimProduct = (p: any) => ({
  id: p.id,
  title: p.title,
  artist: p.artist,
  price: p.price,
  category: p.category,
  stock: p.stock,
  imgUrl: p.imgUrl,
  description: p.description ?? null,
});

const trimOrder = (o: any) => ({
  id: o.id,
  status: o.status,
  totalAmount: o.totalAmount,
  customerEmail: o.customerEmail,
  customerPhone: o.customerPhone,
  shippingAddr: o.shippingAddr,
  createdAt: o.createdAt,
  user: o.user
    ? { id: o.user.id, fullName: o.user.fullName, email: o.user.email }
    : null,
  items: (o.orderItems || []).map((it: any) => ({
    productId: it.productId,
    title: it.product?.title,
    quantity: it.quantity,
    priceAtTime: it.priceAtTime,
  })),
});

export interface ToolExecutionResult {
  result: any;
  action?: { type: 'add_to_cart'; product: any; quantity: number };
}

export async function executeTool(
  name: string,
  args: any,
  ctx: UserContext,
): Promise<ToolExecutionResult> {
  switch (name) {
    case 'add_to_cart': {
      if (!args.confirmed) {
        return {
          result: {
            error:
              'Unconfirmed. Strictly DO NOT add to cart before user explicitly agrees. Ask first.',
          },
        };
      }
      const product = await productRepository.findById(Number(args.productId));
      if (!product) {
        return { result: { error: 'Product not found with the given ID.' } };
      }
      const quantity = Math.max(1, Math.floor(Number(args.quantity) || 1));
      if (product.stock < quantity) {
        return {
          result: {
            error: `Product "${product.title}" only has ${product.stock} left in stock, cannot satisfy requested quantity of ${quantity}.`,
          },
        };
      }
      return {
        result: {
          success: true,
          message: `Added ${quantity} x "${product.title}" to cart successfully.`,
          product: trimProduct(product),
          quantity,
        },
        action: {
          type: 'add_to_cart',
          product: trimProduct(product),
          quantity,
        },
      };
    }

    case 'search_products': {
      const all = await productRepository.findMany(args.category);
      const query = (args.query || '').toLowerCase().trim();
      let filtered = all;
      if (query) {
        filtered = filtered.filter((p: any) =>
          `${p.title} ${p.artist} ${p.category} ${p.description || ''}`
            .toLowerCase()
            .includes(query),
        );
      }
      if (typeof args.max_price === 'number') {
        filtered = filtered.filter((p: any) => p.price <= args.max_price);
      }
      const limit = typeof args.limit === 'number' ? args.limit : 5;
      return {
        result: {
          count: filtered.length,
          products: filtered.slice(0, limit).map(trimProduct),
        },
      };
    }

    case 'get_product_details': {
      const product = await productRepository.findById(Number(args.productId));
      if (!product) return { result: { error: 'Product not found.' } };
      return { result: trimProduct(product) };
    }

    case 'get_my_orders': {
      if (!ctx.userId) {
        return { result: { error: 'You need to be logged in to view your orders.' } };
      }
      const orders = await orderRepository.findMyOrders(ctx.userId);
      return {
        result: {
          count: orders.length,
          orders: orders.map(trimOrder),
        },
      };
    }

    case 'list_all_orders': {
      if (ctx.role !== 'ADMIN') return { result: { error: 'Only admins can use this function.' } };
      const result: any = await adminService.getOrders();
      const all: any[] = Array.isArray(result) ? result : result.data || [];
      const filtered = args.status ? all.filter((o) => o.status === args.status) : all;
      const limit = typeof args.limit === 'number' ? args.limit : 10;
      return {
        result: {
          count: filtered.length,
          orders: filtered.slice(0, limit).map(trimOrder),
        },
      };
    }

    case 'get_order_details': {
      if (ctx.role !== 'ADMIN') return { result: { error: 'Only admins can use this function.' } };
      const order = await adminRepository.findOrderById(String(args.orderId));
      if (!order) return { result: { error: 'Order not found.' } };
      return { result: trimOrder(order) };
    }

    case 'update_order_status': {
      if (ctx.role !== 'ADMIN') return { result: { error: 'Only admins can use this function.' } };
      if (!args.confirmed) {
        return {
          result: { error: 'Unconfirmed. Please ask user to confirm before updating status.' },
        };
      }
      try {
        const updated = await adminService.updateOrderStatus(
          String(args.orderId),
          String(args.status),
        );
        return {
          result: { success: true, order: { id: updated.id, status: updated.status } },
        };
      } catch (e: any) {
        return { result: { error: e?.message || 'Error updating order.' } };
      }
    }

    case 'delete_order': {
      if (ctx.role !== 'ADMIN') return { result: { error: 'Only admins are allowed to delete orders.' } };
      if (!args.confirmed) {
        return {
          result: { error: 'Unconfirmed. Strictly DO NOT delete unless user has explicitly agreed.' },
        };
      }
      try {
        const deleted = await adminService.deleteOrder(String(args.orderId));
        return { result: { success: true, deletedOrderId: deleted.id } };
      } catch (e: any) {
        if (e?.code === 'P2025') return { result: { error: 'Order does not exist.' } };
        return { result: { error: e?.message || 'Error deleting order.' } };
      }
    }

    case 'get_statistics': {
      if (ctx.role !== 'ADMIN') return { result: { error: 'Only admins can use this function.' } };
      return { result: await adminService.getStats() };
    }

    default:
      return { result: { error: `Tool does not exist: ${name}` } };
  }
}
