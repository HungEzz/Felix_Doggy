# 📋 AGILE-SCRUM DOCUMENTATION

## Record Store — Fullstack E-Commerce

---

## 1. Thông tin dự án

| Mục                   | Nội dung                                                              |
| --------------------- | --------------------------------------------------------------------- |
| **Tên dự án**         | Record Store — Fullstack E-Commerce                                   |
| **Mô tả**             | Ứng dụng web mua sắm đĩa nhạc (Vinyl, CD) và Merchandise hoàn chỉnh |
| **Phương pháp**       | Agile — Scrum Framework                                               |
| **Độ dài Sprint**     | 2 tuần / sprint                                                       |
| **Tổng số Sprint**    | 4 sprints + 1 tuần buffer                                             |
| **Thời gian**         | 01/04/2026 – 01/06/2026 (2 tháng)                                    |

### Timeline tổng quan

```
Tháng 4/2026                            Tháng 5/2026
01   07   14   21   28   05   12   19   26   01/06
├────────────┼────────────┼────────────┼────────────┼──────┤
│  Sprint 1  │  Sprint 2  │  Sprint 3  │  Sprint 4  │Buffer│
│ Foundation │  Shopping  │  Security  │  DevOps &  │ QA & │
│  & Setup   │   Flow     │  & AI      │  Dashboard │Polish│
└────────────┴────────────┴────────────┴────────────┴──────┘
```

---

## 2. Thành viên nhóm & Vai trò Scrum

| Thành viên     | Vai trò Scrum                  | Phạm vi công việc                                                          |
| -------------- | ------------------------------ | -------------------------------------------------------------------------- |
| **Hưng**       | Scrum Master + Lead Developer  | Toàn bộ Backend, Frontend Admin Dashboard, DevOps, Kiến trúc hệ thống     |
| **Phát**       | Developer (Frontend)           | Toàn bộ Frontend khách hàng (UI/UX, trang sản phẩm, giỏ hàng, thanh toán)|
| **Toản**       | Developer (AI)                 | Tính năng AI ChatBot tư vấn bán hàng                                      |
| **Giảng viên** | Product Owner                  | Xác định yêu cầu, nhận demo cuối sprint, đánh giá                         |

### Scrum Ceremonies

| Ceremony             | Tần suất                  | Thời lượng |
| -------------------- | ------------------------- | ---------- |
| Sprint Planning      | Đầu mỗi sprint           | 1 giờ      |
| Daily Standup        | Hàng ngày (trừ cuối tuần) | 15 phút    |
| Sprint Review (Demo) | Cuối mỗi sprint           | 30 phút    |
| Sprint Retrospective | Cuối mỗi sprint           | 30 phút    |

---

## 3. Product Backlog

### 3.1 Epic 1: Quản lý Sản phẩm

| ID    | User Story                                                                                                   | Assignee                       | Priority      | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------------------------ | ------------------------------ | ------------- | -- | -------- |
| US-01 | Là **khách hàng**, tôi muốn xem danh sách tất cả sản phẩm để duyệt và chọn mua.                             | **Hưng** (API) + **Phát** (UI) | 🔴 Cao        | 3  | Sprint 1 |
| US-02 | Là **khách hàng**, tôi muốn lọc sản phẩm theo danh mục (Vinyl, CD, Merch).                                   | **Phát**                       | 🔴 Cao        | 2  | Sprint 1 |
| US-03 | Là **khách hàng**, tôi muốn xem chi tiết sản phẩm (ảnh, giá, mô tả, tồn kho).                                | **Phát**                       | 🔴 Cao        | 2  | Sprint 2 |
| US-04 | Là **admin**, tôi muốn thêm sản phẩm mới kèm ảnh để cập nhật kho hàng.                                       | **Hưng**                       | 🔴 Cao        | 5  | Sprint 2 |
| US-05 | Là **admin**, tôi muốn chỉnh sửa thông tin sản phẩm (giá, tồn kho, mô tả).                                   | **Hưng**                       | 🟡 Trung bình | 3  | Sprint 2 |
| US-06 | Là **admin**, tôi muốn xóa sản phẩm (khi chưa có đơn hàng).                                                  | **Hưng**                       | 🟡 Trung bình | 2  | Sprint 2 |

### 3.2 Epic 2: Giỏ hàng & Thanh toán

| ID    | User Story                                                                                                   | Assignee                         | Priority | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------------------------ | -------------------------------- | -------- | -- | -------- |
| US-07 | Là **khách hàng**, tôi muốn thêm sản phẩm vào giỏ hàng để mua nhiều món cùng lúc.                            | **Phát** (UI) + **Hưng** (Redux) | 🔴 Cao   | 3  | Sprint 2 |
| US-08 | Là **khách hàng**, tôi muốn thay đổi số lượng và xóa sản phẩm trong giỏ hàng.                                | **Phát**                         | 🔴 Cao   | 2  | Sprint 2 |
| US-09 | Là **khách hàng**, tôi muốn xem tổng tiền giỏ hàng cập nhật theo thời gian thực.                             | **Phát**                         | 🔴 Cao   | 1  | Sprint 2 |
| US-10 | Là **khách hàng**, tôi muốn điền thông tin giao hàng và xác nhận đặt hàng.                                   | **Phát** (UI) + **Hưng** (API)   | 🔴 Cao   | 5  | Sprint 2 |
| US-11 | Là **hệ thống**, tôi cần kiểm tra tồn kho và trừ số lượng khi checkout (transaction).                        | **Hưng**                         | 🔴 Cao   | 5  | Sprint 2 |

### 3.3 Epic 3: Xác thực & Phân quyền

