# 📀 RECORD STORE - E-COMMERCE UI
Một ứng dụng web mua sắm đĩa nhạc (Vinyl, CD) và Merchandise với phong cách thiết kế tối giản (Minimalism), hiện đại và tập trung vào trải nghiệm người dùng cao cấp. 

## 🛠 Tech Stack (Công nghệ sử dụng)

* **Frontend**: React 18, TypeScript (Type-safe imports).
* **State Management**: Redux Toolkit (quản lý giỏ hàng chuyên nghiệp).
* **Styling**: Tailwind CSS (Utility-first CSS).
* **Icons & UI Components**: Lucide React, React Hot Toast (thông báo).
* **Routing**: React Router v6.
* **Persistence**: LocalStorage (duy trì giỏ hàng khi tải lại trang).

## ✨ Tính năng chính (Key Features)

* **🛒 Shopping Cart**: Thêm/Xóa/Cập nhật số lượng sản phẩm, lưu trữ dữ liệu bền vững qua LocalStorage.
* **🔍 Smart Search**: Thanh tìm kiếm mở rộng (Expanding Search Overlay) tích hợp gợi ý kết quả thời gian thực ngay trên Navbar.
* **🏷️ Product Filtering**: Hệ thống lọc theo Thể loại (Genre) và Sắp xếp (Sort) linh hoạt cho Vinyl, CD và Merch.
* **📱 Modern UI/UX**: 
    * Hiệu ứng "Quick Add" khi hover sản phẩm.
    * Trang chi tiết sản phẩm tích hợp mục "Sản phẩm liên quan".
    * Tự động cuộn lên đầu trang (ScrollToTop) khi chuyển hướng.
* **📋 Checkout Logic**: Form thanh toán có kiểm tra tính hợp lệ của dữ liệu (Email, Số điện thoại).

## 📁 Cấu trúc thư mục (Project Structure)

Dự án được tổ chức theo cấu trúc chuyên nghiệp, tách biệt rõ ràng giữa logic và giao diện:

```text
frontend/
├── src/
│   ├── components/     # Các thành phần UI dùng chung (Navbar, Footer, FilterBar...)
│   ├── store/          # Cấu hình Redux Toolkit (Slices, Store)
│   ├── services/       # Lớp API Service (Axios instances & Product services)
│   ├── pages/          # Các trang chính (Home, Vinyl, Cart, Checkout...)
│   ├── layouts/        # Bộ khung giao diện (MainLayout)
│   ├── types/          # Định nghĩa kiểu dữ liệu TypeScript
│   └── App.tsx         # Cấu hình Routing chính
```
