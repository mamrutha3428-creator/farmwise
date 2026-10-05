import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, currentLangConfig, supportedLanguages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const indianLangs = supportedLanguages.filter(
    (l) => l.region === 'Indian' && (l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const internationalLangs = supportedLanguages.filter(
    (l) => l.region === 'International' && (l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) || l.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-emerald-500 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-medium text-emerald-950">
          {compact ? currentLangConfig.nativeName : `${currentLangConfig.nativeName} (${currentLangConfig.name})`}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 pb-3">
            <input
              type="text"
              placeholder="Search language / భాషను వెతకండి..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white"
              autoFocus
            />
          </div>

          {indianLangs.length > 0 && (
            <div className="py-2">
              <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Indian Languages
              </div>
              <div className="grid grid-cols-1 gap-1">
                {indianLangs.map((lang) => {
                  const isSelected = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-left rtl:text-right rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-stone-900">{lang.nativeName}</span>
                        <span className="text-[10px] text-stone-500">{lang.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {internationalLangs.length > 0 && (
            <div className="py-2">
              <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                International Languages
              </div>
              <div className="grid grid-cols-1 gap-1">
                {internationalLangs.map((lang) => {
                  const isSelected = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-left rtl:text-right rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-stone-900">{lang.nativeName}</span>
                        <span className="text-[10px] text-stone-500">{lang.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
