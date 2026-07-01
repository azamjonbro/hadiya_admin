import { useState } from 'react';
import { useAuthStore, useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { ShieldAlert, KeyRound, LogOut, CheckCircle2 } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { superAdminPassword, updateSuperAdminPassword, managers, updateManagerPassword } = useAppStore();
  const { addToast } = useUIStore();
  
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';

  const themeOptions = [
    { value: 'dark', label: 'Dark Mode' },
    { value: 'light', label: 'Light Mode (Tez kunda)', disabled: true }
  ];

  const handleThemeChange = (val) => {
    setTheme(val);
    addToast("Mavzu saqlandi!", "success");
  };

  const handleNotifChange = (e) => {
    setNotifications(e.target.checked);
    addToast(e.target.checked ? "Bildirishnomalar yoqildi" : "Bildirishnomalar o'chirildi", "info");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (passwords.new !== passwords.confirm) {
      setError("Yangi parollar mos kelmadi!");
      return;
    }

    if (passwords.new.length < 3) {
      setError("Parol kamida 3 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    if (isSuperAdmin) {
      if (passwords.current !== superAdminPassword) {
        setError("Joriy parol xato!");
        return;
      }
      updateSuperAdminPassword(passwords.new);
    } else {
      const manager = managers.find(m => m.id === user.id);
      if (!manager || passwords.current !== manager.password) {
        setError("Joriy parol xato!");
        return;
      }
      updateManagerPassword(user.id, passwords.new);
    }

    setSuccess(true);
    addToast("Parol muvaffaqiyatli o'zgartirildi!", "success");
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setSuccess(false);
    }, 2000);
  };

  const handleLogoutAll = () => {
    setIsLogoutModalOpen(false);
    logout();
    addToast("Barcha qurilmalardan chiqildi", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Sozlamalar</h1>
        <p className="text-dark-textMuted mt-1">Tizim parametrlarini o'zgartirish</p>
      </div>

      <div className="card space-y-8">
        <div>
          <h2 className="text-lg font-semibold border-b border-dark-border pb-2 mb-4">Umumiy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-dark-text">Tizim mavzusi</p>
                <p className="text-sm text-dark-textMuted">Hozirda faqat Dark Mode mavjud</p>
              </div>
              <CustomSelect 
                options={themeOptions}
                value={theme}
                onChange={handleThemeChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-dark-text">Bildirishnomalar</p>
                <p className="text-sm text-dark-textMuted">Yangi buyurtma kelganda xabar berish</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={handleNotifChange}
                />
                <div className="w-11 h-6 bg-dark-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold border-b border-dark-border pb-2 mb-4">Xavfsizlik</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="btn btn-secondary w-full text-left flex items-center gap-3"
            >
              <KeyRound className="w-5 h-5 text-primary-500" />
              Parolni o'zgartirish
            </button>
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="btn btn-secondary w-full text-left text-red-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Barcha qurilmalardan chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Logout All Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 ml-1" />
            </div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Barcha qurilmalardan chiqish</h2>
            <p className="text-dark-textMuted mb-6">
              Rostdan ham barcha qurilmalardagi sessiyalaringizni yakunlashni xohlaysizmi?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsLogoutModalOpen(false)} 
                className="btn btn-secondary flex-1"
              >
                Yo'q
              </button>
              <button 
                onClick={handleLogoutAll} 
                className="btn bg-red-500 hover:bg-red-600 text-white flex-1"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary-500" /> Parolni o'zgartirish
            </h2>
            
            {success ? (
              <div className="py-8 text-center text-green-500 flex flex-col items-center gap-3">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-medium">Parol muvaffaqiyatli o'zgartirildi!</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Joriy parol</label>
                  <input 
                    type="password" 
                    required
                    className="input" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Yangi parol</label>
                  <input 
                    type="password" 
                    required
                    className="input" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Yangi parolni tasdiqlang</label>
                  <input 
                    type="password" 
                    required
                    className="input" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn btn-secondary">
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Saqlash
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
