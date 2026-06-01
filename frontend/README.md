# Record Store Frontend

A modern e-commerce platform for vinyl records, CDs, and merchandise built with React, TypeScript, and modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Build](#build)
- [Current Implementation Status](#current-implementation-status)

## 🎯 Overview

Record Store is a complete frontend e-commerce application for an online music and merchandise store. It specializes in vinyl records, CDs, and exclusive merchandise with full shopping cart, user authentication UI, and order management features.

**Current Status:** Frontend is feature-complete with mock data. Backend integration is required for production.

## 🛠 Tech Stack

- **Framework:** React 19.x with TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **UI Components:** Lucide React (icons)
- **Notifications:** React Hot Toast
- **Build Tool:** Vite
- **HTTP Client:** Axios (prepared for backend)
- **Package Manager:** npm

## ✨ Features

### 🛍️ Product & Catalog
- ✅ Shop by category: Vinyl, CDs, Merchandise
- ✅ Advanced filtering by artist/brand
- ✅ Multi-option sorting (Featured, Price, Alphabetical)
- ✅ Real-time search with suggestions
- ✅ Detailed product pages
- ✅ Stock tracking with "Sold Out" indicator
- ✅ Related products recommendations
- ✅ Quick add to cart from product grid

### 🛒 Shopping Cart
- ✅ Add/remove products
- ✅ Update quantities with stock limits
- ✅ Real-time cart totals
- ✅ Cart item counter in header
- ✅ Persistent stock tracking across navigation

### 💳 Checkout & Orders
- ✅ Form validation (email, phone, address)
- ✅ Vietnamese phone number regex validation
- ✅ Order confirmation with order code
- ✅ Order history display
- ✅ Delivery timeline information

### 👤 User Account
- ✅ Login/Register UI
- ✅ User profile management
- ✅ Address update
- ✅ Order history view
- ✅ Account dashboard

### 📄 Support Pages
- ✅ Contact page with interactive OpenStreetMap (TP.HCM)
- ✅ Shipping & Returns policy
- ✅ FAQ section with common questions
- ✅ Business hours and contact details

### 🎨 UI/UX
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Toast notifications for all actions
- ✅ Loading states
- ✅ Sticky elements (cart sidebar, navbar)
- ✅ Accessible navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── FeaturedProducts.tsx      # Product grid with quick add
│   ├── Footer.tsx                # Footer with navigation links
│   ├── Navbar.tsx                # Navigation with search
│   ├── ProductFilterBar.tsx      # Unified filter/sort component
│   └── ScrollToTop.tsx           # Auto-scroll on route change
│
├── pages/
│   ├── Home.tsx                  # Homepage with hero & featured
│   ├── Vinyl.tsx                 # Vinyl category with filter/sort
│   ├── CD.tsx                    # CD category with filter/sort
│   ├── Merch.tsx                 # Merchandise category with filter/sort
│   ├── ProductDetail.tsx         # Single product page (stock-aware)
│   ├── Cart.tsx                  # Shopping cart & order summary
│   ├── Checkout.tsx              # Checkout form with validation
│   ├── OrderSuccess.tsx          # Order confirmation page
│   ├── User.tsx                  # Login/Register/Account dashboard
│   ├── Contact.tsx               # Contact info & interactive map
│   ├── ShippingReturns.tsx       # Shipping & returns policy
│   ├── FAQ.tsx                   # FAQ section
│   └── Login.tsx                 # Reserved for future use
│
├── store/ (Redux State)
│   ├── cartSlice.ts              # Shopping cart state
│   ├── productSlice.ts           # Product stock tracking
│   ├── userSlice.ts              # User auth & profile
│   └── index.ts                  # Store configuration
│
├── data/
│   └── products.ts               # Mock product database (16 products)
│
├── services/
│   ├── api.ts                    # Axios instance setup
│   └── productService.ts         # Product API calls (stub)
│
├── layouts/
│   └── MainLayout.tsx            # Main page layout wrapper
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── App.tsx                       # Main app with routing
└── main.tsx                      # Entry point
```

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Steps

1. **Navigate to frontend directory:**
   ```bash
   cd d:\Ki2_Nam4\software_architecture\BTL_archi\frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:5173`
   - Hot reload enabled

## 📖 Usage

### Development
```bash
npm run dev
```

### Code Quality
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
- Output in `dist/` folder
- Type-checked and optimized

### Preview Build
```bash
npm run preview
```

## 🔗 Routes

| Path | Component | Features |
|------|-----------|----------|
| `/` | Home | Hero section, featured products |
| `/vinyl` | Vinyl | Filter by artist, sort, search |
| `/cd` | CD | Filter by artist, sort, search |
| `/merch` | Merch | Filter by brand, sort, search |
| `/product/:id` | ProductDetail | Stock info, add to cart, related items |
| `/cart` | Cart | View items, update qty, checkout |
| `/checkout` | Checkout | Form validation, order summary |
| `/order-success` | OrderSuccess | Confirmation & order code |
| `/account` | User | Login/Register/Profile |
| `/contact` | Contact | Map + contact info |
| `/shipping-returns` | ShippingReturns | Policy information |
| `/faq` | FAQ | Common questions |

## 📊 Current Implementation Status

### ✅ Fully Implemented
- [x] All product pages with category-specific filtering
- [x] Filter & Sort unified component (consistent across categories)
- [x] Product detail page with stock management
- [x] Shopping cart with quantity control & stock limits
- [x] Checkout form with comprehensive validation
- [x] Order confirmation page
- [x] User login/register UI
- [x] Account profile and order history display
- [x] Support pages (Contact, FAQ, Shipping)
- [x] Responsive design (all screen sizes)
- [x] Search functionality
- [x] Redux state management
- [x] Toast notifications

### 🟡 Mock/Local Implementation (Requires Backend)
- **Data Source:** Mock product data in `src/data/products.ts`
- **Product Catalog:** Static array, no backend API calls
- **Search:** Mock data search only
- **Stock Management:** Redux-only (lost on refresh)
- **User Authentication:** UI-only, no real JWT/session
- **Checkout:** Simulated with setTimeout
- **Cart Persistence:** Redux only (lost on refresh)
- **Order Processing:** No database storage

### ❌ Not Yet Implemented
- Real backend API integration
- Persistent user authentication
- Payment processing
- Email notifications
- Image optimization
- Real inventory management
- Order tracking

## 🔌 Backend Integration Guide

To connect to a real backend:

### 1. Products API
Update `src/services/productService.ts` to call real endpoints

### 2. Authentication
Replace Redux mock login in `src/store/userSlice.ts` with real JWT flow

### 3. Checkout
Send form data to `/api/orders` endpoint instead of redirecting

### 4. Environment Variables
Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📦 Dependencies

**Core:**
- react@^19.2.4
- react-dom@^19.2.4
- react-router-dom@^7.14.0

**State Management:**
- @reduxjs/toolkit@^2.11.2
- react-redux@^9.2.0

**Styling:**
- tailwindcss@^4.2.2

**UI & Utilities:**
- lucide-react@^1.7.0 (icons)
- react-hot-toast@^2.6.0 (notifications)
- axios@^1.14.0 (HTTP)

## 🎨 Design System

### Colors
- Primary: Black (`#000`)
- Light Background: `#f5f5f5`
- Border: `#e5e5e5`
- Text: `#333333` / `#666666`

### Typography
- Display: Custom font for headings
- Body: System sans-serif

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🐛 Known Issues / Limitations

1. Mock data only - no real products from backend
2. Redux state - data lost on refresh
3. No real authentication - session in Redux only
4. Search limited to mock data
5. No backend order persistence

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Deploy:
- Use `dist/` folder as root
- Ensure router base path is correct (currently `/`)
- Set backend API URL in environment

## 📚 Development Tips

### Adding a new page:
1. Create in `src/pages/YourPage.tsx`
2. Add route to `App.tsx`
3. Add nav link in `Navbar.tsx` or `Footer.tsx`

### Adding Redux state:
1. Create slice in `src/store/yourSlice.ts`
2. Export actions and reducer
3. Add to `src/store/index.ts`
4. Use with `useDispatch` and `useSelector`

---

**Last Updated:** April 11, 2026  
**Status:** Frontend Complete | Ready for Backend Integration  
**University:** Bach Khoa University
