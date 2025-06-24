import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ReportsMap } from '../pages/Map/ReportsMap'; // 👈 importamos el nuevo
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { AdminRoute } from './AdminRoute';
import { AdminPanel } from '../pages/AdminPanel';
import { ReportList } from '../pages/reports/ReportList';
import { ReportCreate } from '../pages/reports/ReportCreate';
import { ReportsDashboard } from '../pages/reports/ReportsDashboard';
export const AppRoutes = () => (
  <Routes>
    <Route
      path="/reports/list"
      element={
        <PrivateRoute>
          <ReportList />
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <ReportsDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    <Route path="/report/create" element={<ReportCreate />} />
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      }
    />
    <Route
      path="/map"
      element={
        <PrivateRoute>
          <ReportsMap /> {/* 👈 usamos el nuevo componente aquí */}
        </PrivateRoute>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      }
    />
  </Routes>
);
