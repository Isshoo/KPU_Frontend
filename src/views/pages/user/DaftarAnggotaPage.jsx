import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';
import { BASE_URL } from '../../../globals/config';
import { _fetchWithAuth } from '../../../utils/auth_helper';

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  
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

  &.primary {
    background-color: #0d6efd;
    color: white;
  }

  &.warning {
    background-color: #ffc107;
    color: #000;
  }

  &.danger {
    background-color: #dc3545;
    color: white;
  }

  &:hover {
    opacity: 0.9;
  }
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

const RoleBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.sekertaris {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  &.kasub {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.staf {
    background-color: #fff3e0;
    color: #e65100;
  }
`;

const DivisiBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: #f3e5f5;
  color: #7b1fa2;
`;

const DaftarAnggotaPage = () => {
  const navigate = useNavigate();
  const [anggota, setAnggota] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const authUser = useSelector((state) => state.authUser);

  const fetchAnggota = async (page = 1) => {
    try {
      setLoading(true);
      const response = await _fetchWithAuth(`${BASE_URL}/users/?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch anggota');
      }
      const data = await response.json();
      console.log(data);
      setAnggota(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggota();
  }, []);

  const handleView = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/profile/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      try {
        const response = await _fetchWithAuth(`${BASE_URL}/users/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete anggota');
        }
        fetchAnggota(pagination.page);
      } catch (err) {
        console.error('Error deleting anggota:', err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchAnggota(newPage);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'sekertaris':
        return <RoleBadge className="sekertaris">Sekertaris</RoleBadge>;
      case 'kasub':
        return <RoleBadge className="kasub">Kepala Sub Bagian</RoleBadge>;
      case 'staf':
        return <RoleBadge className="staf">Staf</RoleBadge>;
      default:
        return <RoleBadge>{role}</RoleBadge>;
    }
  };

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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Layout>
      <Card>
        <SearchBar>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, sub bagian, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <Table>
          <thead>
            <tr>
              <TableHeader>Nama Lengkap</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Divisi</TableHeader>
              <TableHeader>Aksi</TableHeader>
            </tr>
          </thead>
          <tbody>
            {anggota.map((user) => (
              <tr key={user.id}>
                <TableCell>{user.nama_lengkap}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user.divisi && <DivisiBadge>{getDivisiName(user.divisi)}</DivisiBadge>}
                </TableCell>
                <TableCell>
                  <ActionButton className="primary" onClick={() => handleView(user.id)}>
                    <FaEye /> Lihat
                  </ActionButton>
                  <ActionButton className="warning" onClick={() => handleEdit(user.id)}>
                    <FaEdit /> Edit
                  </ActionButton>
                  <ActionButton className="danger" onClick={() => handleDelete(user.id)}>
                    <FaTrash /> Hapus
                  </ActionButton>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>

        <PaginationContainer>
          <PaginationInfo>
            Menampilkan {anggota.length} dari {pagination.total} data
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

export default DaftarAnggotaPage; 