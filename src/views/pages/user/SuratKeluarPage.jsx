import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEye, FaFileDownload, FaChevronLeft, FaChevronRight, FaSearch, FaCalendar, FaPlus, FaTrash, FaBuilding } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
import Toast from '../../components/Base/Toast';
import DeleteConfirmationModal from '../../components/Base/DeleteConfirmationModal';
import useToast from '../../../hooks/useToast';
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

  .divisi-input {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    select {
      border: none;
      padding: 0;
      cursor: pointer;
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
    
    &:hover:not(:disabled) {
      background-color: #0b5ed7;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
    }
  }

  &.success {
    background-color: #198754;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #157347;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(25, 135, 84, 0.3);
    }
  }

  &.danger {
    background-color: #dc3545;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #bb2d3b;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6c757d;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;

const SearchBarComponent = memo(({ searchInput, onSearch, onDateChange, startDate, endDate, onDivisiChange, divisi }) => {
  const inputRef = useRef(null);
  const authUser = useSelector(state => state.authUser);

  const divisiOptions = [
    { value: 'teknis_dan_hukum', label: 'Teknis dan Hukum' },
    { value: 'data_dan_informasi', label: 'Data dan Informasi' },
    { value: 'logistik_dan_keuangan', label: 'Logistik dan Keuangan' },
    { value: 'sdm_dan_parmas', label: 'SDM dan Parmas' }
  ];
  
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
      {/* divisi dropdown */}
      {authUser.role === 'sekertaris' && (
        <div className="divisi-input">
          <FaBuilding />
          <select
            value={divisi}
            onChange={(e) => onDivisiChange(e.target.value)}
          >
            <option value="">Pilih Divisi</option>
            {divisiOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      )}
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
  const authUser = useSelector(state => state.authUser);
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [divisi, setDivisi] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);
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
      if (authUser.divisi) {
        url += `&divisi=${authUser.divisi}`;
      }
      if (divisi) {
        url += `&divisi=${divisi}`;
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
      showError('Gagal!', 'Gagal memuat data surat keluar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, [searchTerm, startDate, endDate, divisi]);

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
      showError('Gagal!', 'Gagal membuka file surat');
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
      showSuccess('Berhasil!', 'File surat berhasil diunduh');
    } catch (err) {
      console.error('Error downloading file:', err);
      showError('Gagal!', 'Gagal mengunduh file surat');
    }
  };

  const handleDeleteClick = (surat) => {
    setSelectedSurat(surat);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSurat) return;

    try {
      setDeletingId(selectedSurat.id);
      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/${selectedSurat.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete surat');
      }

      showSuccess('Berhasil!', 'Surat keluar berhasil dihapus');
      setShowDeleteModal(false);
      setSelectedSurat(null);
      
      // Refresh data setelah berhasil menghapus
      await fetchSuratKeluar(pagination.page);
    } catch (err) {
      console.error('Error deleting surat:', err);
      showError('Gagal!', err.message || 'Gagal menghapus surat keluar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedSurat(null);
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

  const handleDivisiChange = useCallback((value) => {
    setDivisi(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const getDivisiName = (divisi) => {
    switch (divisi) {
      case 'teknis_dan_hukum':
        return 'Teknis dan Hukum';
      case 'data_dan_informasi':
        return 'Data dan Informasi';
      case 'logistik_dan_keuangan':
        return 'Logistik dan Keuangan';
      case 'sdm_dan_parmas':
        return 'SDM dan Parmas';
      default:
        return divisi;
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner>Memuat data surat keluar...</LoadingSpinner>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card>
          <ErrorMessage>
            {error}
          </ErrorMessage>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        suratData={selectedSurat}
        isLoading={deletingId !== null}
      />
      
      <Card>
        <SearchBarComponent
          searchInput={searchInput}
          onSearch={handleSearch}
          onDateChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          onDivisiChange={handleDivisiChange}
          divisi={divisi}
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
              {authUser.role === 'sekertaris' && <TableHeader>Divisi</TableHeader>}
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
                {authUser.role === 'sekertaris' && <TableCell>{getDivisiName(surat.divisi)}</TableCell>}
                <TableCell>
                  <ActionButton 
                    className="primary" 
                    onClick={() => handleView(surat.id)}
                    title="Lihat surat"
                  >
                    <FaEye /> Lihat
                  </ActionButton>
                  <ActionButton 
                    className="success" 
                    onClick={() => handleDownload(surat.id)}
                    title="Download surat"
                  >
                    <FaFileDownload /> Download
                  </ActionButton>
                  <ActionButton 
                    className="danger" 
                    onClick={() => handleDeleteClick(surat)}
                    disabled={deletingId === surat.id}
                    title="Hapus surat"
                  >
                    <FaTrash /> 
                    {deletingId === surat.id ? 'Menghapus...' : 'Hapus'}
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