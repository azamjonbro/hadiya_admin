import { useState, useRef } from 'react';
import { UploadCloud, X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function ImageUploader({ images, onChange, label }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { addToast } = useUIStore();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (files) => {
    const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      addToast("Iltimos, faqat rasm fayllarini yuklang!", "error");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate premium upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        let loadedCount = 0;
        const newBase64Images = [];

        validImageFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newBase64Images.push(reader.result);
            loadedCount++;
            
            if (loadedCount === validImageFiles.length) {
              onChange([...images, ...newBase64Images]);
              setUploading(false);
              addToast(`${validImageFiles.length} ta rasm muvaffaqiyatli yuklandi!`, "success");
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 80);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedImages);
  };

  const moveImage = (index, direction) => {
    const updatedImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < updatedImages.length) {
      // Swap elements
      const temp = updatedImages[index];
      updatedImages[index] = updatedImages[targetIndex];
      updatedImages[targetIndex] = temp;
      onChange(updatedImages);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-dark-textMuted">{label}</label>}
      
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-primary-500 bg-primary-500/5' 
            : 'border-dark-border bg-dark-bg/30 hover:border-primary-500/40 hover:bg-dark-bg/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <div className="text-sm font-medium text-white">Rasmlar qayta ishlanmoqda...</div>
            <div className="w-48 bg-dark-border h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary-500 h-full transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-white">Rasmlarni tortib tashlang yoki yuklash uchun bosing</p>
            <p className="text-xs text-dark-textMuted mt-1">PNG, JPG, WEBP formatlari qo'llab-quvvatlanadi</p>
          </div>
        )}
      </div>

      {/* Previews List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`relative group rounded-xl overflow-hidden border border-dark-border aspect-square bg-dark-bg transition-all duration-300 ${
                index === 0 ? 'ring-2 ring-primary-500/60 ring-offset-2 ring-offset-dark-bg' : ''
              }`}
            >
              <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              
              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-lg shadow-primary-500/20 z-10">
                  Muqova
                </div>
              )}

              {/* Hover actions panel */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                
                {/* Delete button (top right) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                    title="Rasmni o'chirish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Move buttons (bottom panel) */}
                <div className="flex items-center justify-between bg-dark-card/90 border border-dark-border p-1 rounded-lg backdrop-blur-sm">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); moveImage(index, 'left'); }}
                    className="p-1 text-dark-textMuted hover:text-white disabled:opacity-30 disabled:hover:text-dark-textMuted transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-dark-textMuted font-mono">#{index + 1}</span>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={(e) => { e.stopPropagation(); moveImage(index, 'right'); }}
                    className="p-1 text-dark-textMuted hover:text-white disabled:opacity-30 disabled:hover:text-dark-textMuted transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
