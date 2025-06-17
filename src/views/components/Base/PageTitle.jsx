import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageTitle = () => {
  const location = useLocation();
  const authUser = useSelector((state) => state.authUser);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/surat-masuk') return 'Surat Masuk';
    if (path === '/surat-keluar') return 'Surat Keluar';
    if (path === '/daftar-anggota') return 'Daftar Anggota';
    if (path === '/kepala-sub-bagian') return 'Kepala Sub Bagian';
    if (path === '/template') return 'Template Surat';
    if (path === '/input-surat-masuk') return 'Input Surat Masuk';
    if (path === '/input-surat-keluar') return 'Input Surat Keluar';
    if (path === '/anggota/input') return 'Input Anggota';
    return 'Dashboard';
  };

  return (
    <div className="page-title">
      <h1>{getPageTitle()}</h1>
      <nav>
        <ol className="breadcrumb">
          <li><Link to="/dashboard">Menu</Link></li>
          <li>{getPageTitle()}</li>
        </ol>
        {authUser?.role === 'staf' && location.pathname === '/surat-keluar' && (
          <div className="action-buttons">
            <Link to="/input-surat-keluar" className="btn btn-warning">+ Surat Keluar</Link>
            <Link to="/template" className="btn btn-secondary">Template Surat Keluar</Link>
          </div>
        )}
        {authUser?.role === 'staf' && location.pathname === '/input-surat-keluar' && (
          <div className="action-buttons">
            <Link to="/surat-keluar" className="btn btn-warning">Kembali</Link>
          </div>
        )}
        {authUser?.role === 'staf' && location.pathname === '/template' && (
          <div className="action-buttons">
            <Link to="/surat-keluar" className="btn btn-secondary">Kembali</Link>
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

        {authUser?.role === 'sekertaris' && location.pathname === '/daftar-anggota' && (
          <div className="action-buttons">
            <Link to="/anggota/input" className="btn btn-warning">+ Anggota</Link>
          </div>
        )}
        {authUser?.role === 'sekertaris' && location.pathname === '/anggota/input' && (
          <div className="action-buttons">
            <Link to="/daftar-anggota" className="btn btn-warning">Kembali</Link>
          </div>
        )}

      </nav>
    </div>
  );
};

export default PageTitle; 