| ID    | User Story                                                                                 | Assignee                            | Priority      | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------- | ------------- | -- | -------- |
| US-12 | Là **khách hàng**, tôi muốn đăng ký tài khoản với email và mật khẩu.                       | **Hưng** (API+OTP) + **Phát** (UI) | 🔴 Cao        | 3  | Sprint 3 |
| US-13 | Là **khách hàng**, tôi muốn đăng nhập để xem lịch sử đơn hàng.                             | **Hưng** (API+JWT) + **Phát** (UI) | 🔴 Cao        | 3  | Sprint 3 |
| US-14 | Là **hệ thống**, tôi cần bảo vệ các API admin bằng JWT.                                    | **Hưng**                            | 🔴 Cao        | 3  | Sprint 3 |
| US-15 | Là **khách hàng đã đăng nhập**, tôi muốn xem lịch sử tất cả đơn hàng.                      | **Hưng** (API) + **Phát** (UI)      | 🟡 Trung bình | 3  | Sprint 3 |
| US-24 | Là **khách hàng**, tôi muốn xác thực email bằng OTP khi đăng ký.                           | **Hưng**                            | 🔴 Cao        | 3  | Sprint 3 |
| US-25 | Là **khách hàng**, tôi muốn đặt lại mật khẩu qua email OTP khi quên.                       | **Hưng**                            | 🟡 Trung bình | 3  | Sprint 3 |
| US-26 | Là **khách hàng**, tôi muốn cập nhật thông tin cá nhân và đổi mật khẩu.                    | **Hưng** (API) + **Phát** (UI)      | 🟡 Trung bình | 2  | Sprint 3 |

### 3.4 Epic 4: Hiệu năng & Bảo mật

| ID    | User Story                                                                                        | Assignee | Priority      | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------------- | -------- | ------------- | -- | -------- |
| US-16 | Là **hệ thống**, tôi cần cache danh sách sản phẩm bằng Redis để giảm tải database.               | **Hưng** | 🟡 Trung bình | 5  | Sprint 3 |
| US-17 | Là **hệ thống**, tôi cần giới hạn đăng nhập thất bại (5 lần/15 phút) để chống brute-force.       | **Hưng** | 🔴 Cao        | 3  | Sprint 3 |
| US-18 | Là **hệ thống**, tôi cần giới hạn request (100 req/15 phút/IP) để chống DDoS.                    | **Hưng** | 🟡 Trung bình | 2  | Sprint 3 |

### 3.5 Epic 5: AI ChatBot

| ID    | User Story                                                                                             | Assignee | Priority      | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------------------ | -------- | ------------- | -- | -------- |
| US-27 | Là **khách hàng**, tôi muốn chat với trợ lý ảo để được tư vấn sản phẩm.                               | **Toản** | 🟡 Trung bình | 5  | Sprint 3 |
| US-28 | Là **hệ thống**, ChatBot cần tích hợp dữ liệu sản phẩm thực từ API.                                  | **Toản** | 🟡 Trung bình | 3  | Sprint 3 |
| US-29 | Là **khách hàng**, tôi muốn ChatBot có gợi ý nhanh cho các câu hỏi phổ biến.                          | **Toản** | 🟢 Thấp       | 2  | Sprint 3 |
| US-37 | Là **khách hàng**, tôi muốn ChatBot tích hợp AI (Claude) để trả lời thông minh hơn.                   | **Toản** | 🟡 Trung bình | 5  | Sprint 4 |
| US-38 | Là **hệ thống**, ChatBot cần fallback sang rule-based khi AI API không khả dụng.                       | **Toản** | 🔴 Cao        | 3  | Sprint 4 |
| US-39 | Là **khách hàng**, tôi muốn ChatBot hiển thị typing indicator và animation mượt mà.                   | **Toản** | 🟢 Thấp       | 2  | Sprint 4 |

### 3.6 Epic 6: Admin Dashboard & Thống kê

| ID    | User Story                                                                                               | Assignee | Priority      | SP | Sprint   |
| ----- | -------------------------------------------------------------------------------------------------------- | -------- | ------------- | -- | -------- |
| US-30 | Là **admin**, tôi muốn xem thống kê doanh thu, đơn hàng, sản phẩm, người dùng trên dashboard.          | **Hưng** | 🟡 Trung bình | 5  | Sprint 4 |
| US-31 | Là **admin**, tôi muốn quản lý danh sách đơn hàng (xem, cập nhật trạng thái).                           | **Hưng** | 🔴 Cao        | 3  | Sprint 4 |
| US-32 | Là **admin**, tôi muốn quản lý người dùng (xem danh sách, xem thông tin).                               | **Hưng** | 🟡 Trung bình | 2  | Sprint 4 |
| US-33 | Là **admin**, tôi muốn xem thống kê tồn kho chi tiết.                                                  | **Hưng** | 🟡 Trung bình | 3  | Sprint 4 |

### 3.7 Epic 7: DevOps & Độ tin cậy

| ID    | User Story                                                                                                     | Assignee | Priority      | SP | Sprint   |
| ----- | -------------------------------------------------------------------------------------------------------------- | -------- | ------------- | -- | -------- |
| US-19 | Là **developer**, tôi muốn toàn bộ hệ thống chạy trên Docker Compose (5 services).                            | **Hưng** | 🔴 Cao        | 5  | Sprint 4 |
| US-20 | Là **developer**, tôi muốn có API Gateway (Nginx) để tập trung routing.                                       | **Hưng** | 🟡 Trung bình | 3  | Sprint 4 |
| US-21 | Là **developer**, tôi muốn CI/CD pipeline tự động build và deploy.                                            | **Hưng** | 🟡 Trung bình | 5  | Sprint 4 |
| US-22 | Là **hệ thống**, tôi cần cơ chế Retry (Exponential Backoff) khi gặp lỗi.                                     | **Hưng** | 🟡 Trung bình | 5  | Sprint 4 |
| US-23 | Là **hệ thống**, tôi cần healthcheck cho từng Docker service.                                                 | **Hưng** | 🟡 Trung bình | 3  | Sprint 4 |

### 3.8 Epic 8: Giao diện bổ sung & Polish

