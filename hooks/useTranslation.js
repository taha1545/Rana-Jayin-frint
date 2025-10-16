'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useState, useEffect } from 'react';

export function useTranslation(namespace = 'common') {
  //
  const { locale } = useI18n();
  const [translations, setTranslations] = useState({});
  //
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}/${namespace}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else {
          //
          const fallbackResponse = await fetch(`/locales/en/${namespace}.json`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
          }
        }
      } catch (error) {
        console.error('Error loading translations:', error);
        // 
        try {
          const fallbackResponse = await fetch(`/locales/en/${namespace}.json`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
          }
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError);
        }
      }
    };

    loadTranslations();
  }, [locale, namespace]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        //
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }
    // 
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  };

  return { t, locale };
}

