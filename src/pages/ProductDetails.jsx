import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { 
  ArrowLeft, Copy, Check, Star, Calendar, RefreshCw, Layers, ShieldCheck, ShoppingBag, Eye, X, Maximize2 
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useAppStore();
  const { addToast } = useUIStore();

  const product = products.find(p => p.id === Number(id));

  const BACKEND_URL = 'https://soat.techinfo.uz';
  const resolveImage = (img) => {
    if (!img) return 'https://via.placeholder.com/400';
    if (img.startsWith('http') || img.startsWith('data:image')) return img;
    if (img.startsWith('/uploads/')) return `${BACKEND_URL}${img}`;
    return `${BACKEND_URL}/uploads/${img}`;
  };

  // State hooks
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'characteristics' | 'gallery' | 'history'
  const [copiedField, setCopiedField] = useState(''); // 'sku' | 'barcode'
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-300">
        <div className="card max-w-md mx-auto p-8 border border-dark-border bg-dark-card space-y-6">
          <div className="text-5xl">🕰️</div>
          <h2 className="text-2xl font-bold text-white">Mahsulot topilmadi</h2>
          <p className="text-dark-textMuted">
            Ushbu ID dagi mahsulot tizimda mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-primary w-full py-2.5 rounded-xl text-xs font-semibold">
            Mahsulotlarga qaytish
          </button>
        </div>
      </div>
    );
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast(`${field.toUpperCase()} nusxalandi!`, "info");
    setTimeout(() => setCopiedField(''), 2000);
  };

  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3 border-b border-dark-border pb-5">
        <button
          onClick={() => navigate('/products')}
          className="p-2.5 bg-dark-card border border-dark-border text-dark-textMuted hover:text-white rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="text-dark-textMuted text-xs mt-1 font-mono">ID: {product.id} • Kategoriya: {product.category}</p>
        </div>
      </div>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Premium Images Gallery */}
        <div className="space-y-4">
          
          {/* Active Image Viewport */}
          <div 
            onClick={() => setLightboxOpen(true)}
            className="relative rounded-2xl overflow-hidden border border-dark-border aspect-[4/3] bg-dark-card group cursor-zoom-in"
          >
            <img 
              src={resolveImage(product.images[activeImgIndex])} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            
            {/* Hover Fullscreen trigger */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 bg-dark-card/95 rounded-xl border border-dark-border text-white shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-sm">
                <Maximize2 className="w-4 h-4" /> Kattalashtirish
              </div>
            </div>
            
            {/* Cover indicator */}
            {activeImgIndex === 0 && (
              <div className="absolute top-4 left-4 bg-primary-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-lg shadow-primary-500/20">
                Asosiy Rasm
              </div>
            )}
          </div>

          {/* Thumbnails Carousel */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 shrink-0 select-none scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all shrink-0 ${
                    idx === activeImgIndex 
                      ? 'border-primary-500 scale-102 ring-2 ring-primary-500/30' 
                      : 'border-dark-border hover:border-dark-textMuted'
                  }`}
                >
                  <img src={resolveImage(img)} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Key Product Information */}
        <div className="space-y-6">
          
          {/* Core Info card */}
          <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 border text-[10px] uppercase font-bold tracking-wider rounded-full bg-primary-500/10 text-primary-400 border-primary-500/20">
                  {product.brand || 'No Brand'}
                </span>
                <span className={`px-2.5 py-0.5 border text-[10px] uppercase font-bold tracking-wider rounded-full ${getStatusBadge(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h2>
              <p className="text-dark-textMuted text-sm">{product.shortDescription || 'Ushbu mahsulot uchun qisqa tavsif kiritilmagan.'}</p>
            </div>

            {/* Price Frame */}
            <div className="bg-dark-bg/40 border border-dark-border/60 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-dark-textMuted block mb-1">Narxi</span>
                <div className="flex items-baseline gap-2">
                  {product.saleprice ? (
                    <>
                      <span className="text-3xl font-bold text-white">{formatPrice(product.saleprice)}</span>
                      <span className="text-sm text-dark-textMuted line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
              
              {product.salePercent > 0 && (
                <div className="bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                  Chegirma: -{product.salePercent}%
                </div>
              )}
            </div>

            {/* Inventory Status */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-dark-border py-4">
              <div>
                <span className="text-xs text-dark-textMuted block">Skladdagi soni</span>
                <span className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-primary-400" />
                  {product.quantity} {product.unit || 'dona'}
                </span>
              </div>

              <div>
                <span className="text-xs text-dark-textMuted block">Baholash</span>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-xs text-white font-medium ml-1">5.0</span>
                </div>
              </div>
            </div>

            {/* Serial metadata tags */}
            <div className="space-y-2 text-xs font-mono">
              {product.sku && (
                <div className="flex items-center justify-between py-1 border-b border-dark-border/40">
                  <span className="text-dark-textMuted">SKU (Artikul):</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <span>{product.sku}</span>
                    <button 
                      onClick={() => handleCopy(product.sku, 'sku')}
                      className="p-1 hover:bg-dark-border rounded text-dark-textMuted hover:text-white"
                    >
                      {copiedField === 'sku' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {product.barcode && (
                <div className="flex items-center justify-between py-1 border-b border-dark-border/40">
                  <span className="text-dark-textMuted">Barkod:</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <span>{product.barcode}</span>
                    <button 
                      onClick={() => handleCopy(product.barcode, 'barcode')}
                      className="p-1 hover:bg-dark-border rounded text-dark-textMuted hover:text-white"
                    >
                      {copiedField === 'barcode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="text-dark-textMuted text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Yaratilgan:
                </span>
                <span className="text-dark-textMuted">2026-07-01</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Tabs Layout */}
      <div className="space-y-4">
        {/* Tabs Bar */}
        <div className="flex border-b border-dark-border gap-6 overflow-x-auto pb-0.5">
          {[
            { id: 'description', label: 'Tavsif (Description)' },
            { id: 'characteristics', label: 'Xususiyatlar' },
            { id: 'gallery', label: 'Galereya grid' },
            { id: 'history', label: 'Tarix' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-primary-500 text-white' 
                  : 'border-transparent text-dark-textMuted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Viewport */}
        <div className="card bg-dark-card border border-dark-border rounded-2xl p-6 min-h-[160px]">
          
          {/* Tab 1: Rich Description */}
          {activeTab === 'description' && (
            <div 
              className="prose prose-invert max-w-none text-dark-text text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.fullDescription || '<p>To\'liq tavsif kiritilmagan.</p>' }}
            />
          )}

          {/* Tab 2: Specifications Table */}
          {activeTab === 'characteristics' && (
            <div className="overflow-x-auto">
              {product.characteristics && product.characteristics.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-textMuted font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 w-1/3">Texnik Xususiyat</th>
                      <th className="pb-3">Qiymat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/40 font-medium">
                    {product.characteristics.map((c, idx) => (
                      <tr key={idx} className="hover:bg-dark-bg/10">
                        <td className="py-3 text-dark-textMuted font-medium">{c.name}</td>
                        <td className="py-3 text-white font-semibold">{c.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-dark-textMuted">
                  Xususiyatlar jadvali bo'sh.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Responsive Gallery Grid */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setActiveImgIndex(idx); setLightboxOpen(true); }}
                  className="rounded-xl overflow-hidden border border-dark-border/80 hover:border-primary-500/40 aspect-square cursor-zoom-in group bg-dark-bg relative transition-colors"
                >
                  <img src={resolveImage(img)} alt={`Gallery grid ${idx}`} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: History Logs */}
          {activeTab === 'history' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 border-l-2 border-dark-border pl-4 pb-4 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="text-white font-semibold">Tizimga kiritildi (Yaratildi)</p>
                  <p className="text-dark-textMuted text-[10px] mt-0.5">2026-07-01 14:22:01 • Super Admin</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-l-2 border-dark-border pl-4 pb-4 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="text-white font-semibold">Narxlar yangilandi ($15000 {"→"} $14200 chegirma)</p>
                  <p className="text-dark-textMuted text-[10px] mt-0.5">2026-07-02 09:12:45 • Sardor Manager</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-4 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 absolute -left-[5px] top-1 animate-pulse" />
                <div>
                  <p className="text-white font-semibold">Oxirgi tekshiruv (Views audit)</p>
                  <p className="text-dark-textMuted text-[10px] mt-0.5">Hozirgina • Avtomatik audit</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-dark-card border border-dark-border hover:bg-dark-border text-white rounded-xl shadow-xl transition-colors backdrop-blur-sm z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox viewport */}
          <div className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
            <img 
              src={resolveImage(product.images[activeImgIndex])} 
              alt="Fullscreen View" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-dark-border"
            />
          </div>

          {/* Thumbnails below in lightbox */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto mt-6 max-w-full pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all ${
                    idx === activeImgIndex ? 'border-primary-500 scale-102 ring-2 ring-primary-500/30' : 'border-dark-border/50'
                  }`}
                >
                  <img src={resolveImage(img)} alt={`Thumb lightbox ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
