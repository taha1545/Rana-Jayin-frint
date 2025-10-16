'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export default function LanguageToggle() {
  const { locale, changeLocale } = useI18n();
  const { t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative group">
      <button
        className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors duration-200"
        aria-label={`Current language: ${currentLanguage.name}`}
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span className="text-lg mr-1">{currentLanguage.flag}</span>
        <Globe className="w-4 h-4" />
        <span className="sr-only">Change language</span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLocale(language.code)}
              className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                locale === language.code 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg mr-3">{language.flag}</span>
              <span>{language.name}</span>
              {locale === language.code && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

