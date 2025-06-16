import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages === 0) {
    return '';
  }
  return (
    <div className='pagination'>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
        <FaAngleDoubleLeft /> First
      </button>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        <FaAngleLeft /> Prev
      </button>
      <span>
        Page <strong>{currentPage}</strong> of <strong>{totalPages !== 0 ? totalPages : 1}</strong>
      </span>
      <button
        disabled={currentPage === totalPages || currentPage > totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next <FaAngleRight />
      </button>
      <button
        disabled={currentPage === totalPages || currentPage > totalPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        Last <FaAngleDoubleRight />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination;
