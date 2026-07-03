import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { Plus, Trash2, Eye, Heart, Tag, AlertTriangle, Pencil } from 'lucide-react';
import ProductEditModal from '../components/ProductEditModal';

export default function Products() {
  const navigate = useNavigate();
  const { products, deleteProduct } = useAppStore();
  const { addToast } = useUIStore();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const openDeleteModal = (e, id) => {
    e.stopPropagation(); // Prevent card click event
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        addToast("Mahsulot muvaffaqiyatli o'chirildi", "info");
      } catch (err) {
        console.error("Delete error:", err);
        addToast("O'chirishda xatolik yuz berdi!", "error");
      }
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Helper to format currency
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  // Helper to return status color classes
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Draft':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'Out of Stock':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default:
        return 'bg-dark-border text-dark-textMuted border-dark-border/55';
    }
  };

  const BACKEND_URL = 'https://soat.techinfo.uz';
  const resolveImage = (img) => {
    if (!img) return 'https://via.placeholder.com/400';
    if (img.startsWith('http') || img.startsWith('data:image')) return img;
    if (img.startsWith('/uploads/')) return `${BACKEND_URL}${img}`;
    return `${BACKEND_URL}/uploads/${img}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
          <p className="text-dark-textMuted mt-1">Katalogdagi barcha soatlar va ularning holatlari boshqaruvi</p>
        </div>
        <button 
          onClick={() => navigate('/products/create')} 
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-500/15 hover:shadow-primary-500/25 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" /> Yangi mahsulot
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
          const hasMultipleImages = product.images && product.images.length > 1;
          const coverImage = resolveImage(product.images?.[0]);
          const hoverImage = hasMultipleImages ? resolveImage(product.images[1]) : null;

          return (
            <div 
              key={product.id} 
              onClick={() => navigate(`/products/${product.id}`)}
              className="card group hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden p-0 flex flex-col cursor-pointer bg-dark-card border border-dark-border shadow-xl hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.4)]"
            >
              {/* Product Cover image frame */}
              <div className="relative h-64 w-full bg-dark-bg overflow-hidden border-b border-dark-border">
                {/* Primary Cover Image */}
                <img 
                  src={coverImage} 
                  alt={product.name} 
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                    hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105 duration-700'
                  }`}
                />
                
                {/* Hover Alternate Image */}
                {hoverImage && (
                  <img 
                    src={hoverImage} 
                    alt={`${product.name} alternate`} 
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                
                {/* Count badge for additional images */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md backdrop-blur-md border border-white/10 z-10">
                    +{product.images.length - 1} rasm
                  </div>
                )}
                
                {/* Discount percentage tag */}
                {product.salePercent > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-red-500/20 z-10">
                    -{product.salePercent}%
                  </div>
                )}

                {/* Quick Edit button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToEdit(product);
                    setEditModalOpen(true);
                  }}
                  className="absolute top-3 right-12 p-2 bg-primary-500/85 text-white hover:bg-primary-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 shadow-md"
                  title="Tahrirlash"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Quick Delete button */}
                <button 
                  onClick={(e) => openDeleteModal(e, product.id)}
                  className="absolute top-3 right-3 p-2 bg-red-500/85 text-white hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Product Content Block */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">{product.category}</span>
                    <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-primary-400 transition-colors line-clamp-1">{product.name}</h3>
                  {product.sku && <p className="text-xs text-dark-textMuted font-mono">SKU: {product.sku}</p>}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-baseline gap-2">
                    {product.saleprice ? (
                      <>
                        <span className="text-2xl font-bold text-white">{formatPrice(product.saleprice)}</span>
                        <span className="text-xs text-dark-textMuted line-through">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-border flex items-center justify-between text-xs text-dark-textMuted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Ko'rishlar">
                      <Eye className="w-3.5 h-3.5" /> {product.history?.views || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Yoqtirishlar">
                      <Heart className="w-3.5 h-3.5" /> {product.likes || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-medium" title="Ombordagi soni">
                    <Tag className="w-3.5 h-3.5" /> Skladda: <strong className="text-white">{product.quantity} {product.unit || 'dona'}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <div className="col-span-full card text-center py-20 text-dark-textMuted border-dashed border-2 border-dark-border/50">
            Hozircha katalogda hech qanday soat mavjud emas.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="card w-full max-w-sm animate-in zoom-in-95 duration-200 text-center p-6 bg-dark-card border border-dark-border shadow-2xl rounded-2xl">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Mahsulotni o'chirish</h2>
            <p className="text-sm text-dark-textMuted mb-6">
              Ushbu mahsulotni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="btn btn-secondary flex-1 py-2.5 rounded-xl border border-dark-border text-xs font-semibold"
              >
                Bekor qilish
              </button>
              <button 
                onClick={confirmDelete} 
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl flex-1 py-2.5 text-xs font-semibold shadow-lg shadow-red-500/15"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Edit Modal */}
      <ProductEditModal 
        product={productToEdit} 
        isOpen={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setProductToEdit(null);
        }} 
      />
    </div>
  );
}
