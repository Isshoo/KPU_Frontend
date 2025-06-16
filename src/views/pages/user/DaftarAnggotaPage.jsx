import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h5 {
    margin: 0;
    font-size: 18px;
    color: #012970;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  
  &.primary {
    background: #4154f1;
    color: white;
  }
  
  &.danger {
    background: #dc3545;
    color: white;
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: #012970;
    background: #f8f9fa;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
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

const DaftarAnggotaPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);
  const [anggota, setAnggota] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // TODO: Fetch anggota from API
    setAnggota([
      {
        id: 1,
        nama: 'John Doe',
        nip: '198501012010011001',
        jabatan: 'Staf',
        email: 'john.doe@kpu.go.id',
        telepon: '081234567890'
      },
      {
        id: 2,
        nama: 'Jane Smith',
        nip: '198602022010011002',
        jabatan: 'Staf',
        email: 'jane.smith@kpu.go.id',
        telepon: '081234567891'
      }
    ]);
  }, []);
  
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      // TODO: Delete anggota via API
      setAnggota(prev => prev.filter(a => a.id !== id));
    }
  };
  
  const filteredAnggota = anggota.filter(a => 
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nip.includes(searchTerm) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Daftar Anggota</h5>
          <ActionButtons>
            <Button className="primary" onClick={() => navigate('/daftar-anggota/tambah')}>
              <FaPlus /> Tambah Anggota
            </Button>
          </ActionButtons>
        </Header>
        
        <SearchBar>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <Table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jabatan</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnggota.map(anggota => (
              <tr key={anggota.id}>
                <td>{anggota.nama}</td>
                <td>{anggota.nip}</td>
                <td>{anggota.jabatan}</td>
                <td>{anggota.email}</td>
                <td>{anggota.telepon}</td>
                <td>
                  <ActionButtons>
                    <Button
                      className="secondary"
                      onClick={() => navigate(`/daftar-anggota/${anggota.id}`)}
                    >
                      <FaEye /> Lihat
                    </Button>
                    <Button
                      className="primary"
                      onClick={() => navigate(`/daftar-anggota/${anggota.id}/edit`)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      className="danger"
                      onClick={() => handleDelete(anggota.id)}
                    >
                      <FaTrash /> Hapus
                    </Button>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Layout>
  );
};

export default DaftarAnggotaPage; 