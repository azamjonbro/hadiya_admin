import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, role: 'super_admin' | 'manager' }
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

const initialProducts = [
  {
    id: 1,
    name: 'Rolex Submariner',
    status: true,
    history: { views: 1500 },
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&auto=format&fit=crop'],
    likes: '1250',
    quantity: '25',
    price: '15000',
    saleprice: '14500',
    salePercent: 5,
    category: 'Premium',
    categoryId: 1
  }
];

const initialOrders = [
  { id: 101, customerName: 'Ali Valiyev', address: 'Toshkent, Yunusobod', phone: '+998901234567', total: 1200, status: 'Kutilmoqda', date: '2026-07-01' },
];

const initialManagers = [
  { id: 1, name: 'Sardor Manager', username: 'sardor', password: '123' },
];

const initialCategories = [
  { id: 1, name: 'Premium' }
];

export const useAppStore = create(
  persist(
    (set) => ({
      superAdminPassword: '123',
      products: initialProducts,
      orders: initialOrders,
      managers: initialManagers,
      categories: initialCategories,
      
      updateSuperAdminPassword: (newPassword) => set({ superAdminPassword: newPassword }),
      
      addProduct: (product) => set((state) => ({ products: [...state.products, { id: Date.now(), ...product }] })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
      
      addOrder: (order) => set((state) => ({ orders: [...state.orders, { id: Date.now(), ...order }] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
      
      addManager: (manager) => set((state) => ({ managers: [...state.managers, { id: Date.now(), ...manager }] })),
      deleteManager: (id) => set((state) => ({ managers: state.managers.filter(m => m.id !== id) })),
      updateManager: (id, updatedData) => set((state) => ({
        managers: state.managers.map(m => m.id === id ? { ...m, ...updatedData } : m)
      })),

      addCategory: (category) => set((state) => ({ categories: [...state.categories, { id: Date.now(), ...category }] })),
      deleteCategory: (id) => set((state) => ({ categories: state.categories.filter(c => c.id !== id) })),
      updateCategory: (id, updatedData) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updatedData } : c)
      })),
    }),
    {
      name: 'app-storage',
    }
  )
);
