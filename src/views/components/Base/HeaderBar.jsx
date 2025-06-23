import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FaBell, FaSearch, FaSignOutAlt, FaUser, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { asyncUnsetAuthUser } from '../../../states/authUser/action';
import { asyncReceiveNotifications, asyncMarkAsRead } from '../../../states/notifications/thunk';
import { showFormattedDate } from '../../../utils/datetime_formatter';
import { BASE_URL } from '../../../globals/config';
import { _fetchWithAuth } from '../../../utils/auth_helper';

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
  gap: 25px;
  margin-left: auto;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #012970;

  svg {
    font-size: 20px;
    transition: color 0.3s ease;
  }
  
  .badge {
    position: absolute;
    top: -8px;
    right: -10px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    transform: scale(1);
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #4154f1;
    .badge {
      transform: scale(1.1);
    }
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1010;

  .dropdown-header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    
    h6 {
      margin: 0;
      font-size: 16px;
      color: #012970;
    }
  }
  
  .notification-item {
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    color: #012970;
    text-decoration: none;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f6f9ff;
    }

    .icon {
      font-size: 24px;
      color: #4154f1;
      margin-top: 4px;
    }

    .content {
      flex: 1;
      h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 600;
      }
      p {
        margin: 0 0 4px 0;
        font-size: 13px;
        color: #555;
        line-height: 1.4;
      }
      span {
        font-size: 11px;
        color: #899bbd;
      }
    }
  }
  
  .empty-state {
    padding: 20px;
    text-align: center;
    color: #899bbd;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;

  svg {
    font-size: 16px;
  }
  
  span {
    font-size: 18px;
    color: #012970;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 200px;
  
  .dropdown-header {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    
    h6 {
      margin: 0;
      font-size: 16px;
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
    cursor: pointer;

    svg {
      font-size: 14px;
    }
    
    span {
      font-size: 14px;
    }
    
    &:hover {
      background: #f6f9ff;
    }
  }
`;

const HeaderBar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const authUser = useSelector((state) => state.authUser);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch notifications periodically
  useEffect(() => {
    if (authUser) {
      dispatch(asyncReceiveNotifications()); // Fetch immediately on login

      // const interval = setInterval(() => {
      //   dispatch(asyncReceiveNotifications());
      // }, 30000); // Poll every 30 seconds

      // return () => clearInterval(interval);
    }
  }, [authUser, dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    };

    if (showProfileMenu || showNotificationMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showNotificationMenu]);

  const handleNotificationClick = async (notification) => {
    dispatch(asyncMarkAsRead(notification));
    setShowNotificationMenu(false);
    await dispatch(asyncReceiveNotifications());

    const endpoint = notification.type === 'surat_masuk'
      ? `${BASE_URL}/surat-masuk/${notification.surat_id}/file`
      : `${BASE_URL}/surat-keluar/${notification.surat_id}/file`;
    try {
      const response = await _fetchWithAuth(endpoint);
      if (!response.ok) {
        throw new Error('Gagal membuka file surat');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      alert('Gagal membuka file surat.');
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'sekertaris':
        return 'Sekertaris';
      case 'staf':
        return 'Staf';
      case 'kasub':
        return 'Kepala Sub Bagian';
      default:
        return role;
    }
  };

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
  };
  
  return (
    <HeaderContainer>
      <LogoSection>
        <img src="/logo_kpu.png" alt="KPU Logo" className="logo" />
        <span>KPU Kota Manado</span>
      </LogoSection>
      
      <NavSection>
        <NotificationIcon 
          ref={notificationRef}
          onClick={() => setShowNotificationMenu(!showNotificationMenu)}
        >
          <FaBell />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

          {showNotificationMenu && (
            <NotificationDropdown>
              <div className="dropdown-header">
                <h6>Anda memiliki {unreadCount} notifikasi baru</h6>
              </div>
              {notifications && notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className="notification-item" 
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="icon">
                      {notif.type === 'surat_masuk' ? <FaEnvelope /> : <FaPaperPlane />}
                    </div>
                    <div className="content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span>{showFormattedDate(notif.date)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Tidak ada notifikasi</div>
              )}
            </NotificationDropdown>
          )}
        </NotificationIcon>
        
        <ProfileSection 
          ref={profileRef}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <FaUser />
          <span>{authUser?.nama_lengkap}</span>
          
          {showProfileMenu && (
          <DropdownMenu>
            <div className="dropdown-header">
              <h6>{authUser?.username}</h6>
              <span>{getRoleName(authUser?.role)}</span> - <span>{getDivisiName(authUser?.divisi)}</span>
            </div>
            <Link to={`/profile/${authUser?.id}`} className="dropdown-item">
              <FaUser />
              <span>Profil</span>
            </Link>
            <Link to="/" className="dropdown-item" onClick={onSignOut}>
              <FaSignOutAlt />
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
