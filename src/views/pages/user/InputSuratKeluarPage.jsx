import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSave, FaTimes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
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

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: #012970;
  }

  input, textarea, select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #4154f1;
      box-shadow: 0 0 0 2px rgba(65, 84, 241, 0.1);
    }

    &.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
  
  .error-icon {
    color: #dc3545;
    font-size: 16px;
    flex-shrink: 0;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
  
  .success-icon {
    color: #28a745;
    font-size: 16px;
    flex-shrink: 0;
  }
`;

const FieldError = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: fadeIn 0.3s ease-out;
  
  .error-dot {
    width: 4px;
    height: 4px;
    background-color: #dc3545;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background-color: #0d6efd;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #0b5ed7;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
    }
  }

  &.secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #5c636a;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const FileInput = styled.div`
  input[type="file"] {
    display: none;
  }

  .file-label {
    padding: 8px 16px;
    background-color: #e9ecef;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #dee2e6;
      border-color: #adb5bd;
    }
  }

  .file-name {
    margin-top: 5px;
    font-size: 12px;
    color: #6c757d;
    padding: 4px 8px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
  }
`;

const PageTitle = styled.h2`
  color: #012970;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
`;

const InputSuratKeluarPage = () => {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedSuratData, setSubmittedSuratData] = useState(null);
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    tanggal_kirim: '',
    ditujukan_kepada: '',
    perihal: '',
    keterangan: '',
    file: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['nomor_surat', 'tanggal_surat', 'tanggal_kirim', 'ditujukan_kepada', 'perihal'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Field ini wajib diisi';
      }
    });

    if (!formData.file) {
      newErrors.file = 'File surat wajib diupload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Validasi Gagal', 'Mohon periksa kembali data yang diisi');
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat surat keluar');
      }

      // Set success data and show modal
      setSubmittedSuratData({
        nomor_surat: formData.nomor_surat,
        perihal: formData.perihal,
        ditujukan_kepada: formData.ditujukan_kepada,
        tanggal_surat: formData.tanggal_surat
      });
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error creating surat:', err);
      showError('Gagal!', err.message || 'Terjadi kesalahan saat membuat surat keluar');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSubmittedSuratData(null);
    // Reset form
    setFormData({
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      ditujukan_kepada: '',
      perihal: '',
      keterangan: '',
      file: null
    });
  };

  const handleSuccessNavigate = () => {
    setShowSuccessModal(false);
    setSubmittedSuratData(null);
    navigate('/surat-keluar');
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
        suratData={submittedSuratData}
        title="Surat Keluar Berhasil Ditambahkan!"
        message="Data surat keluar telah berhasil disimpan ke dalam sistem"
        navigateText="Lihat Daftar Surat Keluar"
        autoNavigate={false}
        autoNavigateDelay={3000}
      />
      
      <Card>
        <PageTitle>Input Surat Keluar</PageTitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="nomor_surat">Nomor Surat</label>
            <input
              type="text"
              id="nomor_surat"
              name="nomor_surat"
              value={formData.nomor_surat}
              onChange={handleChange}
              placeholder="Masukkan nomor surat"
              className={errors.nomor_surat ? 'error' : ''}
            />
            {errors.nomor_surat && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.nomor_surat}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="tanggal_surat">Tanggal Surat</label>
            <input
              type="date"
              id="tanggal_surat"
              name="tanggal_surat"
              value={formData.tanggal_surat}
              onChange={handleChange}
              className={errors.tanggal_surat ? 'error' : ''}
            />
            {errors.tanggal_surat && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.tanggal_surat}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="tanggal_kirim">Tanggal Kirim</label>
            <input
              type="date"
              id="tanggal_kirim"
              name="tanggal_kirim"
              value={formData.tanggal_kirim}
              onChange={handleChange}
              className={errors.tanggal_kirim ? 'error' : ''}
            />
            {errors.tanggal_kirim && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.tanggal_kirim}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="ditujukan_kepada">Ditujukan Kepada</label>
            <input
              type="text"
              id="ditujukan_kepada"
              name="ditujukan_kepada"
              value={formData.ditujukan_kepada}
              onChange={handleChange}
              placeholder="Masukkan ditujukan kepada"
              className={errors.ditujukan_kepada ? 'error' : ''}
            />
            {errors.ditujukan_kepada && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.ditujukan_kepada}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="perihal">Perihal</label>
            <input
              type="text"
              id="perihal"
              name="perihal"
              value={formData.perihal}
              onChange={handleChange}
              placeholder="Masukkan perihal surat"
              className={errors.perihal ? 'error' : ''}
            />
            {errors.perihal && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.perihal}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="keterangan">Keterangan</label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Masukkan keterangan (opsional)"
            />
          </FormGroup>

          <FormGroup>
            <label>File Surat</label>
            <FileInput>
              <label className="file-label">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                Pilih File
              </label>
              {formData.file && (
                <div className="file-name">{formData.file.name}</div>
              )}
            </FileInput>
            {errors.file && (
              <FieldError>
                <div className="error-dot"></div>
                {errors.file}
              </FieldError>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" className="primary" disabled={loading}>
              <FaSave /> {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate('/surat-keluar')}
              disabled={loading}
            >
              <FaTimes /> Batal
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Layout>
  );
};

export default InputSuratKeluarPage; 