| ID    | User Story                                                                                  | Assignee | Priority      | SP | Sprint   |
| ----- | ------------------------------------------------------------------------------------------- | -------- | ------------- | -- | -------- |
| US-34 | Là **khách hàng**, tôi muốn xem trang Liên hệ, FAQ, Chính sách giao hàng.                 | **Phát** | 🟢 Thấp       | 2  | Sprint 4 |
| US-35 | Là **khách hàng**, tôi muốn giao diện hỗ trợ Dark Mode.                                    | **Phát** | 🟢 Thấp       | 3  | Sprint 4 |
| US-36 | Là **khách hàng**, tôi muốn trang chủ có banner nổi bật và sản phẩm đề xuất.               | **Phát** | 🟡 Trung bình | 3  | Sprint 1 |

---

## 4. Sprint Planning & Phân công chi tiết

---

### 🏃 Sprint 1 — Foundation & Setup

> **Thời gian:** 01/04/2026 – 14/04/2026 (2 tuần)
>
> **Mục tiêu:** Thiết lập nền tảng dự án, xây dựng trang sản phẩm cơ bản.

#### 🟢 Hưng — Backend Setup & Product API

| Task                                                   | Estimate | Status  |
| ------------------------------------------------------ | -------- | ------- |
| Khởi tạo project Express + TypeScript                  | 2h       | ✅ Done |
| Thiết kế Prisma Schema (User, Product, Order, OrderItem)| 3h       | ✅ Done |
| Setup kết nối PostgreSQL + Prisma Client                | 2h       | ✅ Done |
| Tạo API `GET /api/products` (danh sách + filter)       | 3h       | ✅ Done |
| Tạo API `GET /api/products/:id` (chi tiết sản phẩm)   | 2h       | ✅ Done |
| Seed data 20+ sản phẩm vào database                    | 2h       | ✅ Done |
| Setup cấu trúc modular: modules, config, middlewares    | 2h       | ✅ Done |
| Setup biến môi trường (`env.ts`)                       | 1h       | ✅ Done |

**Subtotal: ~17h**

#### 🔵 Phát — Frontend Setup & Product Pages

| Task                                                       | Estimate | Status  |
| ---------------------------------------------------------- | -------- | ------- |
| Khởi tạo Vite + React + TypeScript                         | 1h       | ✅ Done |
| Cấu hình Tailwind CSS v4 + Google Fonts                    | 2h       | ✅ Done |
| Thiết kế Design System (`index.css`: tokens, utilities)     | 4h       | ✅ Done |
| Build component Navbar (responsive, navigation)             | 3h       | ✅ Done |
| Build component Footer                                      | 2h       | ✅ Done |
| Build trang Home: HeroBanner + FeaturedProducts             | 5h       | ✅ Done |
| Build trang Vinyl (danh sách + filter)                      | 2h       | ✅ Done |
| Build trang CD (danh sách + filter)                         | 1h       | ✅ Done |
| Build trang Merch (danh sách + filter)                      | 1h       | ✅ Done |
| Build component ProductCard                                 | 3h       | ✅ Done |
| Build component ProductFilterBar (sắp xếp, tìm kiếm)       | 3h       | ✅ Done |

**Subtotal: ~27h**

#### 🟣 Toản — Research & Prototype AI

| Task                                                        | Estimate | Status  |
| ----------------------------------------------------------- | -------- | ------- |
| Nghiên cứu kiến trúc chatbot: rule-based vs AI hybrid      | 4h       | ✅ Done |
| Khảo sát các AI API phù hợp (Anthropic, OpenAI, Gemini)    | 3h       | ✅ Done |
| Thiết kế luồng hội thoại và các intent chính                | 3h       | ✅ Done |
| Prototype rule-based engine cơ bản (console test)           | 4h       | ✅ Done |
| Viết tài liệu thiết kế ChatBot (flow diagram, intent map)  | 2h       | ✅ Done |

**Subtotal: ~16h**

**Velocity Sprint 1: 13 Story Points**

---

### 🏃 Sprint 2 — Shopping Flow

> **Thời gian:** 15/04/2026 – 28/04/2026 (2 tuần)
>
> **Mục tiêu:** Hoàn thiện luồng mua sắm end-to-end: xem chi tiết → giỏ hàng → thanh toán → xác nhận.

#### 🟢 Hưng — Order API & Admin CRUD

| Task                                                           | Estimate | Status  |
| -------------------------------------------------------------- | -------- | ------- |
| Tạo API `POST /api/orders/checkout` với Prisma Transaction     | 5h       | ✅ Done |
| Tạo Admin CRUD API: thêm/sửa/xóa sản phẩm                     | 4h       | ✅ Done |
| Upload ảnh sản phẩm (Multer middleware)                         | 2h       | ✅ Done |
| Build trang Admin Products (Frontend CRUD sản phẩm)             | 5h       | ✅ Done |
| Setup Redux Toolkit: cartSlice + productSlice                   | 3h       | ✅ Done |
| Setup Axios service layer + base URL config                     | 2h       | ✅ Done |
| Xử lý lỗi tồn kho: rollback transaction khi hết hàng          | 2h       | ✅ Done |

**Subtotal: ~23h**

#### 🔵 Phát — Product Detail, Cart & Checkout UI

| Task                                                           | Estimate | Status  |
| -------------------------------------------------------------- | -------- | ------- |
| Build trang ProductDetail (ảnh, giá, mô tả, nút thêm giỏ)     | 5h       | ✅ Done |
| Build trang Cart: hiển thị, tăng/giảm số lượng, xóa            | 5h       | ✅ Done |
| Build trang Checkout: form thông tin giao hàng + thanh toán     | 5h       | ✅ Done |
| Build trang OrderSuccess: xác nhận đặt hàng thành công          | 2h       | ✅ Done |
| Build component ScrollToTop                                    | 0.5h     | ✅ Done |
| Tích hợp ProductCard với API thực (không dùng mock data)        | 2h       | ✅ Done |
| Responsive testing và fix layout cho mobile                     | 2h       | ✅ Done |

