import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaTimes, FaTrash } from 'react-icons/fa';

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
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 450px;
  width: 90%;
  animation: ${slideIn} 0.3s ease-out;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #dc3545 0%, #bb2d3b 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const WarningIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const ModalSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
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
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ConfirmationText = styled.div`
  margin-bottom: 24px;
`;

const SuratInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border-left: 4px solid #dc3545;
`;

const SuratNumber = styled.div`
  font-weight: 600;
  color: #dc3545;
  font-size: 16px;
  margin-bottom: 8px;
`;

const SuratDetails = styled.div`
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
`;

const WarningMessage = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #856404;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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
  min-width: 100px;
  justify-content: center;

  &.cancel {
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

  &.delete {
    background: linear-gradient(135deg, #dc3545 0%, #bb2d3b 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #bb2d3b 0%, #a52834 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
`;

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  suratData, 
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <WarningIcon>
            <FaExclamationTriangle />
          </WarningIcon>
          <HeaderContent>
            <ModalTitle>Konfirmasi Penghapusan</ModalTitle>
            <ModalSubtitle>Hapus surat masuk dari sistem</ModalSubtitle>
          </HeaderContent>
          <CloseButton onClick={handleClose} disabled={isLoading}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ConfirmationText>
            <p style={{ margin: '0 0 16px 0', color: '#495057', lineHeight: '1.6' }}>
              Anda akan menghapus surat masuk berikut:
            </p>

            <SuratInfo>
              <SuratNumber>
                {suratData?.nomor_surat || 'Nomor Surat'}
              </SuratNumber>
              <SuratDetails>
                <div><strong>Perihal:</strong> {suratData?.perihal || '-'}</div>
                <div><strong>Pengirim:</strong> {suratData?.pengirim || '-'}</div>
                <div><strong>Tanggal Surat:</strong> {suratData?.tanggal_surat ? new Date(suratData.tanggal_surat).toLocaleDateString('id-ID') : '-'}</div>
              </SuratDetails>
            </SuratInfo>

            <WarningMessage>
              <FaExclamationTriangle style={{ color: '#f39c12' }} />
              <span>
                <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. 
                Surat dan file terkait akan dihapus secara permanen dari sistem.
              </span>
            </WarningMessage>
          </ConfirmationText>

          <ButtonContainer>
            <Button 
              className="cancel" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              className="delete" 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              <FaTrash />
              {isLoading ? 'Menghapus...' : 'Hapus Surat'}
            </Button>
          </ButtonContainer>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteConfirmationModal; 