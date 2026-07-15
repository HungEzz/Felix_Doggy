import { env } from '../../config/env';
import { productRepository } from '../products/product.repository';
import { executeTool, getToolsForRole, UserContext } from './chat.tools';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

const MAX_TOOL_HOPS = 5;

const buildSystemPrompt = (ctx: UserContext, cartItems: any[], path: string): string => {
  const roleLabel =
    ctx.role === 'ADMIN'
      ? 'ADMIN (full access: view all orders, edit/delete orders, view statistics)'
      : ctx.role === 'USER'
        ? 'LOGGED IN USER (view own orders only)'
        : 'GUEST (not logged in)';

  const cartSummary =
    Array.isArray(cartItems) && cartItems.length > 0
      ? `Current cart has ${cartItems.length} items: ${cartItems
        .map((c: any) => `${c.title} x${c.quantity}`)
        .join(', ')}.`
      : 'Cart is empty.';

  return `You are the AI assistant of the Classic Records store (selling Vinyl, CD, Merch).
Answer in English, short, and friendly. Basic HTML formatting (<br/>, <strong>, <a>) can be used.

USER'S CURRENT ROLE: ${roleLabel}.
Current path: ${path || 'unknown'}.
${cartSummary}

IMPORTANT RULES:
1. When user asks about products/orders/statistics -> MUST call the corresponding tool to retrieve real data, DO NOT make it up.
2. You CAN add products to the user's cart via the 'add_to_cart' tool. NEVER tell the user to 'click the link' — you can do it directly.
   - When the user says 'buy', 'add to cart', 'order', 'take this'... -> search the product using 'search_products', then ask a single confirmation question: 'Would you like me to add <name> to your cart?'.
   - When the user confirms ('ok', 'yes', 'add it', 'sure', 'please add')... -> IMMEDIATELY call 'add_to_cart' with confirmed=true. Do not ask again.
3. For write/delete actions (update_order_status, delete_order):
   - MUST ask for confirmation first.
   - Pass confirmed=true only if user agreed.
4. If user (non-admin) tries admin actions -> politely reject and suggest contacting an admin.
5. Format list items concisely: name, price, status.`;
};

const callDeepseek = async (
  messages: ChatMessage[],
  tools: any[],
): Promise<any> => {
  if (!env.DEEPSEEK_API_KEY) throw new Error('Missing DEEPSEEK_API_KEY');

  const response = await fetch(env.DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL,
      messages,
      tools: tools.length ? tools : undefined,
      tool_choice: tools.length ? 'auto' : undefined,
      temperature: 0.5,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek Error ${response.status}: ${body}`);
  }

  return response.json();
};

const callGemini = async (
  systemPrompt: string,
  history: any[],
  message: string,
): Promise<string> => {
  if (!env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const contents = [];
  let lastRole: 'user' | 'model' | null = null;

  for (const h of history) {
    const role = h.role === 'assistant' ? 'model' : 'user';
    const text = (h.content || '').trim();
    if (!text) continue;

    // Gemini requires the first message to be from 'user'
    if (contents.length === 0 && role === 'model') {
      continue;
    }

    if (lastRole === role) {
      // Merge consecutive messages of the same role
      const lastIndex = contents.length - 1;
      contents[lastIndex].parts[0].text += `\n${text}`;
    } else {
      contents.push({
        role,
        parts: [{ text }],
      });
      lastRole = role;
    }
  }

  // Add the current user message
  if (lastRole === 'user' && contents.length > 0) {
    const lastIndex = contents.length - 1;
    contents[lastIndex].parts[0].text += `\n${message}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini Error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Invalid response from Gemini');
  }
  return text;
};

