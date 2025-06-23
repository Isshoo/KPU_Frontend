import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
import Toast from '../../components/Base/Toast';
import SuccessModal from '../../components/Base/SuccessModal';
import useToast from '../../../hooks/useToast';
import { BASE_URL } from '../../../globals/config';
import { _fetchWithAuth } from '../../../utils/auth_helper';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4154f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4154f1;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4154f1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #4154f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #3a47d8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(65, 84, 241, 0.3);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
`;

const InputAnggotaPage = () => {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    role: '',
    divisi: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedUserData, setSubmittedUserData] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama_lengkap) {
      newErrors.nama_lengkap = 'Nama lengkap harus diisi';
    }
    if (!formData.role) {
      newErrors.role = 'Role harus dipilih';
    }
    if (formData.role !== 'sekertaris' && !formData.divisi) {
      newErrors.divisi = 'Divisi harus dipilih';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await _fetchWithAuth(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await response.json();
      
      // Set success data and show modal
      setSubmittedUserData({
        nama_lengkap: formData.nama_lengkap,
        username: data.user.username,
        password: data.user.username,
        role: formData.role,
        divisi: formData.divisi
      });
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error creating user:', err);
      showError('Gagal!', err.message || 'Terjadi kesalahan saat membuat user');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSubmittedUserData(null);
    // Reset form
    setFormData({
      nama_lengkap: '',
      role: '',
      divisi: null
    });
    setErrors({});
  };

  const handleSuccessNavigate = () => {
    setShowSuccessModal(false);
    setSubmittedUserData(null);
    navigate('/daftar-anggota');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  return (
    <Layout>
      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onNavigate={handleSuccessNavigate}
        suratData={submittedUserData}
        title="Anggota Berhasil Dibuat!"
        message={`Anggota ${submittedUserData?.nama_lengkap} telah berhasil dibuat dan ditambahkan ke dalam sistem`}
        navigateText="Lihat Daftar Anggota"
        autoNavigate={false}
        autoNavigateDelay={3000}
        showCredentials={true}
      />
      
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <Input
              type="text"
              id="nama_lengkap"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
            />
            {errors.nama_lengkap && <ErrorMessage>{errors.nama_lengkap}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Pilih Role</option>
              <option value="sekertaris">Sekertaris</option>
              <option value="kasub">Kepala Sub Bagian</option>
              <option value="staf">Staf</option>
            </Select>
            {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
          </FormGroup>

          {formData.role !== 'sekertaris' && (
          <FormGroup>
            <Label htmlFor="divisi">Divisi</Label>
            <Select
              id="divisi"
              name="divisi"
              value={formData.divisi}
              onChange={handleChange}
            >
              <option value="">Pilih Divisi</option>
              <option value="teknis_dan_hukum">Teknis dan Hukum</option>
              <option value="data_dan_informasi">Data dan Informasi</option>
              <option value="logistik_dan_keuangan">Logistik dan Keuangan</option>
              <option value="sdm_dan_parmas">SDM dan Parmas</option>
            </Select>
            {errors.divisi && <ErrorMessage>{errors.divisi}</ErrorMessage>}
          </FormGroup>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </SubmitButton>
            <CancelButton type="button" onClick={() => navigate('/daftar-anggota')}>
              Batal
            </CancelButton>
          </ButtonGroup>
        </Form>
      </Card>
    </Layout>
  );
};

export default InputAnggotaPage; 