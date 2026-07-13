import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

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

export const useAppStore = create((set, get) => ({
  superAdminPassword: '123',
  products: [],
  orders: [],
  managers: [],
  categories: [],
  loading: false,

  updateSuperAdminPassword: async (newPassword) => {
    try {
      await api.put('/superadmin/1', { password: newPassword });
      set({ superAdminPassword: newPassword });
    } catch (error) {
      console.error("updateSuperAdminPassword error:", error);
      throw error;
    }
  },

  updateManagerPassword: async (id, password) => {
    try {
      await api.put(`/manager/${id}`, { password });
    } catch (error) {
      console.error("updateManagerPassword error:", error);
      throw error;
    }
  },

  // 1. Fetching all initial data in parallel
  fetchInitialData: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchCategories(),
        get().fetchProducts(),
        get().fetchManagers(),
        get().fetchOrders()
      ]);
    } catch (err) {
      console.error("Failed to load initial backend data:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 2. Product API Actions
  fetchProducts: async () => {
    try {
      const response = await api.get('/product');
      // Backend returns raw products. Map and parse JSON fields like images and characteristics
      const mapped = response.data.map(p => {
        let parsedImages = [];
        try {
          parsedImages = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
        } catch (e) {
          parsedImages = [p.images];
        }

        let parsedSpecs = [];
        try {
          parsedSpecs = typeof p.characteristics === 'string' ? JSON.parse(p.characteristics) : (p.characteristics || []);
        } catch (e) {
          parsedSpecs = [];
        }

        return {
          ...p,
          id: Number(p.id),
          images: parsedImages,
          characteristics: parsedSpecs
        };
      });
      set({ products: mapped });
    } catch (error) {
      console.error("fetchProducts error:", error);
    }
  },

  addProduct: async (product) => {
    try {
      // Send payload with serialized JSON fields to be fully compliant with backend model
      const payload = {
        ...product,
        images: JSON.stringify(product.images),
        characteristics: JSON.stringify(product.characteristics),
        status: String(product.status)
      };
      await api.post('/product', payload);
      await get().fetchProducts();
    } catch (error) {
      console.error("addProduct error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const payload = {
        ...product,
        images: JSON.stringify(product.images),
        characteristics: JSON.stringify(product.characteristics),
        status: String(product.status)
      };
      await api.put(`/product/${id}`, payload);
      await get().fetchProducts();
    } catch (error) {
      console.error("updateProduct error:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/product/${id}`);
      await get().fetchProducts();
    } catch (error) {
      console.error("deleteProduct error:", error);
      throw error;
    }
  },

  // 3. Category API Actions
  fetchCategories: async () => {
    try {
      const response = await api.get('/category');
      set({ categories: response.data });
    } catch (error) {
      console.error("fetchCategories error:", error);
    }
  },

  addCategory: async (category) => {
    try {
      await api.post('/category', category);
      await get().fetchCategories();
    } catch (error) {
      console.error("addCategory error:", error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/category/${id}`);
      await get().fetchCategories();
    } catch (error) {
      console.error("deleteCategory error:", error);
      throw error;
    }
  },

  updateCategory: async (id, updatedData) => {
    try {
      await api.put(`/category/${id}`, updatedData);
      await get().fetchCategories();
    } catch (error) {
      console.error("updateCategory error:", error);
      throw error;
    }
  },

  // 4. Manager API Actions
  fetchManagers: async () => {
    try {
      const response = await api.get('/manager');
      set({ managers: response.data });
    } catch (error) {
      console.error("fetchManagers error:", error);
    }
  },

  addManager: async (manager) => {
    try {
      await api.post('/manager', {
        ...manager,
        status: true,
        superadminId: 1
      });
      await get().fetchManagers();
    } catch (error) {
      console.error("addManager error:", error);
      throw error;
    }
  },

  deleteManager: async (id) => {
    try {
      await api.delete(`/manager/${id}`);
      await get().fetchManagers();
    } catch (error) {
      console.error("deleteManager error:", error);
      throw error;
    }
  },

  updateManager: async (id, updatedData) => {
    try {
      await api.put(`/manager/${id}`, updatedData);
      await get().fetchManagers();
    } catch (error) {
      console.error("updateManager error:", error);
      throw error;
    }
  },

  // 5. Order (HistoryModel) API Actions
  fetchOrders: async () => {
    try {
      const response = await api.get('/orderhistory');
      const mapped = response.data.map(item => {
        let address = '';
        let status = 'Kutilmoqda';
        
        if (item.history) {
          try {
            const parsed = typeof item.history === 'string' ? JSON.parse(item.history) : item.history;
            address = parsed.address || '';
            status = parsed.status || 'Kutilmoqda';
          } catch (e) {
            address = item.history;
          }
        }

        const user = item.User || {};
        const product = item.Product || {};
        
        const customerName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : (user.firstName || 'Mijoz');
          
        const priceVal = Number(product.saleprice || product.price) || 0;
        const total = priceVal * (Number(item.quantity) || 1);

        return {
          id: item.id,
          customerName,
          address: address || user.phone || 'Noma\'lum',
          phone: user.phone || 'Noma\'lum',
          total,
          status,
          date: new Date(item.createdAt).toISOString().split('T')[0],
          raw: item
        };
      });
      set({ orders: mapped });
    } catch (error) {
      console.error("fetchOrders error:", error);
    }
  },

  updateOrderStatus: async (id, newStatus) => {
    try {
      const orders = get().orders;
      const order = orders.find(o => o.id === id);
      if (!order) return;

      const raw = order.raw;
      let historyObj = {};
      
      if (raw.history) {
        try {
          historyObj = typeof raw.history === 'string' ? JSON.parse(raw.history) : raw.history;
        } catch (e) {
          historyObj = { message: raw.history };
        }
      }
      
      historyObj.status = newStatus;

      await api.put(`/orderhistory/${id}`, {
        history: JSON.stringify(historyObj)
      });
      
      await get().fetchOrders();
    } catch (error) {
      console.error("updateOrderStatus error:", error);
      throw error;
    }
  }
}));
