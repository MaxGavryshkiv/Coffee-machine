// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SalesPage from "./pages/SalesPage";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";

import MaterialsPage from "./pages/MaterialsPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuth } from "./context/AuthContext";
import SalesHistoryPage from "./pages/SalesHistory";
import UsersPage from "./pages/UsersPage";

export default function App() {
  const { user } = useAuth();
  const role = user?.role ?? "seller";
  const userId = user?.id ?? "";

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <MainLayout role={role}>
                <SalesPage userId={userId} />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sales-history"
          element={
            <PrivateRoute>
              <MainLayout role={role}>
                <SalesHistoryPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <MainLayout role={role}>
                <ProductsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/materials"
          element={
            <PrivateRoute>
              <MainLayout role={role}>
                <MaterialsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <MainLayout role={role}>
                <UsersPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
