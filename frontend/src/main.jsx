import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { LocationProvider } from './context/LocationContext'
import { WishlistProvider } from './context/WishlistContext'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ShippingPage from './pages/ShippingPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import SupportNexaElitePage from './pages/SupportNexaElitePage.jsx'
import SupportGeneralIssuesPage from './pages/SupportGeneralIssuesPage.jsx'
import SupportEmergencyPage from './pages/SupportEmergencyPage.jsx'
import SupportFeedbackPage from './pages/SupportFeedbackPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import CouponsPage from './pages/CouponsPage.jsx'
import PrivacySecurityPage from './pages/PrivacySecurityPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import PlaceOrderPage from './pages/PlaceOrderPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import OrderDetailPage from './pages/OrderDetailPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import VendorRegisterPage from './pages/VendorRegisterPage.jsx'
import VendorDashboardPage from './pages/VendorDashboardPage.jsx'
import VendorLoginPage from './pages/VendorLoginPage.jsx'
import StoresPage from './pages/StoresPage.jsx'
import StorePage from './pages/StorePage.jsx'
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/support/nexa-elite" element={<SupportNexaElitePage />} />
      <Route path="/support/general-issues" element={<SupportGeneralIssuesPage />} />
      <Route path="/support/emergency" element={<SupportEmergencyPage />} />
      <Route path="/support/feedback" element={<SupportFeedbackPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/coupons" element={<CouponsPage />} />
      <Route path="/privacy" element={<PrivacySecurityPage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/placeorder" element={<PlaceOrderPage />} />
      <Route path="/order-success/:id" element={<OrderSuccessPage />} />
      <Route path="/order/:id" element={<OrderDetailPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
      <Route path="/stores" element={<StoresPage />} />
      <Route path="/store/:id" element={<StorePage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <LocationProvider>
              <RouterProvider router={router} />
            </LocationProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
