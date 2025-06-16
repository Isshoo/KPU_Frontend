import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeaderBar from './HeaderBar';
import SideBar from './SideBar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f6f9ff;
`;

const MainContent = styled.main`
  margin-left: 300px;
  padding: 20px;
  margin-top: 60px;
`;

const PageTitle = styled.div`
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #012970;
    margin: 0;
  }
  
  .breadcrumb {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 8px;
    margin-top: 8px;
    
    li {
      font-size: 14px;
      color: #899bbd;
      
      &:not(:last-child)::after {
        content: '/';
        margin-left: 8px;
      }
      
      a {
        color: #899bbd;
        text-decoration: none;
        
        &:hover {
          color: #012970;
        }
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  .btn {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    
    &.btn-warning {
      background-color: #ffc107;
      color: #000;
    }
    
    &.btn-secondary {
      background-color: #6c757d;
      color: #fff;
    }
  }
`;

const Layout = ({ children }) => {
  const location = useLocation();
  const { authUser } = useSelector((state) => state);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('surat-masuk')) return 'Surat Masuk';
    if (path.includes('surat-keluar')) return 'Surat Keluar';
    if (path.includes('daftar-anggota')) return 'Daftar Anggota';
    if (path.includes('kepala-sub-bagian')) return 'Kepala Sub Bagian';
    return 'Dashboard';
  };

  return (
    <LayoutContainer>
      <HeaderBar />
      <SideBar />
      <MainContent>
        <PageTitle>
          <h1>{getPageTitle()}</h1>
          <nav>
            <ol className="breadcrumb">
              <li><Link to="/">Menu</Link></li>
              <li>{getPageTitle()}</li>
            </ol>
            {authUser?.role === 'Staf' && location.pathname.includes('surat-keluar') && (
              <ActionButtons>
                <Link to="/input-surat-keluar" className="btn btn-warning">+ Surat Keluar</Link>
                <Link to="/template" className="btn btn-secondary">Template Surat Keluar</Link>
              </ActionButtons>
            )}
          </nav>
        </PageTitle>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 