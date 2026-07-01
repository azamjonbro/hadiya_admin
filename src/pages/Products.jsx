import { useState, useRef } from 'react';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Plus, Trash2, Eye, Heart, Tag, UploadCloud, X, AlertTriangle } from 'lucide-react';

export default function Products() {
  const { products, addProduct, deleteProduct } = useAppStore();
  const { addToast } = useUIStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    saleprice: '', 
    quantity: '', 
    category: '',
    images: [] // Baza64 formatidagi rasmlar massivi
  });
  
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.price) {
      
      const price = Number(formData.price) || 0;
      const saleprice = Number(formData.saleprice) || 0;
      let salePercent = 0;
      if (saleprice > 0 && saleprice < price) {
        salePercent = Math.round(((price - saleprice) / price) * 100);
      }

      addProduct({
        name: formData.name,
        price: String(price),
        saleprice: saleprice ? String(saleprice) : undefined,
        salePercent: salePercent || undefined,
        quantity: String(formData.quantity || '0'),
        category: formData.category || 'General',
        categoryId: 1, 
        images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/400'],
        status: true,
        history: { views: 0 },
        likes: "0"
      });
      
      setFormData({ name: '', price: '', saleprice: '', quantity: '', category: '', images: [] });
      setIsModalOpen(false);
      addToast("Mahsulot muvaffaqiyatli qo'shildi!", "success");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      addToast("Mahsulot o'chirildi", "info");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Mahsulotlar</h1>
          <p className="text-dark-textMuted mt-1">Barcha mahsulotlar ro'yxati va ularning holati</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Yangi qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="card group hover:border-primary-500/50 transition-colors overflow-hidden p-0 flex flex-col">
            <div className="relative h-56 w-full bg-dark-bg">
              {product.images && product.images[0] && (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              )}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-md">
                  +{product.images.length - 1} rasm
                </div>
              )}
              {product.salePercent > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-red-500/20">
                  -{product.salePercent}%
                </div>
              )}
              <button 
                onClick={() => openDeleteModal(product.id)}
                className="absolute top-3 right-3 p-2 bg-red-500/80 text-white hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-primary-400 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1 mb-4">
                {product.saleprice ? (
                  <>
                    <span className="text-2xl font-bold text-white">${product.saleprice}</span>
                    <span className="text-sm text-dark-textMuted line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-dark-border flex items-center justify-between text-sm text-dark-textMuted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5" title="Ko'rishlar">
                    <Eye className="w-4 h-4" /> {product.history?.views || 0}
                  </span>
                  <span className="flex items-center gap-1.5" title="Yoqtirishlar">
                    <Heart className="w-4 h-4" /> {product.likes || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Ombordagi soni">
                  <Tag className="w-4 h-4" /> Skladda: <strong className="text-white">{product.quantity}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full card text-center py-16 text-dark-textMuted border-dashed">
            Hali mahsulotlar qo'shilmagan
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="card w-full max-w-sm animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-dark-text mb-2">Mahsulotni o'chirish</h2>
            <p className="text-dark-textMuted mb-6">
              Siz rostdan ham ushbu mahsulotni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl animate-in zoom-in-95 duration-200 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Yangi Mahsulot Qo'shish</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Rasm Yuklash Qismi */}
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-2">Mahsulot Rasmlari</label>
                <div 
                  className="border-2 border-dashed border-dark-border hover:border-primary-500/50 bg-dark-bg/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-dark-text">Rasm yuklash uchun bosing yoki fayllarni tortib tashlang</p>
                  <p className="text-xs text-dark-textMuted mt-1">PNG, JPG, WEBP (Istalgancha rasm yuklashingiz mumkin)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple 
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
                
                {/* Rasm Preview (Ko'rib chiqish) */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-dark-border aspect-square bg-dark-bg">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Nomi *</label>
                  <input 
                    type="text" 
                    required
                    className="input" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Kategoriya</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Ombordagi Soni (Quantity) *</label>
                  <input 
                    type="number" 
                    required
                    className="input" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Asosiy Narxi ($) *</label>
                  <input 
                    type="number" 
                    required
                    className="input" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-textMuted mb-1">Chegirmadagi Narxi ($)</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={formData.saleprice}
                    onChange={(e) => setFormData({...formData, saleprice: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-dark-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary px-6">
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary px-6">
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
