import React from 'react';
import { Link } from 'react-router-dom';
import LoginInput from '../../components/Base/auth/LoginInput';
import { LocaleConsumer } from '../../../contexts/LocaleContext';
import { useDispatch } from 'react-redux';
import { asyncSetAuthUser } from '../../../states/authUser/action';
import { GiWorld } from 'react-icons/gi';

function LoginPage() {
  const dispatch = useDispatch();

  const onLogin = ({ email, password }) => {
    dispatch(asyncSetAuthUser({ email, password }));
  };

  return (
    <LocaleConsumer>
      {({ locale }) => {
        if (locale === 'EN') {
          return (
            <div>
              <div className="form-container logreg">
                <div className="logo">
                  <GiWorld />
                </div>
                <LoginInput login={onLogin} locale={locale} />
                <p>
                  Don&apos;t have an account? <Link to="/register">Sign up here!</Link>
                </p>
              </div>
            </div>
          );
        }
        return (
          <div>
            <div className="form-container logreg">
              <div className="logo">
                <GiWorld />
              </div>
              <LoginInput login={onLogin} locale={locale} />
              <p>
                Belum punya akun? <Link to="/register">Registrasi disini!</Link>
              </p>
            </div>
          </div>
        );
      }}
    </LocaleConsumer>
  );
}

export default LoginPage;