**Subtotal: ~21.5h**

#### 🟣 Toản — ChatBot UI Foundation

| Task                                                           | Estimate | Status  |
| -------------------------------------------------------------- | -------- | ------- |
| Build UI ChatBot: floating button toggle                        | 3h       | ✅ Done |
| Build chat window layout (header, messages area, input)         | 4h       | ✅ Done |
| Build message bubbles (user vs assistant styling)               | 2h       | ✅ Done |
| Implement minimize/expand chat window                          | 2h       | ✅ Done |
| Styling: dark theme, border radius, shadow, transitions         | 2h       | ✅ Done |

**Subtotal: ~13h**

**Velocity Sprint 2: 28 Story Points**

---

### 🏃 Sprint 3 — Security, Performance & AI Integration

> **Thời gian:** 29/04/2026 – 12/05/2026 (2 tuần)
>
> **Mục tiêu:** Xác thực JWT + OTP, Redis cache, rate limiting, ChatBot tích hợp data thực.

#### 🟢 Hưng — Auth System & Security

| Task                                                                | Estimate | Status  |
| ------------------------------------------------------------------- | -------- | ------- |
| Tạo API `POST /api/auth/register` + hash password (bcrypt)          | 3h       | ✅ Done |
| Tạo API `POST /api/auth/login` + phát hành JWT (7 ngày)             | 3h       | ✅ Done |
| Tạo hệ thống OTP: generate, hash (bcrypt), verify, resend          | 4h       | ✅ Done |
| OTP rate limit: cooldown 60s + max 5/giờ/email                      | 2h       | ✅ Done |
| Tích hợp Nodemailer: template HTML email OTP (đăng ký + reset)      | 3h       | ✅ Done |
| Tạo API Forgot Password + Reset Password qua OTP                    | 4h       | ✅ Done |
| Tạo API Update Profile + Change Password + input validation         | 3h       | ✅ Done |
| Viết middleware `verifyUser` + `verifyAdmin`                         | 2h       | ✅ Done |
| Tạo API `GET /api/orders/my-orders`                                 | 2h       | ✅ Done |
| Tích hợp Redis: cache `products:all` và `products:{id}`, TTL 1 giờ  | 5h       | ✅ Done |
| CRUD cache invalidation khi admin thêm/sửa/xóa sản phẩm            | 3h       | ✅ Done |
| Redis fallback: app hoạt động bình thường khi Redis down            | 2h       | ✅ Done |
| Áp dụng `strictLimiter` (5 req/15p) cho `/login` và `/checkout`     | 2h       | ✅ Done |
| Áp dụng `generalLimiter` (100 req/15p/IP) cho toàn bộ API           | 1h       | ✅ Done |
| Setup userSlice (Redux) + AccountContext                             | 2h       | ✅ Done |

**Subtotal: ~41h**

#### 🔵 Phát — Auth UI & Account Pages

| Task                                                           | Estimate | Status  |
| -------------------------------------------------------------- | -------- | ------- |
| Build UI đăng ký trong trang `/account`                        | 3h       | ✅ Done |
| Build UI đăng nhập trong trang `/account`                      | 3h       | ✅ Done |
| Build UI xác thực OTP (nhập mã 6 số, countdown, resend)       | 3h       | ✅ Done |
| Build UI quên mật khẩu + đặt lại mật khẩu                     | 3h       | ✅ Done |
| Build UI Profile: cập nhật thông tin cá nhân                   | 2h       | ✅ Done |
| Build UI đổi mật khẩu                                         | 2h       | ✅ Done |
| Hiển thị lịch sử đơn hàng (tab trong trang User)               | 3h       | ✅ Done |
| Build component AccountDropdown (header user menu)              | 3h       | ✅ Done |
| Build component ProtectedRoute                                 | 1h       | ✅ Done |
| Xử lý lỗi 429 (rate limit): hiển thị toast thông báo           | 2h       | ✅ Done |

**Subtotal: ~25h**

#### 🟣 Toản — ChatBot Logic & Data Integration

| Task                                                                     | Estimate | Status  |
| ------------------------------------------------------------------------ | -------- | ------- |
| Implement rule-based responses cho 10+ intent                            | 5h       | ✅ Done |
| Intent: vinyl, cd, merch, giao hàng, đổi trả, thanh toán                | 3h       | ✅ Done |
| Intent: đơn hàng, giá, liên hệ, chào hỏi, cảm ơn                       | 2h       | ✅ Done |
| Tích hợp fetch sản phẩm thực từ API `/api/products`                     | 2h       | ✅ Done |
| Dynamic response: hiển thị tên, giá, số lượng sản phẩm thực             | 2h       | ✅ Done |
| Build Quick Replies (6 gợi ý nhanh: Vinyl, CD, Merch, Ship, Đổi trả...) | 2h       | ✅ Done |
| Unread count badge khi có tin nhắn mới                                   | 1h       | ✅ Done |

**Subtotal: ~17h**

**Velocity Sprint 3: 32 Story Points**

---

### 🏃 Sprint 4 — Admin Dashboard, DevOps & Polish

> **Thời gian:** 13/05/2026 – 26/05/2026 (2 tuần)
>
> **Mục tiêu:** Dashboard admin hoàn chỉnh, Docker + CI/CD, AI nâng cao, polish UI.

#### 🟢 Hưng — Admin Dashboard + DevOps

