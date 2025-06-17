import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEye, FaFileDownload, FaChevronLeft, FaChevronRight, FaSearch, FaCalendar, FaPlus } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
import { BASE_URL } from '../../../globals/config';
import { _fetchWithAuth } from '../../../utils/auth_helper';
import debounce from 'lodash/debounce';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;

  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4154f1;
    }
  }

  .date-inputs {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .date-input {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    input {
      border: none;
      padding: 0;
      cursor: pointer;
    }

    &:focus-within {
      border-color: #4154f1;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #012970;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 5px;

  &.primary {
    background-color: #0d6efd;
    color: white;
  }

  &.success {
    background-color: #198754;
    color: white;
  }

  &.danger {
    background-color: #dc3545;
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const AddButton = styled(ActionButton)`
  background-color: #198754;
  color: white;
  padding: 8px 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
`;

const PaginationInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  color: #0d6efd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #e9ecef;
  }
`;

const SearchBarComponent = memo(({ searchInput, onSearch, onDateChange, startDate, endDate }) => {
  const inputRef = useRef(null);
  
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedSetSearchTerm(value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <SearchBar>
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari berdasarkan nomor surat, ditujukan kepada, atau perihal..."
        defaultValue={searchInput}
        onChange={handleSearch}
        onBlur={(e) => {
          if (e.target.value) {
            e.target.focus();
          }
        }}
      />
      <div className="date-inputs">
        <div className="date-input">
          <FaCalendar />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange('start', e.target.value)}
            placeholder="Tanggal Mulai"
          />
        </div>
        <div className="date-input">
          <FaCalendar />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange('end', e.target.value)}
            placeholder="Tanggal Akhir"
          />
        </div>
      </div>
    </SearchBar>
  );
});

const SuratKeluarPage = () => {
  const navigate = useNavigate();
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  const fetchSuratKeluar = async (page = 1) => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/surat-keluar/?page=${page}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (startDate) {
        url += `&start_date=${startDate}`;
      }
      if (endDate) {
        url += `&end_date=${endDate}`;
      }

      const response = await _fetchWithAuth(url);
      if (!response.ok) {
        throw new Error('Failed to fetch surat keluar');
      }
      const data = await response.json();
      setSuratKeluar(data.data.surat_list);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, [searchTerm, startDate, endDate]);

  const handleView = async (id) => {
    try {
      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/${id}/file`);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error viewing file:', err);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/${id}/file`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surat-keluar-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchSuratKeluar(newPage);
    }
  };

  const handleSearch = useCallback((value) => {
    setSearchInput(value);
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleDateChange = useCallback((type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Layout>
      <Card>

        <SearchBarComponent
          searchInput={searchInput}
          onSearch={handleSearch}
          onDateChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
        />

        <Table>
          <thead>
            <tr>
              <TableHeader>No. Surat</TableHeader>
              <TableHeader>Tanggal Surat</TableHeader>
              <TableHeader>Tanggal Kirim</TableHeader>
              <TableHeader>Ditujukan Kepada</TableHeader>
              <TableHeader>Perihal</TableHeader>
              <TableHeader>Keterangan</TableHeader>
              <TableHeader>Aksi</TableHeader>
            </tr>
          </thead>
          <tbody>
            {suratKeluar.map((surat) => (
              <tr key={surat.id}>
                <TableCell>{surat.nomor_surat}</TableCell>
                <TableCell>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{new Date(surat.tanggal_kirim).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>{surat.ditujukan_kepada}</TableCell>
                <TableCell>{surat.perihal}</TableCell>
                <TableCell>{surat.keterangan || '-'}</TableCell>
                <TableCell>
                  <ActionButton className="primary" onClick={() => handleView(surat.id)}>
                    <FaEye /> Lihat
                  </ActionButton>
                  <ActionButton className="success" onClick={() => handleDownload(surat.id)}>
                    <FaFileDownload /> Download
                  </ActionButton>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>

        <PaginationContainer>
          <PaginationInfo>
            Menampilkan {suratKeluar.length} dari {pagination.total} data
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <FaChevronLeft /> Sebelumnya
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
            >
              Selanjutnya <FaChevronRight />
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      </Card>
    </Layout>
  );
};

export default SuratKeluarPage; 