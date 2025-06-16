import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ page = '' }) => {
  return (
    <div className='pageload'>
      <div className={`pageCenter ${page !== '' ? page : ''}`}>
        <div className='pageRing'></div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  page: PropTypes.string,
};

export default Loading;
