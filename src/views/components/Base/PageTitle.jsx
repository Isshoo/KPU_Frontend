import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageTitle = () => {
  const location = useLocation();
  const authUser = useSelector((state) => state.authUser);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('surat-masuk')) return 'Surat Masuk';
    if (path.includes('surat-keluar')) return 'Surat Keluar';
    if (path.includes('daftar-anggota')) return 'Daftar Anggota';
    if (path.includes('kepala-sub-bagian')) return 'Kepala Sub Bagian';
    return 'Dashboard';
  };

  return (
    <div className="page-title">
      <h1>{getPageTitle()}</h1>
      <nav>
        <ol className="breadcrumb">
          <li><Link to="/">Menu</Link></li>
          <li>{getPageTitle()}</li>
        </ol>
        {authUser?.role === 'staf' && location.pathname.includes('surat-keluar') && (
          <div className="action-buttons">
            <Link to="/input-surat-keluar" className="btn btn-warning">+ Surat Keluar</Link>
            <Link to="/template" className="btn btn-secondary">Template Surat Keluar</Link>
          </div>
        )}
        {authUser?.role === 'staf' && location.pathname === '/surat-masuk' && (
          <div className="action-buttons">
            <Link to="/input-surat-masuk" className="btn btn-warning">+ Surat Masuk</Link>
          </div>
        )}
        {authUser?.role === 'staf' && location.pathname === '/input-surat-masuk' && (
          <div className="action-buttons">
            <Link to="/surat-masuk" className="btn btn-warning">Kembali</Link>
          </div>
        )}

        {authUser?.role === 'sekertaris' && location.pathname.includes('daftar-anggota') && (
          <div className="action-buttons">
            <Link to="/input-anggota" className="btn btn-warning">+ Anggota</Link>
          </div>
        )}

      </nav>
    </div>
  );
};

export default PageTitle; 