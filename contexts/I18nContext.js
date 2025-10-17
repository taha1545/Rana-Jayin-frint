'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    //
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && ['en', 'fr', 'ar'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const changeLocale = (newLocale) => {
    if (!['en', 'fr', 'ar'].includes(newLocale)) return;
    
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // 
    const dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', newLocale);
  };

  // 
  if (!mounted) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

