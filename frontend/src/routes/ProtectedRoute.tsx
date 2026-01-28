import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spin tip="Loading..." size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}