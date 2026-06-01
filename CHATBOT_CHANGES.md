# Tổng kết: Tích hợp Chatbot DeepSeek V3.2

Tài liệu này ghi lại toàn bộ thay đổi trong session, từ việc thay chatbot Gemini/HF cũ sang chatbot mới dùng **DeepSeek V3.2 + function calling**, có khả năng thao tác thật vào hệ thống (xem đơn, xóa đơn admin, thêm vào giỏ hàng…).

---

## 1. Mục tiêu

User yêu cầu: chatbot tự động tương tác với toàn bộ project — tìm sản phẩm, xem/xóa/sửa đơn, xem thống kê, thêm vào giỏ — qua mô hình `deepseek-chat` (V3.2).

Phân quyền theo JWT đính kèm trong request:

| Role     | Quyền                                                                 |
| -------- | --------------------------------------------------------------------- |
| GUEST    | Tìm sản phẩm, xem chi tiết sản phẩm, thêm vào giỏ                     |
| USER     | Như GUEST + xem đơn của chính mình                                    |
| ADMIN    | Toàn quyền: liệt kê/xem mọi đơn, sửa trạng thái, xóa đơn, xem thống kê |

---

## 2. Các file đã sửa / tạo mới

### Backend

| File                                              | Loại    | Mô tả                                                                    |
| ------------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| `backend/src/config/env.ts`                       | Sửa     | Đổi default DeepSeek sang `api.deepseek.com/chat/completions` + `deepseek-chat` |
| `backend/src/modules/admin/admin.repository.ts`   | Sửa     | Thêm `findOrderById`, `deleteOrder` (xóa cascade orderItems trong transaction) |
| `backend/src/modules/admin/admin.service.ts`      | Sửa     | Thêm `getOrderById`, `deleteOrder`                                       |
| `backend/src/modules/admin/admin.controller.ts`   | Sửa     | Thêm handler `deleteOrder` (xử lý lỗi P2025 → 404)                       |
| `backend/src/modules/admin/admin.routes.ts`       | Sửa     | Thêm route `DELETE /api/admin/orders/:id`                                |
| `backend/src/modules/chat/chat.tools.ts`          | **Mới** | Định nghĩa 9 tool + handler, phân quyền theo role                        |
| `backend/src/modules/chat/chat.service.ts`        | Sửa     | Viết lại hoàn toàn — function-calling loop max 5 hops + collect actions  |
| `backend/src/modules/chat/chat.controller.ts`     | Sửa     | Extract JWT từ header → resolve role → truyền vào service                |

### Frontend

| File                                  | Loại | Mô tả                                                                          |
| ------------------------------------- | ---- | ------------------------------------------------------------------------------ |
| `frontend/src/components/ChatBot.tsx` | Sửa  | Gắn `Authorization` header, dispatch `addToCart`, fix auto-scroll, idle 30 phút |

### Infra

| File                | Loại    | Mô tả                                                              |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `docker-compose.yml`| Sửa     | Inject `${DEEPSEEK_API_KEY}`, đổi URL + model                      |
| `.env` (root)       | **Mới** | Cho `docker compose up` đọc qua `${DEEPSEEK_API_KEY}`              |
| `backend/.env`      | **Mới** | Cho `npm run dev` chạy local                                       |
| `.gitignore` (root) | Sửa     | Thêm `.env`, `backend/.env` để không leak key                      |

---

## 3. Danh sách tool và mục đích

### Tool công khai (mọi role)

| Tool                  | Mục đích                                                          |
| --------------------- | ----------------------------------------------------------------- |
| `search_products`     | Tìm sản phẩm theo query / category / max_price                    |
| `get_product_details` | Lấy chi tiết 1 sản phẩm                                           |
| `add_to_cart`         | **Có xác nhận**. Thêm sản phẩm vào giỏ phía client qua action     |

### Tool USER (cần đăng nhập)

| Tool             | Mục đích                                |
| ---------------- | --------------------------------------- |
| `get_my_orders`  | Lấy danh sách đơn của user hiện tại     |

### Tool ADMIN (cần role=ADMIN)

