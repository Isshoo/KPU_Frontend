import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaTimes, FaArrowRight } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 450px;
  width: 90%;
  animation: ${slideIn} 0.4s ease-out;
  overflow: hidden;
  position: relative;
`;

const SuccessHeader = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 30px 24px 20px;
  text-align: center;
  position: relative;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 16px;
  animation: ${bounceIn} 0.6s ease-out 0.2s both;
  
  svg {
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const SuccessTitle = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const SuccessSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  color: white;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  margin-bottom: 24px;
`;

const MessageText = styled.p`
  color: #495057;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const SuratInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  border-left: 4px solid #28a745;
  text-align: left;
`;

const SuratNumber = styled.div`
  font-weight: 600;
  color: #28a745;
  font-size: 16px;
  margin-bottom: 8px;
`;

const SuratDetails = styled.div`
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &.primary {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.secondary {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;

    &:hover {
      background: #e9ecef;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  border-radius: 2px;
  transition: width 0.1s linear;
  animation: progress 3s linear;
  
  @keyframes progress {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }
`;

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  suratData, 
  title = "Berhasil!",
  message = "Data berhasil disimpan",
  navigateText = "Lihat Daftar",
  autoNavigate = false,
  autoNavigateDelay = 3000,
  showCredentials = false
}) => {
  useEffect(() => {
    if (isOpen && autoNavigate) {
      const timer = setTimeout(() => {
        onNavigate();
      }, autoNavigateDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoNavigate, autoNavigateDelay, onNavigate]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleNavigate = () => {
    onNavigate();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderItemInfo = () => {
    if (showCredentials && suratData) {
      return (
        <SuratInfo>
          <SuratNumber>
            {suratData.nama_lengkap || 'Nama Anggota'}
          </SuratNumber>
          <SuratDetails>
            <div><strong>Username:</strong> {suratData.username || '-'}</div>
            <div><strong>Password:</strong> {suratData.password || '-'}</div>
            <div><strong>Role:</strong> {suratData.role || '-'}</div>
            {suratData.divisi && <div><strong>Divisi:</strong> {suratData.divisi || '-'}</div>}
          </SuratDetails>
        </SuratInfo>
      );
    }

    if (suratData) {
      return (
        <SuratInfo>
          <SuratNumber>
            {suratData.nomor_surat || 'Nomor Surat'}
          </SuratNumber>
          <SuratDetails>
            <div><strong>Perihal:</strong> {suratData.perihal || '-'}</div>
            {suratData.pengirim ? (
              <div><strong>Pengirim:</strong> {suratData.pengirim || '-'}</div>
            ) : (
              <div><strong>Ditujukan Kepada:</strong> {suratData.ditujukan_kepada || '-'}</div>
            )}
            <div><strong>Tanggal Surat:</strong> {suratData.tanggal_surat ? new Date(suratData.tanggal_surat).toLocaleDateString('id-ID') : '-'}</div>
          </SuratDetails>
        </SuratInfo>
      );
    }

    return null;
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <SuccessHeader>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
          <SuccessIcon>
            <FaCheckCircle />
          </SuccessIcon>
          <SuccessTitle>{title}</SuccessTitle>
          <SuccessSubtitle>{message}</SuccessSubtitle>
        </SuccessHeader>

        <ModalBody>
          <SuccessMessage>
            <MessageText>
              {showCredentials 
                ? 'Anggota telah berhasil ditambahkan ke dalam sistem.'
                : 'Surat telah berhasil ditambahkan ke dalam sistem.'
              }
            </MessageText>

            {renderItemInfo()}

            {autoNavigate && (
              <MessageText style={{ fontSize: '14px', color: '#6c757d' }}>
                Anda akan dialihkan ke halaman daftar dalam beberapa detik...
              </MessageText>
            )}
          </SuccessMessage>

          <ButtonContainer>
            <Button 
              className="secondary" 
              onClick={handleClose}
            >
              <FaTimes />
              Tutup
            </Button>
            <Button 
              className="primary" 
              onClick={handleNavigate}
            >
              <FaArrowRight />
              {navigateText}
            </Button>
          </ButtonContainer>

          {autoNavigate && (
            <ProgressBar>
              <ProgressFill />
            </ProgressBar>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SuccessModal; 