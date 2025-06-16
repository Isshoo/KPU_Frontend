import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
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
  
  &.success {
    background: #28a745;
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  &.pending {
    background: #ffc107;
    color: #000;
  }
  
  &.approved {
    background: #28a745;
    color: white;
  }
  
  &.rejected {
    background: #dc3545;
    color: white;
  }
`;

const ValidasiSuratPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);
  const [suratKeluar, setSuratKeluar] = useState([]);
  
  useEffect(() => {
    // TODO: Fetch surat keluar from API
    setSuratKeluar([
      {
        id: 1,
        nomor: '001/SK/III/2024',
        perihal: 'Undangan Rapat Koordinasi',
        tertuju: 'Kepala Divisi',
        tanggal: '2024-03-20',
        status: 'pending',
        dibuatOleh: 'John Doe'
      },
      {
        id: 2,
        nomor: '002/SK/III/2024',
        perihal: 'Surat Tugas',
        tertuju: 'Tim Panitia',
        tanggal: '2024-03-19',
        status: 'approved',
        dibuatOleh: 'Jane Smith'
      }
    ]);
  }, []);
  
  const handleValidate = (id, status) => {
    if (window.confirm(`Apakah Anda yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} surat ini?`)) {
      // TODO: Update status via API
      setSuratKeluar(prev => prev.map(surat => 
        surat.id === id ? { ...surat, status } : surat
      ));
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <StatusBadge className="pending">Menunggu</StatusBadge>;
      case 'approved':
        return <StatusBadge className="approved">Disetujui</StatusBadge>;
      case 'rejected':
        return <StatusBadge className="rejected">Ditolak</StatusBadge>;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Validasi Surat Keluar</h5>
        </Header>
        
        <Table>
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Perihal</th>
              <th>Tertuju</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Dibuat Oleh</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suratKeluar.map(surat => (
              <tr key={surat.id}>
                <td>{surat.nomor}</td>
                <td>{surat.perihal}</td>
                <td>{surat.tertuju}</td>
                <td>{surat.tanggal}</td>
                <td>{getStatusBadge(surat.status)}</td>
                <td>{surat.dibuatOleh}</td>
                <td>
                  <ActionButtons>
                    <Button
                      className="secondary"
                      onClick={() => navigate(`/surat-keluar/${surat.id}`)}
                    >
                      <FaEye /> Lihat
                    </Button>
                    {surat.status === 'pending' && (
                      <>
                        <Button
                          className="success"
                          onClick={() => handleValidate(surat.id, 'approved')}
                        >
                          <FaCheck /> Setujui
                        </Button>
                        <Button
                          className="danger"
                          onClick={() => handleValidate(surat.id, 'rejected')}
                        >
                          <FaTimes /> Tolak
                        </Button>
                      </>
                    )}
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

export default ValidasiSuratPage; 