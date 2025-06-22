import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginInput from '../../components/Base/auth/LoginInput';
import Toast from '../../components/Base/Toast';
import { LocaleConsumer } from '../../../contexts/LocaleContext';
import { useDispatch } from 'react-redux';
import { asyncSetAuthUser } from '../../../states/authUser/action';
import useToast from '../../../hooks/useToast';

function LoginPage() {
  const dispatch = useDispatch();
  const { toasts, showError, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async ({ username, password }) => {
    // Reset any previous errors
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!username.trim() || !password.trim()) {
        showError('Login Gagal', 'Username dan password harus diisi');
        return;
      }

      await dispatch(asyncSetAuthUser({ username, password }));
      // If successful, the user will be redirected automatically
    } catch (error) {
      console.error('Login error in component:', error);
      
      // Handle specific error cases
      let errorMessage = 'Username atau password salah';
      
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Username atau password salah';
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError('Login Gagal', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocaleConsumer>
      {({ locale }) => (
        <div className="login-container">
          {/* Toast Notifications */}
          <Toast toasts={toasts} onClose={removeToast} />
          
          <div className="login-card">
            <div className="logo-container">
              <img src="/logo_kpu.png" alt="KPU Logo" />
              <h1>Komisi Pemilihan Umum</h1>
              <p> <b>Kota Manado</b>
              </p>
            </div>
            <LoginInput login={onLogin} locale={locale} isLoading={isLoading} />
            {/* <p className="register-link">
              {locale === 'EN' ? (
                <>Don&apos;t have an account? <Link to="/register">Sign up here!</Link></>
              ) : (
                <>Belum punya akun? <Link to="/register">Daftar di sini</Link></>
              )}
            </p> */}
          </div>
        </div>
      )}
    </LocaleConsumer>
  );
}

export default LoginPage;