| Task                                                                                  | Estimate | Status  |
| ------------------------------------------------------------------------------------- | -------- | ------- |
| Build Backend Statistics API: revenue, orders, products, users, inventory             | 6h       | ✅ Done |
| Build Frontend AdminLayout + sidebar navigation                                       | 3h       | ✅ Done |
| Build trang Admin Dashboard (overview với các số liệu)                                | 3h       | ✅ Done |
| Build trang Admin Orders (quản lý đơn hàng, cập nhật trạng thái)                     | 3h       | ✅ Done |
| Build trang Admin Users (danh sách người dùng)                                        | 2h       | ✅ Done |
| Build 5 trang thống kê: Revenue, Order, Product, User, Inventory Stats               | 8h       | ✅ Done |
| Build StatsUtils components (charts, cards, tables)                                   | 3h       | ✅ Done |
| Viết `Dockerfile` cho frontend (multi-stage: build + nginx)                           | 2h       | ✅ Done |
| Viết `Dockerfile` cho backend (node:20-alpine + prisma generate)                      | 2h       | ✅ Done |
| Viết `docker-compose.yml` (5 services: gateway, frontend, backend, postgres, redis)   | 3h       | ✅ Done |
| Cấu hình Nginx `nginx.conf`: route `/` → frontend, `/api/` → backend                  | 2h       | ✅ Done |
| Viết `.gitlab-ci.yml`: stages build → test → deploy                                   | 3h       | ✅ Done |
| Viết `Jenkinsfile`: pipeline 4 stages với retry(3)                                    | 3h       | ✅ Done |
| Viết utility `withRetry` (Exponential Backoff) + unit tests                           | 4h       | ✅ Done |
| Bọc Checkout transaction trong `withRetry` (3 lần, 500ms base)                        | 1h       | ✅ Done |
| Fix Redis `retryStrategy`: retry vô thời hạn + reconnectOnError                      | 2h       | ✅ Done |
| Thêm Axios retry interceptor frontend (retry 3 lần cho 5xx/network error)            | 3h       | ✅ Done |
| Thêm `healthcheck` cho 5 Docker services + `depends_on condition`                    | 3h       | ✅ Done |
| Thêm `restart: on-failure` cho tất cả services                                       | 0.5h     | ✅ Done |

**Subtotal: ~56.5h**

#### 🔵 Phát — Dark Mode & Static Pages

| Task                                                   | Estimate | Status  |
| ------------------------------------------------------ | -------- | ------- |
| Implement Dark Mode (ThemeContext + CSS variables)      | 4h       | ✅ Done |
| Build trang Contact                                    | 2h       | ✅ Done |
| Build trang FAQ                                        | 2h       | ✅ Done |
| Build trang Shipping & Returns                         | 2h       | ✅ Done |
| Build component PageHeader tái sử dụng                 | 1h       | ✅ Done |
| Polish UI: micro-animations, hover effects             | 3h       | ✅ Done |
| Responsive testing & fix layout cho tablet/mobile      | 2h       | ✅ Done |
| Cross-browser testing (Chrome, Firefox, Safari)        | 2h       | ✅ Done |

**Subtotal: ~18h**

#### 🟣 Toản — AI Enhancement & Polish

| Task                                                                      | Estimate | Status  |
| ------------------------------------------------------------------------- | -------- | ------- |
| Tích hợp Anthropic Claude API với system prompt tùy chỉnh                 | 4h       | ✅ Done |
| Thiết kế system prompt: vai trò, chính sách, dữ liệu sản phẩm           | 2h       | ✅ Done |
| Implement fallback: API fail → tự động chuyển sang rule-based             | 2h       | ✅ Done |
| UI: typing indicator (bounce animation) khi chờ phản hồi                 | 2h       | ✅ Done |
| Markdown rendering trong tin nhắn (bold, line break)                     | 1h       | ✅ Done |
| Hover effects, smooth transitions cho các button                          | 1h       | ✅ Done |
| Testing ChatBot với nhiều kịch bản hội thoại                             | 3h       | ✅ Done |
| Fix edge cases: empty input, loading state, error handling               | 2h       | ✅ Done |
| Viết tài liệu hướng dẫn sử dụng ChatBot                                | 1h       | ✅ Done |

**Subtotal: ~18h**

**Velocity Sprint 4: 39 Story Points**

---

### 🛡️ Buffer Week — QA & Presentation Prep

> **Thời gian:** 27/05/2026 – 01/06/2026 (1 tuần)
>
> **Mục tiêu:** Kiểm tra tổng thể, fix bug, chuẩn bị báo cáo và demo.

| Task                                                    | Assignee     | Estimate | Status  |
| ------------------------------------------------------- | ------------ | -------- | ------- |
| Full integration testing trên Docker environment        | Hưng         | 3h       | ✅ Done |
| Fix remaining bugs & edge cases                        | Hưng + Phát  | 4h       | ✅ Done |
| Viết/cập nhật README.md documentation                   | Hưng         | 2h       | ✅ Done |
| Viết tài liệu SCRUM (báo cáo Agile)                    | Hưng         | 3h       | ✅ Done |
| Chuẩn bị slide thuyết trình / demo                     | Toản + Phát  | 4h       | ✅ Done |
| Rehearsal demo trước nhóm                              | Cả nhóm      | 2h       | ✅ Done |

---

## 5. Tổng hợp khối lượng công việc

### Theo Sprint

| Thành viên | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4   | Buffer | **Tổng giờ** |
| ---------- | -------- | -------- | -------- | ---------- | ------ | ------------- |
| **Hưng**   | ~17h     | ~23h     | ~41h     | ~56.5h     | ~12h   | **~149.5h**   |
| **Phát**   | ~27h     | ~21.5h   | ~25h     | ~18h       | ~6h    | **~97.5h**    |
| **Toản**   | ~16h     | ~13h     | ~17h     | ~18h       | ~4h    | **~68h**      |
| **Tổng**   | ~60h     | ~57.5h   | ~83h     | ~92.5h     | ~22h   | **~315h**     |

### Theo vai trò

| Phạm vi                     | Thành viên | Số file chính | Story Points |
| --------------------------- | ---------- | ------------- | ------------ |
| Backend (API + DB + Infra)  | Hưng       | 25+ files     | 52 SP        |
| Frontend Admin              | Hưng       | 12+ files     | 13 SP        |
| DevOps (Docker + CI/CD)     | Hưng       | 6 files       | 21 SP        |
| Frontend Customer           | Phát       | 20+ files     | 22 SP        |
| AI ChatBot                  | Toản       | 1 file (664L) | 20 SP        |

