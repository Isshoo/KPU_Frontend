import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEnvelope, FaEnvelopeOpen, FaFileAlt, FaUsers, FaChevronRight } from 'react-icons/fa';
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .content {
    flex: 1;

    h3 {
      margin: 0;
      font-size: 24px;
      color: #012970;
    }

    p {
      margin: 5px 0 0;
      color: #6c757d;
      font-size: 14px;
    }
  }

  &.primary .icon {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  &.success .icon {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.warning .icon {
    background-color: #fff3e0;
    color: #e65100;
  }

  &.info .icon {
    background-color: #e3f2fd;
    color: #0d6efd;
  }
`;

const SectionTitle = styled.h5`
  margin: 0 0 20px;
  color: #012970;
  font-size: 18px;
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

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #0d6efd;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding: 0;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.pending {
    background-color: #fff3e0;
    color: #e65100;
  }

  &.approved {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.rejected {
    background-color: #ffebee;
    color: #c62828;
  }
`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_surat_masuk: 0,
    total_surat_keluar: 0,
    total_anggota: 0,
    total_template: 2
  });
  const [recentSuratMasuk, setRecentSuratMasuk] = useState([]);
  const [recentSuratKeluar, setRecentSuratKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authUser = useSelector((state) => state.authUser);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, suratMasukRes, suratKeluarRes] = await Promise.all([
        _fetchWithAuth(`${BASE_URL}/dashboard/stats/?divisi=${authUser.divisi || ''}`),
        _fetchWithAuth(`${BASE_URL}/surat-masuk/?limit=5`),
        _fetchWithAuth(`${BASE_URL}/surat-keluar/?limit=5`)
      ]);

      if (!statsRes.ok || !suratMasukRes.ok || !suratKeluarRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, suratMasukData, suratKeluarData] = await Promise.all([
        statsRes.json(),
        suratMasukRes.json(),
        suratKeluarRes.json()
      ]);

      setStats(statsData.data);
      setRecentSuratMasuk(suratMasukData.data.surat_list);
      setRecentSuratKeluar(suratKeluarData.data.surat_list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <StatusBadge className="pending">Menunggu</StatusBadge>;
      case 'approved':
        return <StatusBadge className="approved">Disetujui</StatusBadge>;
      case 'rejected':
        return <StatusBadge className="rejected">Ditolak</StatusBadge>;
      default:
        return <StatusBadge>{status}</StatusBadge>;
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
      <StatsGrid>
        <StatCard className="primary">
          <div className="icon">
            <FaEnvelope />
          </div>
          <div className="content">
            <h3>{stats.total_surat_masuk}</h3>
            <p>Surat Masuk</p>
          </div>
        </StatCard>

        <StatCard className="success">
          <div className="icon">
            <FaEnvelopeOpen />
          </div>
          <div className="content">
            <h3>{stats.total_surat_keluar}</h3>
            <p>Surat Keluar</p>
          </div>
        </StatCard>

        <StatCard className="warning">
          <div className="icon">
            <FaUsers />
          </div>
          <div className="content">
            <h3>{stats.total_anggota}</h3>
            <p>Total Anggota</p>
          </div>
        </StatCard>

        <StatCard className="info">
          <div className="icon">
            <FaFileAlt />
          </div>
          <div className="content">
            <h3>{stats.total_template || 2}</h3>
            <p>Template Surat</p>
          </div>
        </StatCard>
      </StatsGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card>
          <SectionTitle>Surat Masuk Terbaru</SectionTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>No. Surat</TableHeader>
                <TableHeader>Pengirim</TableHeader>
                <TableHeader>Tanggal</TableHeader>
                <TableHeader>Perihal</TableHeader>
              </tr>
            </thead>
            <tbody>
              {recentSuratMasuk.map((surat) => (
                <tr key={surat.id}>
                  <TableCell>{surat.nomor_surat}</TableCell>
                  <TableCell>{surat.pengirim}</TableCell>
                  <TableCell>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{surat.perihal}</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
          <ViewAllButton onClick={() => navigate('/surat-masuk')}>
            Lihat Semua <FaChevronRight />
          </ViewAllButton>
        </Card>

        <Card>
          <SectionTitle>Surat Keluar Terbaru</SectionTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>No. Surat</TableHeader>
                <TableHeader>Ditujukan Kepada</TableHeader>
                <TableHeader>Tanggal</TableHeader>
                <TableHeader>Perihal</TableHeader>
              </tr>
            </thead>
            <tbody>
              {recentSuratKeluar.map((surat) => (
                <tr key={surat.id}>
                  <TableCell>{surat.nomor_surat}</TableCell>
                  <TableCell>{surat.ditujukan_kepada}</TableCell>
                  <TableCell>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{surat.perihal}</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
          <ViewAllButton onClick={() => navigate('/surat-keluar')}>
            Lihat Semua <FaChevronRight />
          </ViewAllButton>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage; 