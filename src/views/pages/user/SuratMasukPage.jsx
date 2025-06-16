import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEye } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 20px;
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
    background: #f6f9ff;
  }
  
  tr:hover {
    background: #f6f9ff;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  &.primary {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  &.success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  &.danger {
    background: #ffebee;
    color: #c62828;
  }
  
  &.info {
    background: #e3f2fd;
    color: #0288d1;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-right: 5px;
  
  &.primary {
    background: #4154f1;
    color: white;
  }
`;

const SuratMasukPage = () => {
  const [suratMasuk, setSuratMasuk] = useState([]);
  const { authUser } = useSelector((state) => state);
  
  useEffect(() => {
    // TODO: Fetch surat masuk data from API
    // This is just mock data for now
    setSuratMasuk([
      {
        id: 1,
        pengirim: 'Kepala Dinas',
        namasuratmsk: 'Surat Undangan',
        perihal: 'Undangan Rapat',
        nosurat: '001/SM/2024',
        status: 0,
        komen: 'Menunggu diproses'
      },
      // Add more mock data as needed
    ]);
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <StatusBadge className="primary">Menunggu</StatusBadge>;
      case 1:
        return <StatusBadge className="success">Diproses</StatusBadge>;
      case 2:
        return <StatusBadge className="danger">Ditolak</StatusBadge>;
      default:
        return <StatusBadge className="info">Perbaiki kembali</StatusBadge>;
    }
  };
  
  return (
    <Layout>
      <Card>
        <h5>Daftar Surat Masuk</h5>
        
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pengirim</th>
              <th>Nama Surat</th>
              <th>Perihal</th>
              <th>No Surat</th>
              <th>Status</th>
              <th>Catatan</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suratMasuk.map((surat) => (
              <tr key={surat.id}>
                <td>{surat.id}</td>
                <td><b>{surat.pengirim}</b></td>
                <td>{surat.namasuratmsk}</td>
                <td>{surat.perihal}</td>
                <td>{surat.nosurat}</td>
                <td>{getStatusBadge(surat.status)}</td>
                <td>{surat.komen}</td>
                <td>
                  <ActionButton className="primary" onClick={() => window.location.href = `/surat/${surat.id}`}>
                    <FaEye /> Lihat
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Layout>
  );
};

export default SuratMasukPage; 