### Phần trăm đóng góp

```
Hưng  ████████████████████████████████████████████████  47.5%  (~149.5h)
Phát  ███████████████████████████████                   31.0%  (~97.5h)
Toản  █████████████████████                             21.5%  (~68h)
```

---

## 6. Ma trận phân công theo Module

| Module / Thư mục                               | Hưng | Phát | Toản |
| ---------------------------------------------- | :--: | :--: | :--: |
| `backend/src/modules/products/`                | ✅   |      |      |
| `backend/src/modules/orders/`                  | ✅   |      |      |
| `backend/src/modules/auth/`                    | ✅   |      |      |
| `backend/src/modules/admin/`                   | ✅   |      |      |
| `backend/src/modules/statistics/`              | ✅   |      |      |
| `backend/src/config/` (Redis, Mail, Prisma)    | ✅   |      |      |
| `backend/src/middlewares/` (auth, rate, upload) | ✅   |      |      |
| `backend/src/utils/retry.ts`                   | ✅   |      |      |
| `backend/prisma/schema.prisma`                 | ✅   |      |      |
| `backend/src/seed.ts`                          | ✅   |      |      |
| `frontend/src/pages/Home.tsx`                  |      | ✅   |      |
| `frontend/src/pages/Vinyl.tsx`                 |      | ✅   |      |
| `frontend/src/pages/CD.tsx`                    |      | ✅   |      |
| `frontend/src/pages/Merch.tsx`                 |      | ✅   |      |
| `frontend/src/pages/ProductDetail.tsx`         |      | ✅   |      |
| `frontend/src/pages/Cart.tsx`                  |      | ✅   |      |
| `frontend/src/pages/Checkout.tsx`              |      | ✅   |      |
| `frontend/src/pages/OrderSuccess.tsx`          |      | ✅   |      |
| `frontend/src/pages/User.tsx`                  |      | ✅   |      |
| `frontend/src/pages/Contact.tsx`               |      | ✅   |      |
| `frontend/src/pages/FAQ.tsx`                   |      | ✅   |      |
| `frontend/src/pages/ShippingReturns.tsx`       |      | ✅   |      |
| `frontend/src/components/Navbar.tsx`           |      | ✅   |      |
| `frontend/src/components/Footer.tsx`           |      | ✅   |      |
| `frontend/src/components/HeroBanner.tsx`       |      | ✅   |      |
| `frontend/src/components/ProductCard.tsx`      |      | ✅   |      |
| `frontend/src/components/ProductFilterBar.tsx` |      | ✅   |      |
| `frontend/src/components/AccountDropdown.tsx`  |      | ✅   |      |
| `frontend/src/components/ProtectedRoute.tsx`   |      | ✅   |      |
| `frontend/src/components/ScrollToTop.tsx`      |      | ✅   |      |
| `frontend/src/components/ChatBot.tsx`          |      |      | ✅   |
| `frontend/src/pages/admin/AdminDashboard.tsx`  | ✅   |      |      |
| `frontend/src/pages/admin/AdminOrders.tsx`     | ✅   |      |      |
| `frontend/src/pages/admin/AdminProducts.tsx`   | ✅   |      |      |
| `frontend/src/pages/admin/AdminUsers.tsx`      | ✅   |      |      |
| `frontend/src/pages/admin/statistics/*`        | ✅   |      |      |
| `frontend/src/components/admin/StatsUtils.tsx` | ✅   |      |      |
| `frontend/src/store/` (Redux slices)           | ✅   |      |      |
| `frontend/src/services/api.ts`                 | ✅   |      |      |
| `frontend/src/context/AccountContext.tsx`       | ✅   |      |      |
| `frontend/src/context/ThemeContext.tsx`         |      | ✅   |      |
| `frontend/src/index.css` (Design System)       |      | ✅   |      |
| `frontend/src/App.tsx` (Routing)               | ✅   | ✅   |      |
| `docker-compose.yml`                           | ✅   |      |      |
| `api-gateway/nginx.conf`                       | ✅   |      |      |
| `.gitlab-ci.yml`                               | ✅   |      |      |
| `Jenkinsfile`                                  | ✅   |      |      |

---

## 7. Sprint Review (Demo & Kết quả)

### Sprint 1 Review — 14/04/2026

**Demo cho:** Giảng viên hướng dẫn (Product Owner)

| Tính năng demo                                    | Người demo | Kết quả      |
| ------------------------------------------------- | ---------- | ------------ |
| Backend API trả danh sách sản phẩm từ PostgreSQL  | Hưng       | ✅ Hoạt động |
| Trang Home với HeroBanner + Featured Products     | Phát       | ✅ Hoạt động |
| Filter sản phẩm theo Vinyl / CD / Merch           | Phát       | ✅ Hoạt động |
| Design System hoàn chỉnh (dark/light tokens)      | Phát       | ✅ Hoạt động |
| Tài liệu thiết kế ChatBot (flow diagram)          | Toản       | ✅ Hoàn thành|

**Feedback:** Cần hoàn thiện luồng mua sắm end-to-end → chuyển sang Sprint 2.

---

### Sprint 2 Review — 28/04/2026

**Demo cho:** Giảng viên hướng dẫn (Product Owner)

| Tính năng demo                                    | Người demo | Kết quả      |
| ------------------------------------------------- | ---------- | ------------ |
| Xem chi tiết sản phẩm + thêm vào giỏ hàng        | Phát       | ✅ Hoạt động |
| Cart: thay đổi số lượng, xóa, tổng tiền realtime  | Phát       | ✅ Hoạt động |
| Checkout: trừ tồn kho, tạo đơn hàng (transaction) | Hưng       | ✅ Hoạt động |
| Checkout hết hàng: rollback, không tạo đơn         | Hưng       | ✅ Hoạt động |
| Admin: Thêm/Sửa/Xóa sản phẩm, upload ảnh          | Hưng       | ✅ Hoạt động |
| ChatBot UI: floating button, chat window            | Toản       | ✅ Hoạt động |

