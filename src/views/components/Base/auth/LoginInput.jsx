import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../../../../hooks/useInput';
import useVisibility from '../../../../hooks/useVisibility';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function LoginInput({ login, locale }) {
  const [username, onUsernameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useVisibility(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
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
          placeholder={locale === 'EN' ? 'Enter your username' : 'Masukkan username Anda'}
          value={username}
          onChange={onUsernameChange}
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
            placeholder={locale === 'EN' ? 'Enter your password' : 'Masukkan password Anda'}
            value={password}
            onChange={onPasswordChange}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={setShowPassword}
            aria-label={locale === 'EN' ? 'Toggle password visibility' : 'Ubah visibilitas password'}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
      <button type="submit" className="submit-button">
        {locale === 'EN' ? 'Sign In' : 'Masuk'}
      </button>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default LoginInput;