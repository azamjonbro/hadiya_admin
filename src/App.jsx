import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Managers from './pages/Managers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import { useAuthStore } from './store/useStore';

export default function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        
        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<Categories />} />
        </Route>

        {/* Super Admin Only Routes */}
        <Route element={<Layout adminOnly={true} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? (user.role === 'super_admin' ? '/' : '/products') : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
