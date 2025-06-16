import { useState, useEffect, useCallback, useMemo } from 'react';

const useLocale = (initialLocale = 'ID') => {
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || initialLocale);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prevLocale) => (prevLocale === 'EN' ? 'ID' : 'EN'));
  }, []);

  const localeContextValue = useMemo(() => {
    return {
      locale,
      toggleLocale,
    };
  }, [locale, toggleLocale]);

  return [locale, localeContextValue];
};

export default useLocale;
