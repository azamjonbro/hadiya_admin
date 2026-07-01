import { useState } from 'react';
import { useAuthStore } from '../store/useStore';
import { LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="md:hidden text-xl font-bold text-primary-500 tracking-tight">AdminPanel</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </div>
      </header>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 ml-1" />
            </div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Tizimdan chiqish</h2>
            <p className="text-dark-textMuted mb-6">
              Rostdan ham tizimdan chiqishni xohlaysizmi?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsLogoutModalOpen(false)} 
                className="btn btn-secondary flex-1"
              >
                Yo'q
              </button>
              <button 
                onClick={handleLogout} 
                className="btn bg-red-500 hover:bg-red-600 text-white flex-1"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
