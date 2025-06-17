import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .logo {
    height: 40px;
    width: auto;
  }
  
  span {
    font-size: 24px;
    font-weight: 600;
    color: #012970;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
  
  form {
    display: flex;
    align-items: center;
    background: #f6f9ff;
    border-radius: 4px;
    padding: 5px 10px;
    
    input {
      flex: 1;
      border: none;
      background: none;
      padding: 5px;
      outline: none;
      
      &::placeholder {
        color: #899bbd;
      }
    }
    
    button {
      background: none;
      border: none;
      color: #899bbd;
      cursor: pointer;
      padding: 5px;
      
      &:hover {
        color: #012970;
      }
    }
  }
`;

const NavSection = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #28a745;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  svg {
    font-size: 18px;
  }
  
  span {
    font-size: 18px;
    color: #012970;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 200px;
  
  .dropdown-header {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    
    h6 {
      margin: 0;
      font-size: 14px;
      color: #012970;
    }
    
    span {
      font-size: 12px;
      color: #899bbd;
    }
  }
  
  .dropdown-item {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #012970;
    text-decoration: none;
    
    &:hover {
      background: #f6f9ff;
    }
  }
`;

const HeaderBar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { authUser } = useSelector((state) => state);
  
  return (
    <HeaderContainer>
      <LogoSection>
        <img src="/logo_kpu.png" alt="KPU Logo" className="logo" />
        <span>KPU Kota Manado</span>
      </LogoSection>
      
      {/* <SearchBar>
        <form>
          <input type="text" placeholder="Search" />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </SearchBar> */}
      
      <NavSection>
        <NotificationIcon>
          <FaBell />
          <span className="badge">3</span>
        </NotificationIcon>
        
        <ProfileSection onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <FaUser />
          <span>{authUser?.username}</span>
          
          {showProfileMenu && (
          <DropdownMenu>
            <div className="dropdown-header">
              <h6>{authUser?.username}</h6>
              <span>{authUser?.role}</span>
            </div>
            <Link to={`/profile/${authUser?.id}`} className="dropdown-item">
              <FaUser />
              <span>Profil</span>
            </Link>
            <Link to="/logout" className="dropdown-item">
              <FaUser />
              <span>Keluar</span>
            </Link>
          </DropdownMenu>
          )}
        </ProfileSection>
      </NavSection>
    </HeaderContainer>
  );
};

export default HeaderBar;
