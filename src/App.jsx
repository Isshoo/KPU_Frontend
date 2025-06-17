import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';

// Base Pages
import LoginPage from './views/pages/base/LoginPage';
import RegisterPage from './views/pages/base/RegisterPage';
import NotFoundPage from './views/pages/base/NotFoundPage';

// User Pages
import DashboardPage from './views/pages/user/DashboardPage';
import SuratMasukPage from './views/pages/user/SuratMasukPage';
import SuratKeluarPage from './views/pages/user/SuratKeluarPage';
import DaftarAnggotaPage from './views/pages/user/DaftarAnggotaPage';
import KepalaSubBagianPage from './views/pages/user/KepalaSubBagianPage';
import ProfilPage from './views/pages/user/ProfilPage';
// import InputAnggotaPage from './views/pages/user/InputAnggotaPage';
import InputSuratMasukPage from './views/pages/user/InputSuratMasukPage';
import InputSuratKeluarPage from './views/pages/user/InputSuratKeluarPage';
import TemplateSuratPage from './views/pages/user/TemplateSuratPage';
import DetailSuratPage from './views/pages/user/DetailSuratPage';
import ValidasiSuratPage from './views/pages/user/ValidasiSuratPage';
import PageTitle from './views/components/Base/PageTitle';
import HeaderBar from './views/components/Base/HeaderBar';
import SideBar from './views/components/Base/SideBar';

import { LocaleProvider } from './contexts/LocaleContext';
import { ThemeProvider } from './contexts/ThemeContext';

import useLocale from './hooks/useLocale';
import useTheme from './hooks/useTheme';


function App() {
  const firstRun = useRef(true);
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);

  const dispatch = useDispatch();

  const [theme, themeContextValue] = useTheme();
  const [locale, localeContextValue] = useLocale();

  useEffect(() => {
    if (firstRun.current) {
      dispatch(asyncPreloadProcess());
      firstRun.current = false;
    }
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }
  if (!authUser) {
    return (
      <LocaleProvider value={localeContextValue}>
        <ThemeProvider value={themeContextValue}>
          <div
            data-theme={theme === 'dark' ? '' : 'light'}
            data-lang={locale === 'EN' ? '' : 'ID'}
          >
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </ThemeProvider>
      </LocaleProvider>
    );
  }
  return (
    <LocaleProvider value={localeContextValue}>
      <ThemeProvider value={themeContextValue}>
        <div
          className="layout-container"
          data-theme={theme === 'dark' ? '' : 'light'}
          data-lang={locale === 'EN' ? '' : 'ID'}
        >
          <HeaderBar />
          <SideBar />
          <main className="main-content">
            <PageTitle />
            <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/surat-masuk" element={<SuratMasukPage />} />
                <Route path="/surat-keluar" element={<SuratKeluarPage />} />
                <Route path="/daftar-anggota" element={<DaftarAnggotaPage />} />
                <Route path="/kepala-sub-bagian" element={<KepalaSubBagianPage />} />
                <Route path="/profile/:id" element={<ProfilPage />} />

                {/* Staf Routes */}
                {authUser.role === 'staf' && (
                  <>
                    <Route path="/input-surat-masuk" element={<InputSuratMasukPage />} />
                    <Route path="/input-surat-keluar" element={<InputSuratKeluarPage />} />
                    <Route path="/template" element={<TemplateSuratPage />} />
                  </>
                )}

                {/* Common Routes */}
                <Route path="/surat/:id" element={<DetailSuratPage />} />

                {/* Karo Routes */}
                {authUser.role === 'Karo' && (
                  <Route path="/validasi/:id" element={<ValidasiSuratPage />} />
                )}

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
