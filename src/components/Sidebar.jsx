import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings,
  Image as ImageIcon,
  Tags,
  Watch
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, adminOnly: true },
    { name: 'Managers', path: '/managers', icon: Users, adminOnly: true },
    { name: 'Products', path: '/products', icon: Package, adminOnly: false },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, adminOnly: false },
    { name: 'Categories', path: '/categories', icon: Tags, adminOnly: false },
    { name: 'Settings', path: '/settings', icon: Settings, adminOnly: true },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 w-full bg-dark-card border-t border-dark-border md:relative md:w-64 md:h-screen md:border-r md:border-t-0 md:flex md:flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
      <div className="hidden md:block p-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-500/10 text-primary-500 border border-primary-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/5">
            <Watch className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">SoatShop</h1>
            <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mt-1 block">Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex items-center justify-around md:flex-1 md:flex-col md:justify-start md:px-4 md:space-y-2 md:mt-4 p-2 md:p-0 w-full overflow-x-auto">
        {navItems.map((item) => {
          if (item.adminOnly && !isSuperAdmin) return null;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 w-full justify-center md:justify-start",
                isActive 
                  ? "text-primary-500 md:bg-primary-500/10 md:border md:border-primary-500/20" 
                  : "text-dark-textMuted hover:text-dark-text md:hover:bg-dark-border"
              )}
            >
              <item.icon className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[10px] sm:text-xs md:text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 px-4 py-3 bg-dark-bg rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-dark-textMuted truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
