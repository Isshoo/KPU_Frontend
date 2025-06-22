import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaBuilding, FaSave, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
import { changePassword } from '../../../api/auth';

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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #012970;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #899bbd;
  margin-left: auto;
  
  &:hover {
    color: #dc3545;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  
  input {
    padding-right: 40px;
  }
  
  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #899bbd;
    
    &:hover {
      color: #4154f1;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  
  .btn-secondary {
    background: #6c757d;
  }
  
  .btn-danger {
    background: #dc3545;
  }
`;

const ProfilPage = () => {
  const authUser = useSelector((state) => state.authUser);
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    jabatan: '',
    subBagian: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // TODO: Fetch user data from API
    setFormData({
      nama: authUser?.nama_lengkap || 'John Doe',
      username: authUser?.username || 'john.doe',
      jabatan: authUser?.role || 'Staf',
      subBagian: authUser?.divisi || 'Sub Bagian Umum'
    });
  }, [authUser]);

  const getRoleName = (role) => {
    switch (role) {
      case 'sekertaris':
        return 'Sekertaris';
      case 'kasub':
        return 'Kepala Sub Bagian';
      case 'staf':
        return 'Staf';
    }
  };

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
    if (!formData.username) newErrors.username = 'Username harus diisi';
    
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Password saat ini harus diisi';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'Password baru harus diisi';
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Password baru minimal 6 karakter';
    }
    
    if (!passwordData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password harus diisi';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password tidak cocok';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      setIsLoading(true);
      try {
        await changePassword({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        });

        alert('Password berhasil diubah!');
        setShowPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setPasswordErrors({});
      } catch (error) {
        console.error('Error updating password:', error);
        setPasswordErrors({
          current_password: error.message || 'Terjadi kesalahan pada server'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <Avatar>
            <FaUser />
          </Avatar>
          <h5>{formData.nama}</h5>
          {formData.jabatan !== 'sekertaris' ? (
            <p>{getRoleName(formData.jabatan)} - {formData.subBagian}</p>
          ) : (
            <p>{getRoleName(formData.jabatan)}</p>
          )}
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
              <label htmlFor="jabatan">Jabatan</label>
              <input
                type="text"
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                disabled
              />
            </FormGroup>

            {formData.jabatan !== 'sekertaris' && (
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
            )}
          </div>
          
          <div>
            <FormGroup>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.username && <div className="error">{errors.username}</div>}
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
                    nama: authUser?.nama_lengkap || 'John Doe',
                    username: authUser?.username || 'john.doe',
                    jabatan: authUser?.role || 'Staf',
                    subBagian: authUser?.divisi || 'Sub Bagian Umum'
                  });
                }}
              >
                Batal
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profil
              </Button>
              <Button type="button" onClick={() => setShowPasswordModal(true)}>
                <FaLock /> Ubah Password
              </Button>
            </>
          )}
        </ActionButtons>
      </Card>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <FaLock />
              <h3>Ubah Password</h3>
              <CloseButton onClick={closePasswordModal}>&times;</CloseButton>
            </ModalHeader>
            
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <label htmlFor="current_password">Password Saat Ini</label>
                <PasswordInput>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
                {passwordErrors.current_password && (
                  <div className="error">{passwordErrors.current_password}</div>
                )}
              </FormGroup>

              <FormGroup>
                <label htmlFor="new_password">Password Baru</label>
                <PasswordInput>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
                {passwordErrors.new_password && (
                  <div className="error">{passwordErrors.new_password}</div>
                )}
              </FormGroup>

              <FormGroup>
                <label htmlFor="confirm_password">Konfirmasi Password Baru</label>
                <PasswordInput>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Konfirmasi password baru"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </PasswordInput>
                {passwordErrors.confirm_password && (
                  <div className="error">{passwordErrors.confirm_password}</div>
                )}
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Password'}
                </Button>
                <Button type="button" className="btn-secondary" onClick={closePasswordModal}>
                  Batal
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Layout>
  );
};

export default ProfilPage; 