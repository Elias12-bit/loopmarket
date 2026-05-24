import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// 🔹 Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";

import ChatPage from "./pages/ChatPage";
import Wishlist from "./pages/Wishlist";
import MyAds from "./pages/MyAds";

import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* 🏠 MAIN */}
        <Route path="/" element={<Home />} />

        {/* 🔐 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👤 PROFILE (PROTECTED FIXED) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/edit-profile" element={<EditProfile />} />

        {/* 🛍️ PRODUCTS */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<CreateProduct />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />

        {/* 💬 CHAT */}
        <Route path="/chat" element={<ChatPage />} />

        {/* ❤️ WISHLIST */}
        <Route path="/wishlist" element={<Wishlist />} />
        
        <Route path="/my-ads" element={<MyAds />} />

        {/* 🛠️ ADMIN */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>        

      </Routes>
    </>
  );
}

export default App;