const simpleFallback = async (message: string): Promise<string> => {
  const lower = message.toLowerCase();
  let category = '';
  if (lower.includes('vinyl') || lower.includes('records') || lower.includes('đĩa than') || lower.includes('than')) {
    category = 'VINYL';
  } else if (lower.includes('cd') || lower.includes('disc') || lower.includes('đĩa cd')) {
    category = 'CD';
  } else if (lower.includes('merch') || lower.includes('accessory') || lower.includes('phụ kiện')) {
    category = 'MERCH';
  }

  try {
    const products = await productRepository.findMany();
    let hits = [];
    
    if (category) {
      hits = products.filter((p: any) => p.category === category);
    } else {
      const words = lower.split(/\s+/).filter((w) => w.length >= 3);
      hits = products.filter((p: any) => {
        const text = `${p.title} ${p.artist} ${p.category}`.toLowerCase();
        return words.some((word) => text.includes(word));
      });
    }

    if (hits.length > 0) {
      const list = hits
        .slice(0, 5)
        .map((p: any) => `• <strong>${p.title}</strong> — ${p.artist} — $${p.price}`)
        .join('<br/>');
      return `The AI connection is currently offline. Here are some matching products found in the store:<br/>${list}`;
    }
  } catch (err) {
    console.error('Fallback search failed:', err);
  }
  return 'Sorry, the AI chatbot is currently unavailable or API keys are not configured (DEEPSEEK_API_KEY / GEMINI_API_KEY). Please try again later or contact our Hotline 1800-CLASSIC for quick assistance!';
};

export interface ChatActionPayload {
  type: 'add_to_cart';
  product: any;
  quantity: number;
}

export interface ChatResult {
  response: string;
  actions: ChatActionPayload[];
}

export const chatService = {
  generateResponse: async (
    message: string,
    history: any[],
    context: any = {},
    userCtx: UserContext = { userId: null, role: 'GUEST' },
  ): Promise<ChatResult> => {
    const cartItems = Array.isArray(context?.cart) ? context.cart : [];
    const path = context?.path || '';
    const systemPrompt = buildSystemPrompt(userCtx, cartItems, path);

    // 1. Try DeepSeek if configured
    if (env.DEEPSEEK_API_KEY) {
      const tools = getToolsForRole(userCtx.role).map((t) => ({
        type: t.type,
        function: t.function,
      }));

      const systemMsg: ChatMessage = {
        role: 'system',
        content: systemPrompt,
      };

      const recentHistory: ChatMessage[] = (history || [])
        .slice(-8)
        .map((h: any) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: String(h.content || ''),
        }));

      const messages: ChatMessage[] = [
        systemMsg,
        ...recentHistory,
        { role: 'user', content: message },
      ];

      const collectedActions: ChatActionPayload[] = [];

      try {
        for (let hop = 0; hop < MAX_TOOL_HOPS; hop++) {
          const data = await callDeepseek(messages, tools);
          const choice = data?.choices?.[0];
          const aiMessage = choice?.message;
          if (!aiMessage) break;

          const toolCalls = aiMessage.tool_calls;

          if (toolCalls && toolCalls.length > 0) {
            messages.push({
              role: 'assistant',
              content: aiMessage.content ?? null,
              tool_calls: toolCalls,
            });

            for (const call of toolCalls) {
              let args: any = {};
              try {
                args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
              } catch {
                args = {};
              }
              const { result, action } = await executeTool(call.function.name, args, userCtx);
              if (action) collectedActions.push(action as ChatActionPayload);
              messages.push({
                role: 'tool',
                tool_call_id: call.id,
                name: call.function.name,
                content: JSON.stringify(result),
              });
            }
            continue;
          }

          return {
            response:
              (aiMessage.content as string) || "I am not sure what you mean, could you please rephrase?",
            actions: collectedActions,
          };
        }
        return {
          response:
            "I need more steps to process this request. Could you please break your question down into smaller parts?",
          actions: collectedActions,
        };
      } catch (err: any) {
        console.error('DeepSeek chat failed, trying Gemini backup...', err?.message || err);
      }
    }

    // 2. Try Gemini backup if configured
    if (env.GEMINI_API_KEY) {
      try {
        const responseText = await callGemini(systemPrompt, history || [], message);
        return { response: responseText, actions: [] };
      } catch (err: any) {
        console.error('Gemini chat backup failed:', err?.message || err);
      }
    }

    // 3. Fallback to smart local product matching
    return { response: await simpleFallback(message), actions: [] };
  },
};
