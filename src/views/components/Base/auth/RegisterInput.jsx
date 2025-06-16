import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../../../../hooks/useInput';
import useVisibility from '../../../../hooks/useVisibility';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function RegisterInput({ register, locale }) {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useVisibility(false);

  return (
    <form id='registerForm' className='logreg-form' autoComplete='off'>
      <div>
        <label htmlFor='name'>{locale === 'EN' ? 'Name' : 'Nama'}</label>
        <input
          type='text'
          id='name'
          name='name'
          className='name form-input'
          required
          placeholder={locale === 'EN' ? 'Name' : 'Nama'}
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          className='email form-input'
          required
          placeholder='Email'
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <div className='password-container'>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            name='password'
            className='password form-input'
            required
            placeholder='Password'
            value={password}
            onChange={onPasswordChange}
          ></input>
          <button
            id='reg-toggle-password'
            type='button'
            className='toggle-password'
            onClick={setShowPassword}
            aria-label='Toggle Password Button'
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor='confirm-password'>
          {locale === 'EN' ? 'Confirm Password' : 'Konfirmasi Password'}
        </label>
        <div className='password-container'>
          <input
            type='password'
            id='confirm-password'
            name='confirm-password'
            className='password form-input'
            required
            placeholder={locale === 'EN' ? 'Confirm Password' : 'Konfirmasi Password'}
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
          ></input>
        </div>
      </div>
      <button
        type='button'
        id='registrationSubmit'
        className='submit-btn'
        onClick={() => register({ name, email, password, confirmPassword })}
      >
        {locale === 'EN' ? 'Register' : 'Registrasi'}
      </button>
    </form>
  );
}

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default RegisterInput;