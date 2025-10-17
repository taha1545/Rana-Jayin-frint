'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useState, useEffect } from 'react';

const deepMerge = (base, override) => {
  if (typeof base !== 'object' || base === null) return override;
  const result = { ...base };
  for (const key in (override || {})) {
    if (
      Object.prototype.hasOwnProperty.call(base, key) &&
      typeof base[key] === 'object' &&
      base[key] !== null &&
      typeof override[key] === 'object' &&
      override[key] !== null
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
};

export function useTranslation(namespace = 'common') {
  //
  const { locale } = useI18n();
  const [translations, setTranslations] = useState({});
  //
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const baseRes = await fetch(`/locales/en/${namespace}.json`);
        const baseData = baseRes.ok ? await baseRes.json() : {};
        let localeData = {};
        if (locale !== 'en') {
          const res = await fetch(`/locales/${locale}/${namespace}.json`);
          localeData = res.ok ? await res.json() : {};
        } else {
          localeData = {};
        }
        const merged = deepMerge(baseData, localeData);
        setTranslations(merged);
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

