import { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Plus, Trash2, AlertTriangle, Pencil } from 'lucide-react';

export default function Categories() {
  const { categories, addCategory, deleteCategory, updateCategory } = useAppStore();
  const { addToast } = useUIStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      if (editingCategory) {
        updateCategory(editingCategory.id, formData);
        addToast("Kategoriya muvaffaqiyatli yangilandi!", "success");
      } else {
        addCategory(formData);
        addToast("Kategoriya muvaffaqiyatli qo'shildi!", "success");
      }
      setFormData({ name: '' });
      setIsModalOpen(false);
      setEditingCategory(null);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      addToast("Kategoriya o'chirildi", "info");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Kategoriyalar</h1>
          <p className="text-dark-textMuted mt-1">Mahsulot toifalari va ularni boshqarish</p>
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
                <th className="pb-3 font-medium">Nomi</th>
                <th className="pb-3 font-medium text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {categories.map(category => (
                <tr key={category.id} className="group">
                  <td className="py-4 font-medium">{category.name}</td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(category)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(category.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="O'chirish"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="2" className="py-8 text-center text-dark-textMuted">
                    Hali kategoriyalar qo'shilmagan
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
            <h2 className="text-xl font-bold text-dark-text mb-2">Kategoriyani o'chirish</h2>
            <p className="text-dark-textMuted mb-6">
              Siz rostdan ham ushbu kategoriyani o'chirib tashlamoqchimisiz?
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
            <h2 className="text-xl font-bold mb-4">{editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Nomi</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Kategoriya nomi"
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
