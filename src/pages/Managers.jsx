import { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Plus, Trash2, AlertTriangle, Pencil } from 'lucide-react';

export default function Managers() {
  const { managers, addManager, deleteManager, updateManager } = useAppStore();
  const { addToast } = useUIStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState(null);
  const [editingManager, setEditingManager] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.username && formData.password) {
      if (editingManager) {
        updateManager(editingManager.id, formData);
        addToast("Menajer muvaffaqiyatli yangilandi!", "success");
      } else {
        addManager(formData);
        addToast("Menajer muvaffaqiyatli qo'shildi!", "success");
      }
      setFormData({ name: '', username: '', password: '' });
      setIsModalOpen(false);
      setEditingManager(null);
    }
  };

  const openAddModal = () => {
    setEditingManager(null);
    setFormData({ name: '', username: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (manager) => {
    setEditingManager(manager);
    setFormData({ name: manager.name, username: manager.username, password: manager.password });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setManagerToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (managerToDelete) {
      deleteManager(managerToDelete);
      addToast("Menajer o'chirildi", "info");
      setDeleteModalOpen(false);
      setManagerToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingManager(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Menajerlar</h1>
          <p className="text-dark-textMuted mt-1">Tizimga kirish huquqiga ega menajerlarni boshqarish</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Yangi qo'shish
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-dark-textMuted border-b border-dark-border">
                <th className="pb-3 font-medium">Ism</th>
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {managers.map(manager => (
                <tr key={manager.id} className="group">
                  <td className="py-4 font-medium">{manager.name}</td>
                  <td className="py-4 text-dark-textMuted">{manager.username}</td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(manager)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(manager.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="O'chirish"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-dark-textMuted">
                    Hali menajerlar qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="card w-full max-w-sm animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Menajerni o'chirish</h2>
            <p className="text-dark-textMuted mb-6">
              Siz rostdan ham ushbu menajerni o'chirib tashlamoqchimisiz?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="btn btn-secondary flex-1"
              >
                Bekor qilish
              </button>
              <button 
                onClick={confirmDelete} 
                className="btn bg-red-500 hover:bg-red-600 text-white flex-1"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">{editingManager ? "Menajerni Tahrirlash" : "Yangi Menajer Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Ism</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sardor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="sardor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Parol (Password)</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Parolni kiriting..."
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
