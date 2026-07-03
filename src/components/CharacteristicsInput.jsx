import { Plus, Trash2 } from 'lucide-react';

const SUGGESTED_SPECS = [
  'Brend', 'Rangi', 'Material', 'O\'lchami', 'Vazni', 'Kafolat', 'Mexanizm', 'Suvga chidamlilik', 'Shisha turi'
];

export default function CharacteristicsInput({ value = [], onChange, label }) {
  const handleAddRow = (specName = '') => {
    onChange([...value, { name: specName, value: '' }]);
  };

  const handleUpdateRow = (index, field, val) => {
    const updated = value.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    onChange(value.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {label && <label className="block text-sm font-medium text-dark-textMuted">{label}</label>}
        
        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-dark-textMuted mr-1">Shablonlar:</span>
          {SUGGESTED_SPECS.map(spec => (
            <button
              key={spec}
              type="button"
              onClick={() => handleAddRow(spec)}
              className="px-2.5 py-1 bg-dark-card border border-dark-border text-dark-textMuted hover:text-white hover:border-primary-500/50 rounded-lg text-xs font-medium transition-colors"
            >
              + {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-dark-border bg-dark-bg/25 rounded-2xl p-4 space-y-3">
        {value.map((spec, index) => (
          <div key={index} className="flex gap-3 items-center animate-in slide-in-from-top-2 duration-200">
            {/* Spec Name */}
            <div className="flex-1">
              <input
                type="text"
                required
                placeholder="Xususiyat nomi (masalan: Rang)"
                className="input text-sm"
                value={spec.name}
                onChange={(e) => handleUpdateRow(index, 'name', e.target.value)}
              />
            </div>
            
            {/* Spec Value */}
            <div className="flex-1">
              <input
                type="text"
                required
                placeholder="Xususiyat qiymati (masalan: Qora)"
                className="input text-sm"
                value={spec.value}
                onChange={(e) => handleUpdateRow(index, 'value', e.target.value)}
              />
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleRemoveRow(index)}
              className="p-3 text-dark-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
              title="O'chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-6 text-dark-textMuted text-sm border border-dashed border-dark-border/40 rounded-xl">
            Hech qanday xususiyat qo'shilmagan. Yuqoridagi shablonlardan tanlang yoki yangi qator yarating.
          </div>
        )}

        <button
          type="button"
          onClick={() => handleAddRow('')}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-dark-card border border-dark-border hover:border-primary-500/50 hover:bg-dark-border text-xs text-white font-medium rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Yangi xususiyat qo'shish
        </button>
      </div>
    </div>
  );
}
