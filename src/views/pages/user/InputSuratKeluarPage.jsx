import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h5 {
    margin: 0;
    font-size: 18px;
    color: #012970;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
  
  &.primary {
    background: #4154f1;
    color: white;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    color: #899bbd;
    margin-bottom: 5px;
  }
  
  input, select, textarea {
    width: 100%;
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
    min-height: 150px;
    resize: vertical;
  }
  
  .error {
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
  }
`;

const FileUpload = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  h6 {
    margin: 0 0 10px;
    font-size: 16px;
    color: #012970;
  }
  
  .upload-area {
    border: 2px dashed #ddd;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    
    &:hover {
      border-color: #4154f1;
    }
    
    p {
      margin: 0;
      color: #899bbd;
    }
  }
`;

const InputSuratKeluarPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);
  const [formData, setFormData] = useState({
    tertuju: '',
    perihal: '',
    nomor: '',
    tanggal: '',
    isi: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tertuju) newErrors.tertuju = 'Tertuju harus diisi';
    if (!formData.perihal) newErrors.perihal = 'Perihal harus diisi';
    if (!formData.nomor) newErrors.nomor = 'Nomor surat harus diisi';
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal harus diisi';
    if (!formData.isi) newErrors.isi = 'Isi surat harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Submit form data to API
      console.log('Form data:', formData);
      navigate('/surat-keluar');
    }
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Input Surat Keluar</h5>
          <ActionButtons>
            <Button className="secondary" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Kembali
            </Button>
          </ActionButtons>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <div>
            <FormGroup>
              <label htmlFor="tertuju">Tertuju</label>
              <input
                type="text"
                id="tertuju"
                name="tertuju"
                value={formData.tertuju}
                onChange={handleChange}
                placeholder="Masukkan nama penerima surat"
              />
              {errors.tertuju && <div className="error">{errors.tertuju}</div>}
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
              <label htmlFor="nomor">Nomor Surat</label>
              <input
                type="text"
                id="nomor"
                name="nomor"
                value={formData.nomor}
                onChange={handleChange}
                placeholder="Masukkan nomor surat"
              />
              {errors.nomor && <div className="error">{errors.nomor}</div>}
            </FormGroup>
          </div>
          
          <div>
            <FormGroup>
              <label htmlFor="tanggal">Tanggal</label>
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
              />
              {errors.tanggal && <div className="error">{errors.tanggal}</div>}
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="isi">Isi Surat</label>
              <textarea
                id="isi"
                name="isi"
                value={formData.isi}
                onChange={handleChange}
                placeholder="Masukkan isi surat"
              />
              {errors.isi && <div className="error">{errors.isi}</div>}
            </FormGroup>
          </div>
        </Form>
        
        <FileUpload>
          <h6>Upload File Surat</h6>
          <div className="upload-area" onClick={() => document.getElementById('file').click()}>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
            />
            <p>
              {formData.file ? formData.file.name : 'Klik untuk memilih file (PDF/DOC)'}
            </p>
          </div>
        </FileUpload>
        
        <ActionButtons style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            className="primary"
            onClick={handleSubmit}
          >
            <FaSave /> Simpan
          </Button>
        </ActionButtons>
      </Card>
    </Layout>
  );
};

export default InputSuratKeluarPage; 