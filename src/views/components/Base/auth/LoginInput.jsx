import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import useInput from '../../../../hooks/useInput';
import useVisibility from '../../../../hooks/useVisibility';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function LoginInput({ login, locale }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useVisibility(false);

  return (
    <form id="loginForm" className="logreg-form" autoComplete="on">
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="email form-input"
          required
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className="password form-input"
            required
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
          />
          <button
            id="login-toggle-password"
            type="button"
            className="toggle-password"
            onClick={setShowPassword}
            aria-label="Toggle Password Button"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
      <button
        type="button"
        id="loginSubmit"
        className="submit-btn"
        onClick={() => login({ email, password })}
      >
        {locale === 'EN' ? 'Login' : 'Masuk'}
      </button>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default LoginInput;