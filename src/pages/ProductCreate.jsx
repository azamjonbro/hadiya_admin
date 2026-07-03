import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';
import RichEditor from '../components/RichEditor';
import ImageUploader from '../components/ImageUploader';
import CharacteristicsInput from '../components/CharacteristicsInput';
import CustomSelect from '../components/CustomSelect';

export default function ProductCreate() {
  const navigate = useNavigate();
  const { addProduct, categories } = useAppStore();
  const { addToast } = useUIStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    brand: '',
    category: categories[0]?.name || 'Premium',
    categoryId: categories[0]?.id || 1,
    price: '',
    saleprice: '',
    quantity: '',
    unit: 'dona',
    status: 'Active', // Active, Draft, Out of Stock
    shortDescription: '',
    fullDescription: '',
    images: [],
    characteristics: []
  });

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

    if (!formData.name || !formData.price || !formData.quantity) {
      addToast("Iltimos, majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    const price = Number(formData.price) || 0;
    const saleprice = Number(formData.saleprice) || 0;
    let salePercent = 0;
    if (saleprice > 0 && saleprice < price) {
      salePercent = Math.round(((price - saleprice) / price) * 100);
    }

    // Find category ID matching name
    const matchingCat = categories.find(c => c.name === formData.category);
    const catId = matchingCat ? matchingCat.id : 1;

    setIsSaving(true);

    try {
      await addProduct({
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        brand: formData.brand,
        category: formData.category,
        categoryId: catId,
        price: String(price),
        saleprice: saleprice ? String(saleprice) : '',
        salePercent: salePercent || 0,
        quantity: String(formData.quantity),
        unit: formData.unit,
        status: formData.status,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        images: formData.images.length > 0 ? formData.images : ['https://via.placeholder.com/600'],
        characteristics: formData.characteristics
      });

      addToast("Mahsulot muvaffaqiyatli saqlandi!", "success");
      navigate('/products');
    } catch (err) {
      console.error("Save product error:", err);
      addToast(err.response?.data?.message || err.response?.data?.error || "Mahsulotni saqlashda xatolik yuz berdi!", "error");
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="p-2.5 bg-dark-card border border-dark-border text-dark-textMuted hover:text-white rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Yangi Mahsulot</h1>
            <p className="text-dark-textMuted mt-1">Katalogga yangi soat va xususiyatlarni qo'shish</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn btn-secondary flex-1 sm:flex-initial py-2.5 rounded-xl border border-dark-border text-xs font-semibold px-6"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/15 hover:shadow-primary-500/25 transition-all flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Form fields) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: General Info */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Asosiy ma'lumotlar</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Mahsulot nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Rolex Daytona Gold"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Brend *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Rolex"
                  className="input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Kategoriya</label>
                <CustomSelect
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Inventory */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Narxlar va Ombor</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Asosiy narxi ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Chegirma narxi ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="input"
                  value={formData.saleprice}
                  onChange={(e) => setFormData({ ...formData, saleprice: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Skladdagi soni *</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Birlik</label>
                <input
                  type="text"
                  placeholder="dona"
                  className="input"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Identification */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-dark-border pb-2">
              <h2 className="text-lg font-bold text-white">Identifikatsiya</h2>
              <button
                type="button"
                onClick={generateSKUAndBarcode}
                className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" /> Avto-generatsiya
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">SKU (Artikul)</label>
                <input
                  type="text"
                  placeholder="Masalan: RLX-SUB-123"
                  className="input font-mono uppercase"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Barkod (UPC/EAN)</label>
                <input
                  type="text"
                  placeholder="Masalan: 840029381023"
                  className="input font-mono"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Description */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Tavsif (Description)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-textMuted mb-1">Qisqa tavsif (Short Description)</label>
                <textarea
                  rows={2}
                  placeholder="Karta va ro'yxatda chiqadigan qisqacha tavsif matni..."
                  className="input py-2 resize-none"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <RichEditor
                label="To'liq tavsif (Full Rich Description)"
                value={formData.fullDescription}
                onChange={(val) => setFormData({ ...formData, fullDescription: val })}
              />
            </div>
          </div>

          {/* Card 5: Characteristics */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Texnik xususiyatlari</h2>
            <CharacteristicsInput
              value={formData.characteristics}
              onChange={(val) => setFormData({ ...formData, characteristics: val })}
            />
          </div>

        </div>

        {/* Right Column (Sidebar inputs) */}
        <div className="space-y-6">
          
          {/* Card 1: Publish Status */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Nashr holati (Status)</h2>
            <CustomSelect
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
            />
          </div>

          {/* Card 2: Media Files */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-dark-border pb-2">Media galereyasi</h2>
            <ImageUploader
              images={formData.images}
              onChange={(val) => setFormData({ ...formData, images: val })}
            />
          </div>

        </div>

      </div>
    </form>
  );
}
