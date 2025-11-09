'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' }
];

export default function LanguageToggle() {
  const { locale, changeLocale } = useI18n();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors duration-200"
        aria-label={`Current language: ${currentLanguage.name}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-lg mr-1 rtl:mr-0 rtl:ml-1">{currentLanguage.flag}</span>
        <Globe className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLocale(language.code);
                  setOpen(false); 
                }}
                className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${locale === language.code
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                <span className="text-lg mr-3 rtl:mr-0 rtl:ml-3">{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <span className="ml-auto rtl:ml-0 rtl:mr-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
