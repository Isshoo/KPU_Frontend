import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterInput from '../../components/Base/auth/RegisterInput';
import { LocaleConsumer } from '../../../contexts/LocaleContext';
import { useDispatch } from 'react-redux';
import { asyncRegisterUser } from '../../../states/users/action';
import Swal from 'sweetalert2';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please ensure they match and try again.');
      return;
    }
    const result = await dispatch(asyncRegisterUser({ name, email, password }));

    if (result.success) {
      Swal.fire({
        title: 'Berhasil!',
        text: 'Akun berhasil diregistrasi, silahkan login.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
      });
    } else {
      alert(result.message);
    }
  };

  return (
    <LocaleConsumer>
      {({ locale }) => {
        if (locale === 'EN') {
          return (
            <div>
              <div className="form-container logreg">
                <h2>Register</h2>
                <RegisterInput register={onRegister} locale={locale} />
                <p>
                  Already have an account? <Link to="/">Login here!</Link>
                </p>
              </div>
            </div>
          );
        }
        return (
          <div>
            <div className="form-container logreg">
              <h2>Registrasi</h2>
              <RegisterInput register={onRegister} locale={locale} />
              <p>
                Sudah punya akun? <Link to="/">Masuk disini!</Link>
              </p>
            </div>
          </div>
        );
      }}
    </LocaleConsumer>
  );
}

export default RegisterPage;
