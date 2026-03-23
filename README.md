# 🛒 Shopnexa - Advanced MERN E-Commerce Platform

Shopnexa is a full-stack, feature-rich MERN e-commerce application designed with a robust, premium user experience. Built with MongoDB, Express, React, and Node.js, it provides a comprehensive end-to-end multi-role ecosystem—from localized product discovery and interactive real-time updates, to a fully separated Vendor Merchant Center and animated order tracking.

## 🚀 Key Features

### 👑 Multi-Role Authentication & Portals
* **Customer Portal**: Dedicated authentication flow, personalized home page, wishlist, and cart.
* **Merchant Center**: Completely separate Vendor Dashboard where approved store owners can manage their stores, upload products, and track orders.
* **Role-Based Navigation**: Sensible UI rendering based on user roles (`isVendor`, `isAdmin`) with distinct headers, footers, and profile dropdowns.

### 📍 Location-Based Store Discovery
* **Intelligent Relevance**: The "Popular Stores Near You" carousel dynamically prioritizes and sorts stores based on the user's detected or manually selected city/address.
* **Live Geocoding**: Connected to Nominatim OpenStreetMap API, allowing real-time address searching within a sleek, dark-mode compatible modal.

### 💎 Premium Glassmorphism UI
* **Nexa Design System**: High-end aesthetic with vibrant gradients, deep shadows, smooth micro-animations, and a completely responsive architecture natively supporting Light and Dark modes.
* **Support Subpages**: Dedicated, route-protected premium pages for Nexa Elite, General Issues, Safety Emergencies, and Feedback.
* **Clickable Profile Navigation**: An elevated z-index dropdown system that gracefully routes users between their orders, wallets, and merchant tools without layout overlap.

### ⚡ Real-Time WebSockets
* **Live Product Updates**: Powered by Socket.io, the home page instantly reflects when vendors add new products or change pricing—no manual refresh required.
* **Live Chatbot Assistance**: Interactive support widget for instant issue resolution without leaving the page context.

### 🛍️ Advanced Cart & Checkout
* **Discount Engine**: Working coupon system (`SAVE10`, `FRESH20`, `NEWUSER`, `GROCERY5`).
* **Interactive UI**: Sticky "View Cart" sliding bottom bar and dynamic quantity steppers for rapid checkout operations.
* **Nexa Virtual Wallet**: Functional wallet balance tracking that allows mock deposits and frictionless 1-click ledger deductions during checkout.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite) + React Router DOM
* Context API (Auth, Cart, Theme, Wishlist, Location)
* Axios (API requests)
* Lucide React (Icons)
* Pure CSS (Glassmorphism, animations, CSS variables, Light/Dark Modes)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for dual-role Authentication
* bcrypt.js for Password Hashing
* Socket.io (Configured for real-time hooks & broadcasts)

## 📂 Project Structure

```text
e_commerce/
├── backend/                  # Express/Node JS server
│   ├── config/               # DB connections
│   ├── controllers/          # Route handlers (auth, users, products, stores, orders)
│   ├── data/                 # Seed data
│   ├── middleware/           # Protect/Admin/Vendor middleware
│   ├── models/               # Mongoose schemas (User, Product, Store, Order)
│   ├── routes/               # Express API endpoints
│   ├── server.js             # Express & Socket.io entry point
├── frontend/                 # React UI app
│   ├── src/
│   │   ├── components/       # Reusable UI parts (Header, LocationModal, Loaders)
│   │   ├── context/          # React Contexts
│   │   ├── pages/            # Routable pages (HomePage, Merchant Dashboard, Support pages)
│   │   ├── App.jsx           # Main App wrapper & routing config
│   │   ├── index.css         # Global design system & utilities
│   │   └── main.jsx          # React DOM entry
│   └── .env                  # Frontend API configuration
└── README.md
```

## 💻 Getting Started

### Prerequisites
* Node.js (v16+ recommended)
* MongoDB database (local or Mongo Atlas)

### Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Configuration**
   * **Backend** (`backend/.env`):
     ```env
     NODE_ENV=development
     PORT=5000
     MONGO_URI=<your_mongodb_connection_string>
     JWT_SECRET=<your_secret_key>
     ```
   * **Frontend** (`frontend/.env`):
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Database Seeding (Optional)**
   Quickly seed products and users:
   ```bash
   cd backend
   npm run data:import
   ```

4. **Run the Application**
   ```bash
   # Terminal 1 - Start Server
   cd backend && npm run server

   # Terminal 2 - Start Client Dev Server
   cd frontend && npm run dev
   ```

---
*Architected and developed with ❤️ for Advanced Web Engineering.*
