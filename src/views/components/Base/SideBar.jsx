import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaEnvelope, FaEnvelopeOpen, FaUsers, FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  width: 250px;
  height: calc(100vh - 60px);
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 999;
  overflow-y: auto;

  .divisi-name {
    text-align: center;
    border-bottom: 1px solid #012970;
    padding-bottom: 10px;
  }

  .divisi-name span {
    font-size: 16px;
    font-weight: 600;
    color: #012970;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 20px 20px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

`;

const NavItem = styled.li`
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    color: #012970;
    text-decoration: none;
    transition: all 0.3s;
    
    &:hover {
      background: #f6f9ff;
    }
    
    &.active {
      background: #f6f9ff;
      border-left: 4px solid #4154f1;
    }
    
    i {
      font-size: 20px;
    }
    
    span {
      font-size: 18px;
    }
  }
`;

const SideBar = () => {
  const location = useLocation();
  const authUser = useSelector(state => state.authUser);
  const getDivisiName = (divisi) => {
    switch (divisi) {
      case 'teknis_dan_hukum':
        return 'Teknis dan Hukum';
      case 'data_dan_informasi':
        return 'Data dan Informasi';
      case 'logistik_dan_keuangan':
        return 'Logistik dan Keuangan';
      case 'sdm_dan_parmas':
        return 'SDM dan Parmas';
      default:
        return divisi;
    }
  }
  
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  return (
    <SidebarContainer>
      <NavList>
      {authUser.role !== 'sekertaris' && (
        <p className="divisi-name">
          <span>{getDivisiName(authUser.divisi)}</span>
        </p>
      )}
        <NavItem>
          <Link to="/dashboard" className={isActive('dashboard') ? 'active' : ''}>
            <FaHome />
            <span>Dashboard</span>
          </Link>
        </NavItem>
        
        <NavItem>
          <Link to="/surat-masuk" className={isActive('surat-masuk') ? 'active' : ''}>
            <FaEnvelope />
            <span>Surat Masuk</span>
          </Link>
        </NavItem>
        
        <NavItem>
          <Link to="/surat-keluar" className={isActive('surat-keluar') ? 'active' : ''}>
            <FaEnvelopeOpen />
            <span>Surat Keluar</span>
          </Link>
        </NavItem>
        
        <NavItem>
          <Link to="/daftar-anggota" className={isActive('daftar-anggota') ? 'active' : ''}>
            <FaUsers />
            <span>Daftar Anggota</span>
          </Link>
        </NavItem>
        
        {/* <NavItem>
          <Link to="/kepala-sub-bagian" className={isActive('kepala-sub-bagian') ? 'active' : ''}>
            <FaUserCircle />
            <span>Kepala Sub Bagian</span>
          </Link>
        </NavItem> */}
      </NavList>
    </SidebarContainer>
  );
};

export default SideBar;
