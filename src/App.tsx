import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './features/home/HomePage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { AdminLogin } from './features/auth/AdminLogin';

// Code-split the admin dashboard for optimal mobile performance (Instruction 7)
const AdminDashboard = lazy(() =>
  import('./features/admin/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  }))
);

export const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<HomePage />} />

        {/* Hidden Admin Authentication Entrance */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all redirect to storefront */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

