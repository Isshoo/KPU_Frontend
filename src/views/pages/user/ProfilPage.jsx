import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaBuilding, FaSave } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h5 {
    margin: 0 0 10px;
    font-size: 24px;
    color: #012970;
  }
  
  p {
    margin: 0;
    color: #899bbd;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #4154f1;
  border: 4px solid #4154f1;
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
  
  input, select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4154f1;
    }
    
    &:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }
  }
  
  .error {
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
  }
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
  background: #4154f1;
  color: white;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const ProfilPage = () => {
  const { authUser } = useSelector((state) => state);
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    email: '',
    telepon: '',
    jabatan: '',
    subBagian: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // TODO: Fetch user data from API
    setFormData({
      nama: authUser?.nama || 'John Doe',
      nip: authUser?.nip || '198501012010011001',
      email: authUser?.email || 'john.doe@kpu.go.id',
      telepon: authUser?.telepon || '081234567890',
      jabatan: authUser?.jabatan || 'Staf',
      subBagian: authUser?.subBagian || 'Sub Bagian Umum'
    });
  }, [authUser]);
  
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
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama) newErrors.nama = 'Nama harus diisi';
    if (!formData.email) newErrors.email = 'Email harus diisi';
    if (!formData.telepon) newErrors.telepon = 'Telepon harus diisi';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Update profile via API
      console.log('Form data:', formData);
      setIsEditing(false);
    }
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <Avatar>
            <FaUser />
          </Avatar>
          <h5>{formData.nama}</h5>
          <p>{formData.jabatan} - {formData.subBagian}</p>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <div>
            <FormGroup>
              <label htmlFor="nama">Nama Lengkap</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.nama && <div className="error">{errors.nama}</div>}
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="nip">NIP</label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </FormGroup>
          </div>
          
          <div>
            <FormGroup>
              <label htmlFor="telepon">Telepon</label>
              <input
                type="tel"
                id="telepon"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.telepon && <div className="error">{errors.telepon}</div>}
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="jabatan">Jabatan</label>
              <input
                type="text"
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="subBagian">Sub Bagian</label>
              <input
                type="text"
                id="subBagian"
                name="subBagian"
                value={formData.subBagian}
                disabled
              />
            </FormGroup>
          </div>
        </Form>
        
        <ActionButtons>
          {isEditing ? (
            <>
              <Button type="submit">
                <FaSave /> Simpan
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original values
                  setFormData({
                    nama: authUser?.nama || 'John Doe',
                    nip: authUser?.nip || '198501012010011001',
                    email: authUser?.email || 'john.doe@kpu.go.id',
                    telepon: authUser?.telepon || '081234567890',
                    jabatan: authUser?.jabatan || 'Staf',
                    subBagian: authUser?.subBagian || 'Sub Bagian Umum'
                  });
                }}
              >
                Batal
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profil
            </Button>
          )}
        </ActionButtons>
      </Card>
    </Layout>
  );
};

export default ProfilPage; 