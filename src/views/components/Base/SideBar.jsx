import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaEnvelope, FaEnvelopeOpen, FaUsers, FaUserCircle } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  width: 275px;
  height: calc(100vh - 60px);
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 999;
  overflow-y: auto;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 20px 0 0 0;
  margin: 0;
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
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
`;

const SideBar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  return (
    <SidebarContainer>
      <NavList>
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
        
        <NavItem>
          <Link to="/kepala-sub-bagian" className={isActive('kepala-sub-bagian') ? 'active' : ''}>
            <FaUserCircle />
            <span>Kepala Sub Bagian</span>
          </Link>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default SideBar;
