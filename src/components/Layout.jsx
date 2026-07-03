import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthStore, useAppStore } from '../store/useStore';

export default function Layout({ adminOnly = false }) {
  const { user } = useAuthStore();
  const { fetchInitialData } = useAppStore();

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user, fetchInitialData]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'super_admin') {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-dark-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-dark-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