| Tool                    | Mục đích                                       |
| ----------------------- | ---------------------------------------------- |
| `list_all_orders`       | Liệt kê mọi đơn, lọc theo status               |
| `get_order_details`     | Xem chi tiết một đơn bất kỳ                    |
| `update_order_status`   | **Có xác nhận**. Đổi trạng thái đơn            |
| `delete_order`          | **Có xác nhận**. Xóa hẳn đơn khỏi DB           |
| `get_statistics`        | Thống kê users/products/orders/revenue        |

---

## 4. Cơ chế an toàn (defense in depth)

Mọi tool ghi/xóa đều có 3 lớp bảo vệ:

1. **Tool description** ép model phải xin xác nhận trước khi truyền `confirmed=true`.
2. **System prompt** liệt kê từ khóa xác nhận hợp lệ ("ok", "đồng ý", "xóa", "thêm đi"…) — và quy tắc tuyệt đối không tự thực hiện khi user chưa rõ ràng.
3. **Server-side guard** trong `executeTool`: re-check `ctx.role === 'ADMIN'` và `args.confirmed === true` bất kể prompt nói gì — kể cả prompt injection cũng không bypass được.

JWT verify qua DB (giống `verifyUser` middleware) → token giả/expired tự fallback về GUEST.

---

## 5. Function-calling loop hoạt động ra sao

```
[user message] ──► chat.controller (decode JWT) ──► chat.service
                                                      │
                                                      ▼
                              ┌─────────────────────────────────────┐
                              │  Loop (max 5 hops):                 │
                              │   1. Gọi DeepSeek với messages+tools│
                              │   2. Nếu response có tool_calls →   │
                              │      executeTool(name, args, ctx)   │
                              │      thu action (nếu có)            │
                              │      push tool result vào messages  │
                              │      → quay lại bước 1              │
                              │   3. Nếu không có tool_call →       │
                              │      return {response, actions[]}   │
                              └─────────────────────────────────────┘
                                                      │
                                                      ▼
                  ChatBot.tsx render text + dispatch(addToCart) cho mỗi action
```

---

## 6. Add to cart qua chatbot

Flow:

1. User: "tôi muốn mua đĩa của Taylor Swift"
2. Bot: gọi `search_products` → tìm thấy "Midnights" id=12, $38.50
3. Bot trả lời: "Bạn xác nhận thêm Midnights vào giỏ chứ?"
4. User: "ok, thêm giúp tôi"
5. Bot: gọi `add_to_cart({productId: 12, quantity: 1, confirmed: true})`
6. Tool handler check stock → trả về `{result: {success}, action: {type:'add_to_cart', product, quantity}}`
7. `chat.service` collect action, gửi kèm response về frontend
8. `ChatBot.tsx` dispatch `addToCart` → Redux update → giỏ hàng cập nhật real-time

System prompt nhấn mạnh: **TUYỆT ĐỐI KHÔNG bảo user "tự bấm link" để thêm — bạn làm được trực tiếp.**

---

## 7. Frontend ChatBot — các cải tiến đã làm

### 7.1. Authorization header tự động

```ts
const token = localStorage.getItem('token');
if (token) headers['Authorization'] = `Bearer ${token}`;
```

Backend tự decode → biết user là GUEST/USER/ADMIN → quyết định bộ tool exposed.

### 7.2. Auto-scroll trong khung chat

**Vấn đề ban đầu**: `scrollIntoView` cũ cuộn cả trang web. Sau khi đổi sang `scrollTop = scrollHeight` thì với HTML có ảnh sản phẩm vẫn cuộn không tới đáy vì ảnh load chậm hơn DOM commit.

**Fix cuối cùng**:
- `requestAnimationFrame` 2 lần để chắc chắn layout xong.
- `behavior: 'smooth'` cho UX mượt.
- Gắn listener `img.load` / `img.error` trên từng ảnh trong khung → ảnh load xong tự cuộn lại.
- Deps bao gồm `messages`, `isLoading`, `isOpen`, `isMinimized` — chạy đúng cả khi mở chatbox lại.

### 7.3. Xóa lịch sử sau 30 phút không hoạt động

