import React, { useEffect } from 'react';
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
import InputSuratKeluarPage from './views/pages/user/InputSuratKeluarPage';
import TemplateSuratPage from './views/pages/user/TemplateSuratPage';
import DetailSuratPage from './views/pages/user/DetailSuratPage';
import ValidasiSuratPage from './views/pages/user/ValidasiSuratPage';

const App = () => {
  const { authUser = null, isPreload = false } = useSelector((states) => states);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }

  if (authUser === null) {
    return (
        <Routes>
          <Route path="/*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes> 
    );
  }

  return (
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
        {authUser.role === 'Staf' && (
          <>
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
  );
};

export default App;