**Feedback:** Cần bổ sung xác thực người dùng và bảo mật API → Sprint 3.

---

### Sprint 3 Review — 12/05/2026

**Demo cho:** Giảng viên hướng dẫn (Product Owner)

| Tính năng demo                                               | Người demo  | Kết quả      |
| ------------------------------------------------------------ | ----------- | ------------ |
| Đăng ký + Xác thực OTP qua email                            | Hưng + Phát | ✅ Hoạt động |
| Đăng nhập trả JWT token                                     | Hưng        | ✅ Hoạt động |
| Quên mật khẩu + Đặt lại qua OTP                             | Hưng        | ✅ Hoạt động |
| Truy cập Admin Dashboard: chỉ ADMIN được vào                 | Hưng        | ✅ Hoạt động |
| Xem lịch sử đơn hàng (user đã đăng nhập)                     | Phát        | ✅ Hoạt động |
| Redis cache: lần đầu MISS (query DB), lần sau HIT (cache)   | Hưng        | ✅ Hoạt động |
| Rate limit: login > 5 lần → trả 429 + toast                  | Hưng        | ✅ Hoạt động |
| ChatBot tư vấn sản phẩm với dữ liệu thực từ API             | Toản        | ✅ Hoạt động |
| ChatBot quick replies                                        | Toản        | ✅ Hoạt động |

**Feedback:** Cần containerize, dashboard thống kê, nâng cấp AI → Sprint 4.

---

### Sprint 4 Review — 26/05/2026

**Demo cho:** Giảng viên hướng dẫn (Product Owner)

| Tính năng demo                                                          | Người demo | Kết quả                       |
| ----------------------------------------------------------------------- | ---------- | ----------------------------- |
| `docker-compose up`: 5 services khởi động đúng thứ tự                   | Hưng       | ✅ Hoạt động                  |
| Truy cập `http://localhost:8080` qua API Gateway                        | Hưng       | ✅ Hoạt động                  |
| Admin Dashboard: thống kê doanh thu, đơn hàng, sản phẩm, người dùng    | Hưng       | ✅ Hoạt động                  |
| Admin: quản lý đơn hàng, quản lý người dùng                            | Hưng       | ✅ Hoạt động                  |
| withRetry: simulate lỗi → thành công lần 3                             | Hưng       | ✅ Hoạt động (5/5 tests pass) |
| CI/CD pipeline chạy thành công                                         | Hưng       | ✅ Hoạt động                  |
| Dark Mode toggle                                                       | Phát       | ✅ Hoạt động                  |
| Trang Contact, FAQ, Shipping & Returns                                  | Phát       | ✅ Hoạt động                  |
| ChatBot tích hợp Claude AI + fallback rule-based                        | Toản       | ✅ Hoạt động                  |
| ChatBot typing indicator + animations mượt mà                          | Toản       | ✅ Hoạt động                  |

---

## 8. Sprint Retrospective

### Sprint 1 Retrospective

| Hạng mục             | Nội dung                                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| ✅ **Làm tốt**       | Prisma schema thiết kế hợp lý ngay từ đầu. Design System hoàn chỉnh giúp các sprint sau phát triển nhanh.     |
| ⚠️ **Cần cải thiện** | Toản mới chỉ ở giai đoạn research, chưa có output code thực tế.                                                |
| 💡 **Hành động**     | Sprint 2: Toản bắt đầu code UI ChatBot. Phát và Hưng phối hợp API-UI integration.                             |

### Sprint 2 Retrospective

| Hạng mục             | Nội dung                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| ✅ **Làm tốt**       | Luồng mua sắm end-to-end hoàn chỉnh. Prisma Transaction đảm bảo data integrity. ChatBot UI hoàn thành cơ bản. |
| ⚠️ **Cần cải thiện** | Chưa có authentication → API admin bị public. Cần xử lý sớm.                                                    |
| 💡 **Hành động**     | Sprint 3: Ưu tiên JWT auth + OTP email. Toản tích hợp data thực cho ChatBot.                                   |

### Sprint 3 Retrospective

| Hạng mục             | Nội dung                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| ✅ **Làm tốt**       | Auth system hoàn chỉnh (JWT + OTP + email). Redis cache hoạt động tốt. ChatBot tích hợp data thực thành công.  |
| ⚠️ **Cần cải thiện** | Redis `retryStrategy` ban đầu cấu hình sai → mất kết nối vĩnh viễn khi Redis restart.                          |
| 💡 **Hành động**     | Sprint 4: Fix Redis retry, containerize toàn bộ, nâng cấp ChatBot với AI.                                      |

### Sprint 4 Retrospective

| Hạng mục             | Nội dung                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Làm tốt**       | Docker healthcheck giải quyết startup race condition. Admin dashboard thống kê toàn diện. ChatBot AI + fallback hoạt động tốt. |
| ⚠️ **Cần cải thiện** | Khối lượng Sprint 4 nhiều ở Hưng (DevOps + Admin). Cần cân bằng tốt hơn cho dự án tiếp theo.                                  |
| 💡 **Hành động**     | Buffer week: Focus testing, fix bug, chuẩn bị thuyết trình.                                                                   |

---

## 9. Burndown Chart (Story Points)

