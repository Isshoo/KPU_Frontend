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

const KepalaSubBagianPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);
  const [kepalaSubBagian, setKepalaSubBagian] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // TODO: Fetch kepala sub bagian from API
    setKepalaSubBagian([
      {
        id: 1,
        nama: 'Dr. John Doe',
        nip: '198501012010011001',
        subBagian: 'Sub Bagian Umum',
        email: 'john.doe@kpu.go.id',
        telepon: '081234567890',
        periode: '2024-2025'
      },
      {
        id: 2,
        nama: 'Dr. Jane Smith',
        nip: '198602022010011002',
        subBagian: 'Sub Bagian Keuangan',
        email: 'jane.smith@kpu.go.id',
        telepon: '081234567891',
        periode: '2024-2025'
      }
    ]);
  }, []);
  
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kepala sub bagian ini?')) {
      // TODO: Delete kepala sub bagian via API
      setKepalaSubBagian(prev => prev.filter(k => k.id !== id));
    }
  };
  
  const filteredKepalaSubBagian = kepalaSubBagian.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.nip.includes(searchTerm) ||
    k.subBagian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Kepala Sub Bagian</h5>
          <ActionButtons>
            <Button className="primary" onClick={() => navigate('/kepala-sub-bagian/tambah')}>
              <FaPlus /> Tambah Kepala Sub Bagian
            </Button>
          </ActionButtons>
        </Header>
        
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
              <th>Nama</th>
              <th>NIP</th>
              <th>Sub Bagian</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Periode</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKepalaSubBagian.map(kepala => (
              <tr key={kepala.id}>
                <td>{kepala.nama}</td>
                <td>{kepala.nip}</td>
                <td>{kepala.subBagian}</td>
                <td>{kepala.email}</td>
                <td>{kepala.telepon}</td>
                <td>{kepala.periode}</td>
                <td>
                  <ActionButtons>
                    <Button
                      className="secondary"
                      onClick={() => navigate(`/kepala-sub-bagian/${kepala.id}`)}
                    >
                      <FaEye /> Lihat
                    </Button>
                    <Button
                      className="primary"
                      onClick={() => navigate(`/kepala-sub-bagian/${kepala.id}/edit`)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      className="danger"
                      onClick={() => handleDelete(kepala.id)}
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

export default KepalaSubBagianPage; 