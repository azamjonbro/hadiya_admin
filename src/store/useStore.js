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
    name: 'Rolex Submariner Date',
    sku: 'RLX-SUB-126610',
    barcode: '840029381023',
    brand: 'Rolex',
    category: 'Premium',
    categoryId: 1,
    price: '15000',
    saleprice: '14200',
    salePercent: 5,
    quantity: '12',
    unit: 'dona',
    status: 'Active', // Active, Draft, Out of Stock
    shortDescription: 'Monochrome luxury diver watch in Oystersteel with black dial and Cerachrom bezel.',
    fullDescription: '<h1>Rolex Submariner Date</h1><p>The Rolex Submariner Date in Oystersteel with a Cerachrom insert in black ceramic and a black dial with large luminescent hour markers.</p><h3>Key Features</h3><ul><li>Oystersteel resistant to corrosion.</li><li>Unidirectional rotatable bezel with 60-minute graduation.</li><li>Waterproof to 300 metres / 1,000 feet.</li></ul>',
    characteristics: [
      { name: 'Model', value: 'Submariner Date' },
      { name: 'Case diameter', value: '41 mm' },
      { name: 'Material', value: 'Oystersteel' },
      { name: 'Bezel', value: 'Unidirectional rotatable 60-minute' },
      { name: 'Dial', value: 'Black Cerachrom' },
      { name: 'Power reserve', value: '70 hours' },
      { name: 'Water resistance', value: '300 m (1,000 ft)' },
      { name: 'Warranty', value: '5 Years' }
    ],
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=600&auto=format&fit=crop'
    ],
    likes: '125',
    history: { views: 1540 }
  },
  {
    id: 2,
    name: 'Omega Speedmaster Professional',
    sku: 'OMG-SPD-31030',
    barcode: '761325893012',
    brand: 'Omega',
    category: 'Premium',
    categoryId: 1,
    price: '7600',
    saleprice: '',
    salePercent: 0,
    quantity: '0',
    unit: 'dona',
    status: 'Out of Stock',
    shortDescription: 'The legendary Moonwatch chronograph, a true icon of space exploration.',
    fullDescription: '<h2>The Legendary Moonwatch</h2><p>The Omega Speedmaster Professional Co-Axial Master Chronometer Chronograph is one of the world’s most iconic timepieces. Having been a part of all six lunar missions, the legendary chronograph is an impressive representation of the brand’s adventurous pioneering spirit.</p>',
    characteristics: [
      { name: 'Model', value: 'Speedmaster Moonwatch' },
      { name: 'Case diameter', value: '42 mm' },
      { name: 'Material', value: 'Stainless Steel' },
      { name: 'Caliber', value: 'Omega 3861' },
      { name: 'Glass', value: 'Hesalite' },
      { name: 'Power reserve', value: '50 hours' },
      { name: 'Warranty', value: '5 Years' }
    ],
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop'
    ],
    likes: '89',
    history: { views: 980 }
  }
];

const initialOrders = [
  { id: 101, customerName: 'Ali Valiyev', address: 'Toshkent, Yunusobod', phone: '+998901234567', total: 1200, status: 'Kutilmoqda', date: '2026-07-01' },
];

const initialManagers = [
  { id: 1, name: 'Sardor Manager', username: 'sardor', password: '123' },
];

const initialCategories = [
  { id: 1, name: 'Premium' },
  { id: 2, name: 'Classic' },
  { id: 3, name: 'Sport' }
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
      
      addProduct: (product) => set((state) => ({ products: [...state.products, { id: Date.now(), likes: '0', history: { views: 0 }, ...product }] })),
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
