import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSave, FaTimes } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
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
    
    &:focus {
      outline: none;
      border-color: #4154f1;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .error {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
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
  transition: all 0.3s ease;

  &.primary {
    background-color: #0d6efd;
    color: white;
  }

  &.secondary {
    background-color: #6c757d;
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
    }
  }

  .file-name {
    margin-top: 5px;
    font-size: 12px;
    color: #6c757d;
  }
`;

const InputSuratMasukPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    tanggal_terima: '',
    pengirim: '',
    perihal: '',
    ditujukan_kepada: '',
    keterangan: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  const authUser = useSelector((state) => state.authUser);

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
    const requiredFields = ['nomor_surat', 'tanggal_surat', 'tanggal_terima', 'pengirim', 'perihal', 'ditujukan_kepada'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Field ini wajib diisi';
      }
    });

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

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await _fetchWithAuth(`${BASE_URL}/surat-masuk/`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat surat masuk');
      }

      navigate('/surat-masuk');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Card>
        <h2>Input Surat Masuk</h2>
        {error && <div className="error-message">{error}</div>}
        
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
            />
            {errors.nomor_surat && <div className="error">{errors.nomor_surat}</div>}
          </FormGroup>

          <FormGroup>
            <label htmlFor="tanggal_surat">Tanggal Surat</label>
            <input
              type="date"
              id="tanggal_surat"
              name="tanggal_surat"
              value={formData.tanggal_surat}
              onChange={handleChange}
            />
            {errors.tanggal_surat && <div className="error">{errors.tanggal_surat}</div>}
          </FormGroup>

          <FormGroup>
            <label htmlFor="tanggal_terima">Tanggal Terima</label>
            <input
              type="date"
              id="tanggal_terima"
              name="tanggal_terima"
              value={formData.tanggal_terima}
              onChange={handleChange}
            />
            {errors.tanggal_terima && <div className="error">{errors.tanggal_terima}</div>}
          </FormGroup>

          <FormGroup>
            <label htmlFor="pengirim">Pengirim</label>
            <input
              type="text"
              id="pengirim"
              name="pengirim"
              value={formData.pengirim}
              onChange={handleChange}
              placeholder="Masukkan pengirim surat"
            />
            {errors.pengirim && <div className="error">{errors.pengirim}</div>}
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
            />
            {errors.perihal && <div className="error">{errors.perihal}</div>}
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
            />
            {errors.ditujukan_kepada && <div className="error">{errors.ditujukan_kepada}</div>}
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
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" className="primary" disabled={loading}>
              <FaSave /> Simpan
            </Button>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate('/surat-masuk')}
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

export default InputSuratMasukPage; 