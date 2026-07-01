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
          "w-full sm:w-[200px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors outline-none",
          disabled 
            ? "bg-dark-bg/50 border-dark-border text-dark-textMuted cursor-not-allowed"
            : "bg-dark-bg border-dark-border text-dark-text hover:border-primary-500/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
          isOpen && "border-primary-500 ring-1 ring-primary-500"
        )}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-dark-textMuted transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors",
                    option.disabled
                      ? "text-dark-textMuted cursor-not-allowed bg-dark-bg/30"
                      : "text-dark-text hover:bg-primary-500/10 hover:text-primary-400",
                    value === option.value && "bg-primary-500/10 text-primary-500 font-semibold"
                  )}
                >
                  {option.label}
                  {value === option.value && <Check className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
