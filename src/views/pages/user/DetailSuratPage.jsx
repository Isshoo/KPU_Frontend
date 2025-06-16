import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
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
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
  
  &.primary {
    background: #4154f1;
    color: white;
  }
  
  &.success {
    background: #28a745;
    color: white;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    color: #899bbd;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 16px;
    color: #012970;
    font-weight: 500;
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

const PreviewSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  h6 {
    margin: 0 0 10px;
    font-size: 16px;
    color: #012970;
  }
  
  .preview {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 4px;
    min-height: 200px;
  }
`;

const DetailSuratPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const { authUser } = useSelector((state) => state);
  
  useEffect(() => {
    // TODO: Fetch surat detail from API
    // This is just mock data for now
    setSurat({
      id: id,
      type: 'masuk', // or 'keluar'
      nomor: '001/SM/2024',
      tanggal: '2024-03-20',
      pengirim: 'Kepala Dinas',
      tertuju: 'Kepala Bagian',
      perihal: 'Undangan Rapat',
      status: 0,
      catatan: 'Menunggu diproses',
      file: 'surat_undangan.pdf',
      isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    });
  }, [id]);
  
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
  
  if (!surat) {
    return <Layout>Loading...</Layout>;
  }
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Detail Surat {surat.type === 'masuk' ? 'Masuk' : 'Keluar'}</h5>
          <ActionButtons>
            <Button className="secondary" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Kembali
            </Button>
            <Button className="primary" onClick={() => window.print()}>
              <FaPrint /> Cetak
            </Button>
            <Button className="success" onClick={() => window.open(`/files/${surat.file}`, '_blank')}>
              <FaDownload /> Download
            </Button>
          </ActionButtons>
        </Header>
        
        <Content>
          <div>
            <InfoGroup>
              <label>Nomor Surat</label>
              <div className="value">{surat.nomor}</div>
            </InfoGroup>
            
            <InfoGroup>
              <label>Tanggal</label>
              <div className="value">{surat.tanggal}</div>
            </InfoGroup>
            
            {surat.type === 'masuk' ? (
              <InfoGroup>
                <label>Pengirim</label>
                <div className="value">{surat.pengirim}</div>
              </InfoGroup>
            ) : (
              <InfoGroup>
                <label>Tertuju</label>
                <div className="value">{surat.tertuju}</div>
              </InfoGroup>
            )}
          </div>
          
          <div>
            <InfoGroup>
              <label>Perihal</label>
              <div className="value">{surat.perihal}</div>
            </InfoGroup>
            
            <InfoGroup>
              <label>Status</label>
              <div className="value">{getStatusBadge(surat.status)}</div>
            </InfoGroup>
            
            <InfoGroup>
              <label>Catatan</label>
              <div className="value">{surat.catatan}</div>
            </InfoGroup>
          </div>
        </Content>
        
        <PreviewSection>
          <h6>Preview Surat</h6>
          <div className="preview">
            {surat.isi}
          </div>
        </PreviewSection>
      </Card>
    </Layout>
  );
};

export default DetailSuratPage; 