- Mỗi lần messages thay đổi → ghi `LAST_ACTIVITY_KEY` vào localStorage + rearm `setTimeout(30min)`.
- Khi mount: nếu `Date.now() - lastActivity > 30 * 60 * 1000` → reset về greeting mặc định.
- Khi tab đang mở quá 30p không tương tác → timer fire → tự clear messages + localStorage.

### 7.4. Dispatch addToCart từ response

Backend gửi `{response, actions: [{type:'add_to_cart', product, quantity}]}` → `applyChatActions` loop qua actions → `dispatch(addToCart({product, quantity}))`.

---

## 8. Cấu hình môi trường

### Local dev (`npm run dev`)

`backend/.env`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:root@localhost:5432/record_store?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecretkey_for_record_store_2026
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
DEEPSEEK_MODEL=deepseek-chat
```

### Docker (`docker compose up`)

Chỉ cần root `.env`:
```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

`docker-compose.yml` đọc `${DEEPSEEK_API_KEY}` và inject vào backend container.

---

## 9. Lệnh chạy

```bash
# Lần đầu hoặc sau khi thay đổi code backend/frontend:
docker compose up -d --build backend frontend

# Quan trọng: sau khi frontend/backend rebuild, restart gateway để
# nginx pick up IP container mới (xem mục 10):
docker restart record_store_gateway
```

Mở `http://localhost:8080`.

Lưu ý: KHÔNG vào `http://localhost:3000` — backend cố tình không expose ra host, mọi traffic phải đi qua gateway.

---

## 10. Vấn đề Gateway 502 & cách fix

**Triệu chứng**: sau khi rebuild frontend/backend, vào `localhost:8080` báo `502 Bad Gateway`.

**Nguyên nhân**: nginx của `record_store_gateway` resolve hostname `frontend`/`backend` 1 lần lúc start rồi cache. Khi container bị rebuild, Docker cấp IP mới nhưng nginx vẫn cố nối IP cũ.

**Fix tạm thời** (đã làm):
```bash
docker restart record_store_gateway
```

**Fix vĩnh viễn** (chưa apply, tùy chọn) — sửa `api-gateway/nginx.conf` để nginx re-resolve DNS định kỳ:
```nginx
resolver 127.0.0.11 valid=10s;  # Docker internal DNS

location / {
    set $frontend_upstream http://frontend:80;
    proxy_pass $frontend_upstream;
    ...
}
```

---

## 11. Cách test các tính năng

### Khi đã đăng nhập làm USER

- "Tìm vinyl của The Beatles" → search_products
- "Tôi muốn mua đĩa Midnights" → search + hỏi xác nhận
- "OK thêm vào giỏ" → tool add_to_cart, giỏ hàng tăng
- "Cho xem đơn của tôi" → get_my_orders

### Khi đăng nhập làm ADMIN

- "Cho tôi xem tất cả đơn pending" → list_all_orders
- "Xem chi tiết đơn abc-xyz" → get_order_details
- "Sửa đơn abc-xyz thành COMPLETED" → bot hỏi xác nhận → "ok" → update_order_status
- "Xóa đơn abc-xyz" → bot hỏi xác nhận → "đồng ý" → delete_order
- "Thống kê doanh thu" → get_statistics

### Auto-scroll & idle

- Chat liên tục → khung tự cuộn xuống mỗi message mới (kể cả khi có ảnh).
- Đóng tab 30p, mở lại → lịch sử bị xóa, hiện greeting mặc định.

---

## 12. Edge case & ghi chú

- DeepSeek đôi khi vẫn "ngần ngại" gọi tool nếu lịch sử chat cũ có model tự nói "không thể". Xóa localStorage `classic_records_chat_messages` để reset context.
- `add_to_cart` chỉ check stock ở backend (DB), không khóa stock — checkout mới giảm stock thật.
- Token JWT hết hạn → user fallback về GUEST, vẫn dùng được search/add_to_cart, mất quyền xem đơn.
- Các lỗi TS `1287/1295` (ECMAScript vs CommonJS) trong IDE diagnostics là pre-existing toàn project, không liên quan thay đổi này.