```
Sprint 1 — 13 points (01/04 – 14/04)
Ngày 1-2   █████████████                    13 pts remaining
Ngày 3-4   ██████████                       10 pts remaining
Ngày 5-6   ███████                           7 pts remaining
Ngày 7-8   ████                              4 pts remaining
Ngày 9-10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0 pts remaining ✅

Sprint 2 — 28 points (15/04 – 28/04)
Ngày 1-2   ████████████████████████████      28 pts remaining
Ngày 3-4   ██████████████████████            22 pts remaining
Ngày 5-6   ███████████████                   15 pts remaining
Ngày 7-8   ████████                           8 pts remaining
Ngày 9-10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0 pts remaining ✅

Sprint 3 — 32 points (29/04 – 12/05)
Ngày 1-2   ████████████████████████████████  32 pts remaining
Ngày 3-4   █████████████████████████         25 pts remaining
Ngày 5-6   █████████████████                 17 pts remaining
Ngày 7-8   █████████                          9 pts remaining
Ngày 9-10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0 pts remaining ✅

Sprint 4 — 39 points (13/05 – 26/05)
Ngày 1-2   ███████████████████████████████████████  39 pts remaining
Ngày 3-4   ██████████████████████████████           30 pts remaining
Ngày 5-6   ████████████████████                     20 pts remaining
Ngày 7-8   ██████████                               10 pts remaining
Ngày 9-10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0 pts remaining ✅
```

**Tổng Velocity:** 13 + 28 + 32 + 39 = **112 Story Points** hoàn thành trong 4 sprints.

**Velocity trung bình:** 112 / 4 = **28 SP / sprint**

---

## 10. Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌──────────────────────┐  ┌─────────────────────────┐       │
│  │  Frontend (React)    │  │  AI ChatBot (Toản)      │       │
│  │  - Vite + TW v4      │  │  - Rule-based engine    │       │
│  │  - Redux Toolkit     │  │  - Claude API           │       │
│  │  - Phát (Customer)   │  │  - Fallback logic       │       │
│  │  - Hưng (Admin)      │  │  - Real product data    │       │
│  └──────────┬───────────┘  └────────────┬────────────┘       │
│             │         HTTP              │                    │
└─────────────┼───────────────────────────┼────────────────────┘
              │                           │
              ▼                           │
┌─────────────────────────┐               │
│  API Gateway (Nginx)    │               │
│  / → Frontend           │               │
│  /api → Backend         │               │
└──────────┬──────────────┘               │
           │                              │
           ▼                              │
┌─────────────────────────────────────────┼────────────────────┐
│  Backend (Express + TypeScript) ← ──────┘                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Products │ │  Orders  │ │   Auth   │ │  Statistics  │    │
│  │  Module  │ │  Module  │ │  Module  │ │    Module    │    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘    │
│       │             │            │               │            │
│  ┌────┴─────────────┴────────────┴───────────────┴───────┐   │
│  │  Middlewares: JWT Auth, Rate Limiter, File Upload     │   │
│  └───────────────────────────────────────────────────────┘   │
│       │                                    │                 │
│       ▼                                    ▼                 │
│  ┌──────────────┐                   ┌──────────────┐         │
│  │ PostgreSQL   │                   │    Redis     │         │
│  │  (Prisma)    │                   │   (Cache)    │         │
│  └──────────────┘                   └──────────────┘         │
└──────────────────────────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │ Gmail SMTP  │
                    │ (OTP Email) │
                    └─────────────┘
```

---

## 11. Tech Stack

| Layer        | Công nghệ                                                   | Người phụ trách |
| ------------ | ------------------------------------------------------------ | --------------- |
| Frontend     | React 18, Vite, Tailwind CSS v4, Redux Toolkit               | Phát + Hưng     |
| Backend      | Node.js, Express, TypeScript                                 | Hưng            |
| Database     | PostgreSQL 15, Prisma ORM                                    | Hưng            |
| Cache        | Redis (TTL 1 giờ, auto-fallback)                             | Hưng            |
| Auth         | JWT (7 ngày), bcrypt, OTP (6 số, 5 phút)                    | Hưng            |
| Email        | Nodemailer + Gmail SMTP (HTML template)                      | Hưng            |
| AI           | Anthropic Claude API + Rule-based fallback                   | Toản            |
| DevOps       | Docker, Docker Compose, Nginx, GitLab CI, Jenkins            | Hưng            |
| State Mgmt   | Redux Toolkit (cartSlice, productSlice, userSlice)           | Hưng            |

---

## 12. Definition of Done (Chung)

Một User Story được coi là **Done** khi thỏa mãn toàn bộ các tiêu chí sau:

- [x] Code đã được review (hoặc self-review nếu module độc lập)
- [x] Không có lỗi TypeScript compile (frontend `tsc --noEmit` exit code 0)
- [x] Tính năng hoạt động đúng trên môi trường local (`npm run dev`)
- [x] Tính năng hoạt động đúng trên môi trường Docker (`docker-compose up`)
- [x] Không có lỗi console nghiêm trọng (error) khi sử dụng
- [x] README.md đã được cập nhật nếu cách chạy thay đổi

---

## 13. Technical Debt & Future Backlog

| ID    | Mô tả                                                                       | Priority      |
| ----- | --------------------------------------------------------------------------- | ------------- |
| TD-01 | Viết Integration Tests cho API endpoint chính (checkout, auth)              | 🟡 Trung bình |
| TD-02 | Thêm Redis persistence (`appendonly yes`) để cache không mất khi restart    | 🟡 Trung bình |
| TD-03 | Email notification khi đặt hàng thành công (nodemailer)                     | 🟢 Thấp       |
| TD-04 | Tìm kiếm sản phẩm full-text (hiện tại search chỉ filter client-side)       | 🟡 Trung bình |
| TD-05 | Pagination cho trang sản phẩm (hiện tại load all)                           | 🟡 Trung bình |
| TD-06 | HTTPS / SSL certificate cho production deployment                           | 🔴 Cao        |
| TD-07 | Monitoring & Alerting (Prometheus + Grafana)                                | 🟢 Thấp       |
| TD-08 | Payment gateway integration (VNPay, Momo)                                   | 🟡 Trung bình |

---

_Tài liệu này được tạo theo Scrum Guide 2020 — scrumguides.org_

_Ngày cập nhật: 30/05/2026_
