import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Production from './pages/Production';
import Workers from './pages/Workers';
import QualityControl from './pages/QualityControl';
import Machines from './pages/Machines';
import Reports from './pages/Reports';
import Shipping from './pages/Shipping';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

function LayoutWrapper() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout />;
}

function RequireRole({ allowedRoles, children }: { allowedRoles?: string[]; children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/orders" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  {
    element: <LayoutWrapper />,
    children: [
      { path: '/dashboard', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Dashboard /></RequireRole> },
      { path: '/orders', element: <Orders /> },
      { path: '/inventory', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Inventory /></RequireRole> },
      { path: '/production', element: <Production /> },
      { path: '/workers', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Workers /></RequireRole> },
      { path: '/quality-control', element: <RequireRole allowedRoles={['Admin', 'Production Manager', 'QC Inspector']}><QualityControl /></RequireRole> },
      { path: '/machines', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Machines /></RequireRole> },
      { path: '/reports', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Reports /></RequireRole> },
      { path: '/shipping', element: <RequireRole allowedRoles={['Admin', 'Production Manager']}><Shipping /></RequireRole> },
      { path: '/users', element: <RequireRole allowedRoles={['Admin']}><Users /></RequireRole> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);