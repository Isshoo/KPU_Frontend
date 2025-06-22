import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../../../../hooks/useInput';
import useVisibility from '../../../../hooks/useVisibility';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function LoginInput({ login, locale, isLoading = false }) {
  const [username, onUsernameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useVisibility(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      login({ username, password });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label className="input-label" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-input"
          required
          disabled={isLoading}
          placeholder={locale === 'EN' ? 'Enter your username' : 'Masukkan username Anda'}
          value={username}
          onChange={onUsernameChange}
          autoComplete="username"
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className="form-input"
            required
            disabled={isLoading}
            placeholder={locale === 'EN' ? 'Enter your password' : 'Masukkan password Anda'}
            value={password}
            onChange={onPasswordChange}
            autoComplete="off"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={setShowPassword}
            disabled={isLoading}
            aria-label={locale === 'EN' ? 'Toggle password visibility' : 'Ubah visibilitas password'}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading 
          ? (locale === 'EN' ? 'Signing In...' : 'Sedang Masuk...') 
          : (locale === 'EN' ? 'Sign In' : 'Masuk')
        }
      </button>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default LoginInput;