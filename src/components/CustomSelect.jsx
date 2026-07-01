import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function CustomSelect({ options, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none shadow-sm",
          disabled 
            ? "bg-dark-bg/50 border-dark-border text-dark-textMuted cursor-not-allowed"
            : "bg-dark-bg border-dark-border text-dark-text hover:border-primary-500/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
          isOpen && "border-primary-500 ring-2 ring-primary-500/20 bg-dark-bg/80"
        )}
      >
        <span className="truncate">{selectedOption?.label || 'Tanlang...'}</span>
        <ChevronDown className={cn("w-4 h-4 text-dark-textMuted transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card/95 backdrop-blur-xl border border-dark-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top">
          <ul className="py-1.5 max-h-60 overflow-auto custom-scrollbar">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <li key={option.value} className="px-1.5 py-0.5">
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-200",
                      option.disabled
                        ? "text-dark-textMuted cursor-not-allowed bg-dark-bg/30"
                        : "text-dark-text hover:bg-primary-500/10 hover:text-primary-400",
                      isSelected && "bg-primary-500/15 text-primary-400 font-semibold shadow-sm"
                    )}
                  >
                    <span className="truncate pr-2">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
