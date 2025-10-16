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
    if (savedLocale && ['en', 'fr'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (!['en', 'fr'].includes(newLocale)) return;
    
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // 
    document.documentElement.setAttribute('dir', 'ltr');
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

