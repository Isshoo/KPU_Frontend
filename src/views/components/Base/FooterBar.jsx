import React from 'react';
import { LocaleConsumer } from '../../../contexts/LocaleContext';

const FooterBar = () => {
  return (
    <LocaleConsumer>
      {({ locale }) => {
        return (
          <div className='footer-bar'>
            <p className='text-footer'>
              &copy;
              {locale === 'EN'
                ? ' News Classifier App. All rights reserved.'
                : ' Aplikasi Klasifikasi Berita. Seluruh hak cipta dilindungi.'}
            </p>
          </div>
        );
      }}
    </LocaleConsumer>
  );
};

export default FooterBar;
