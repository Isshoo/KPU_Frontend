import React, { useContext } from 'react';
import LocaleContext from '../../../contexts/LocaleContext';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../../components/Base/FooterBar';

const NotFoundPage = () => {
  const { locale } = useContext(LocaleContext);
  const navigate = useNavigate();
  return (
    <>
      <div className='notFound-container'>
        <div className='notFound-content'>
          <h1>404</h1>
          {/* <p>{locale === 'EN' ? 'Page Not Found' : 'Halaman tidak ditemukan'}</p> */}
          <p>
            {locale === 'EN'
              ? 'The page you are looking for does not exist.'
              : 'Halaman yang Anda cari tidak ada.'}
          </p>
          <button className='notFound-button' onClick={() => navigate('/')}>
            {locale === 'EN' ? 'Back to Landing Page' : 'Kembali ke Halaman Utama'}
          </button>
        </div>
      </div>
      <footer className='footer'>
        <FooterBar />
      </footer>
    </>
  );
};

export default NotFoundPage;
