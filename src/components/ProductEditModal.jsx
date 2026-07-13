import { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import RichEditor from './RichEditor';
import ImageUploader from './ImageUploader';
import CharacteristicsInput from './CharacteristicsInput';
import CustomSelect from './CustomSelect';

export default function ProductEditModal({ product, isOpen, onClose }) {
  const { updateProduct, categories } = useAppStore();
  const { addToast } = useUIStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    brand: '',
    category: '',
    categoryId: 1,
    price: '',
    saleprice: '',
    quantity: '',
    unit: 'dona',
    status: 'Active',
    shortDescription: '',
    fullDescription: '',
    images: [],
    characteristics: []
  });

  const cleanNumeric = (val) => {
    if (val === undefined || val === null) return '';
    return String(val).replace(/\s/g, '').replace(/UZS/gi, '').replace(/[^\d.]/g, '');
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        brand: product.brand || '',
        category: product.category || '',
        categoryId: product.categoryId || 1,
        price: cleanNumeric(product.price),
        saleprice: cleanNumeric(product.saleprice),
        quantity: cleanNumeric(product.quantity),
        unit: product.unit || 'dona',
        status: product.status || 'Active',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        images: product.images || [],
        characteristics: product.characteristics || []
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const generateSKUAndBarcode = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const brandCode = formData.brand ? formData.brand.substring(0, 3).toUpperCase() : 'WCH';
    const sku = `${brandCode}-${randomNum}`;
    const barcode = `840${Math.floor(100000000 + Math.random() * 900000000)}`;
    setFormData(prev => ({ ...prev, sku, barcode }));
    addToast("SKU va Barcode generatsiya qilindi", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPrice = cleanNumeric(formData.price);
    const cleanedQuantity = cleanNumeric(formData.quantity);

    if (!formData.name || !cleanedPrice || !cleanedQuantity) {
      addToast("Iltimos, majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    const price = Number(cleanedPrice) || 0;
    const saleprice = Number(cleanNumeric(formData.saleprice)) || 0;
    let salePercent = 0;
    if (saleprice > 0 && saleprice < price) {
      salePercent = Math.round(((price - saleprice) / price) * 100);
    }

    const matchingCat = categories.find(c => c.name === formData.category);
    const catId = matchingCat ? matchingCat.id : 1;

    setIsSaving(true);

    try {
      await updateProduct(product.id, {
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        brand: formData.brand,
        category: formData.category,
        categoryId: catId,
        price: String(price),
        saleprice: saleprice ? String(saleprice) : '',
        salePercent: salePercent || 0,
        quantity: String(cleanedQuantity),
        unit: formData.unit,
        status: formData.status,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/600'],
        characteristics: formData.characteristics
      });

      addToast("Mahsulot muvaffaqiyatli yangilandi!", "success");
      onClose();
    } catch (err) {
      console.error("Update product error:", err);
      addToast(err.response?.data?.message || err.response?.data?.error || "Xatolik yuz berdi!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: 'Active', label: 'Active (Sotuvda)' },
    { value: 'Draft', label: 'Draft (Qoralama)' },
    { value: 'Out of Stock', label: 'Out of Stock (Tugagan)' }
  ];

  const categoryOptions = categories.map(c => ({
    value: c.name,
    label: c.name
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-dark-border bg-dark-bg">
          <div>
            <h2 className="text-lg font-bold text-white">Mahsulotni Tahrirlash</h2>
            <p className="text-[10px] text-dark-textMuted mt-0.5 font-mono">ID: {product.id} • {product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-dark-textMuted hover:text-white rounded-lg hover:bg-dark-border transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Fields */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-textMuted">Mahsulot Nomi *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masalan: Al-Harameen HA-6111" 
                  className="input w-full"
                />
              </div>

              {/* SKU & Barcode Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">SKU</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.sku} 
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="input flex-1 font-mono text-xs"
                    />
                    <button 
                      type="button" 
                      onClick={generateSKUAndBarcode}
                      className="p-2.5 bg-dark-bg hover:bg-dark-border border border-dark-border rounded-xl text-primary-400 hover:text-primary-300 transition-colors"
                      title="Generatsiya"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Shtrix Kod (Barcode)</label>
                  <input 
                    type="text" 
                    value={formData.barcode} 
                    onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                    className="input w-full font-mono text-xs"
                  />
                </div>
              </div>

              {/* Category, Brand, Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Kategoriya</label>
                  <CustomSelect 
                    options={categoryOptions} 
                    value={formData.category} 
                    onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Brend</label>
                  <input 
                    type="text" 
                    value={formData.brand} 
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="input w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Holat (Status)</label>
                  <CustomSelect 
                    options={statusOptions} 
                    value={formData.status} 
                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  />
                </div>
              </div>

              {/* Price & Quantity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-dark-textMuted">Asosiy Narx (UZS) *</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="input w-full font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Aksiya Narxi (UZS)</label>
                  <input 
                    type="number" 
                    value={formData.saleprice} 
                    onChange={(e) => setFormData(prev => ({ ...prev, saleprice: e.target.value }))}
                    className="input w-full text-red-400 font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-textMuted">Miqdor (Ombor) *</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={formData.quantity} 
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="input flex-1 text-center font-bold"
                    />
                    <input 
                      type="text" 
                      value={formData.unit} 
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="input w-16 text-center text-xs"
                      placeholder="dona"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-textMuted">Qisqa Tavsif (Qidiruv uchun)</label>
                <textarea 
                  value={formData.shortDescription} 
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={2}
                  className="input w-full py-2.5 resize-none text-xs"
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                />
              </div>

              {/* Full Description (Rich Editor) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-textMuted">Batafsil Tavsif (Rich Text Editor)</label>
                <RichEditor 
                  value={formData.fullDescription} 
                  onChange={(val) => setFormData(prev => ({ ...prev, fullDescription: val }))}
                />
              </div>

            </div>

            {/* Right Fields (Images & Specs) */}
            <div className="space-y-5">
              
              {/* Image Uploader */}
              <div className="card bg-dark-bg border border-dark-border rounded-xl p-4">
                <ImageUploader 
                  images={formData.images} 
                  onChange={(newImgs) => setFormData(prev => ({ ...prev, images: newImgs }))}
                  label="Mahsulot Rasmlari (Birinchi rasm muqova bo'ladi)"
                />
              </div>

              {/* Characteristics/Specifications */}
              <div className="card bg-dark-bg border border-dark-border rounded-xl p-4">
                <CharacteristicsInput 
                  characteristics={formData.characteristics} 
                  onChange={(newSpecs) => setFormData(prev => ({ ...prev, characteristics: newSpecs }))}
                  label="Texnik Xususiyatlari (Jadval)"
                />
              </div>

            </div>

          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-dark-border bg-dark-bg">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary py-2.5 rounded-xl border border-dark-border text-xs font-semibold px-6"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/15 hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>

      </div>
    </div>
  );
}
