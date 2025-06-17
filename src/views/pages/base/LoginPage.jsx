import React from 'react';
import { Link } from 'react-router-dom';
import LoginInput from '../../components/Base/auth/LoginInput';
import { LocaleConsumer } from '../../../contexts/LocaleContext';
import { useDispatch } from 'react-redux';
import { asyncSetAuthUser } from '../../../states/authUser/action';

function LoginPage() {
  const dispatch = useDispatch();

  const onLogin = ({ username, password }) => {
    dispatch(asyncSetAuthUser({ username, password }));
  };

  return (
    <LocaleConsumer>
      {({ locale }) => (
        <div className="login-container">
          <div className="login-card">
            <div className="logo-container">
              <img src="/logo_kpu.png" alt="KPU Logo" />
              <h1>Komisi Pemilihan Umum</h1>
              <p> <b>Kota Manado</b>
              </p>
            </div>
            <LoginInput login={onLogin} locale={locale} />
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
