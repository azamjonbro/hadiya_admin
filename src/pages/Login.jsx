import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Watch, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuthStore();
  const { managers } = useAppStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const superAdminPassword = useAppStore.getState().superAdminPassword;

    // Super Admin check
    if (cleanUsername === 'admin' && cleanPassword === superAdminPassword) {
      login({ id: 1, name: 'Asosiy Admin', role: 'super_admin' });
      navigate('/');
      addToast("Xush kelibsiz, Asosiy Admin!", "success");
      return;
    }

    // Manager check
    const manager = managers.find(m => m.username.toLowerCase() === cleanUsername);
    if (manager && manager.password === cleanPassword) {
      login({ id: manager.id, name: manager.name, role: 'manager' });
      navigate('/products');
      addToast(`Xush kelibsiz, ${manager.name}!`, "success");
      return;
    }

    setError("Login yoki parol xato!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="card w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div>
          <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20 shadow-lg shadow-primary-500/5">
            <Watch className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SoatShop</h1>
          <p className="text-dark-textMuted text-sm">
            Admin: <strong>admin</strong> / Birlamchi parol: <strong>123</strong> <br />
            Menajer: Qo'shilgan Username va Parol orqali
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-dark-textMuted mb-1">Username</label>
            <input 
              type="text" 
              required
              className="input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-textMuted mb-1">Parol</label>
            <input 
              type="password" 
              required
              className="input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="***"
            />
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 btn btn-primary mt-6 !py-3"
          >
            <LogIn className="w-5 h-5" />
            <span>Kirish</span>
          </button>
        </form>
      </div>
    </div>
  );
}
