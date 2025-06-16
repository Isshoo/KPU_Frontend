import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEnvelope, FaEnvelopeOpen, FaUsers, FaUserCircle } from 'react-icons/fa';
import Layout from '../../components/Base/Layout';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    
    &.primary {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    &.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    &.warning {
      background: #fff3e0;
      color: #f57c00;
    }
    
    &.info {
      background: #e3f2fd;
      color: #0288d1;
    }
  }
  
  .content {
    flex: 1;
    
    h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #012970;
    }
    
    p {
      margin: 5px 0 0;
      font-size: 14px;
      color: #899bbd;
    }
  }
`;

const RecentActivityCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  
  h5 {
    margin: 0 0 20px;
    font-size: 18px;
    color: #012970;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f6f9ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4154f1;
  }
  
  .content {
    flex: 1;
    
    h4 {
      margin: 0;
      font-size: 14px;
      color: #012970;
    }
    
    p {
      margin: 5px 0 0;
      font-size: 13px;
      color: #899bbd;
    }
  }
`;

const DashboardPage = () => {
  const [stats, setStats] = useState({
    suratMasuk: 0,
    suratKeluar: 0,
    anggota: 0,
    kepalaSubBagian: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const { authUser } = useSelector((state) => state);
  
  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // This is just mock data for now
    setStats({
      suratMasuk: 25,
      suratKeluar: 18,
      anggota: 12,
      kepalaSubBagian: 4
    });
    
    setRecentActivities([
      {
        id: 1,
        type: 'surat_masuk',
        title: 'Surat Undangan Rapat',
        description: 'Dari: Kepala Dinas',
        time: '2 jam yang lalu'
      },
      {
        id: 2,
        type: 'surat_keluar',
        title: 'Surat Permohonan',
        description: 'Kepada: Kepala Bagian',
        time: '3 jam yang lalu'
      },
      {
        id: 3,
        type: 'validasi',
        title: 'Surat Keluar Divalidasi',
        description: 'Oleh: Kepala Sub Bagian',
        time: '5 jam yang lalu'
      }
    ]);
  }, []);
  
  return (
    <Layout>
      <DashboardContainer>
        <StatCard>
          <div className="icon primary">
            <FaEnvelope />
          </div>
          <div className="content">
            <h3>{stats.suratMasuk}</h3>
            <p>Surat Masuk</p>
          </div>
        </StatCard>
        
        <StatCard>
          <div className="icon success">
            <FaEnvelopeOpen />
          </div>
          <div className="content">
            <h3>{stats.suratKeluar}</h3>
            <p>Surat Keluar</p>
          </div>
        </StatCard>
        
        <StatCard>
          <div className="icon warning">
            <FaUsers />
          </div>
          <div className="content">
            <h3>{stats.anggota}</h3>
            <p>Anggota</p>
          </div>
        </StatCard>
        
        <StatCard>
          <div className="icon info">
            <FaUserCircle />
          </div>
          <div className="content">
            <h3>{stats.kepalaSubBagian}</h3>
            <p>Kepala Sub Bagian</p>
          </div>
        </StatCard>
      </DashboardContainer>
      
      <RecentActivityCard>
        <h5>Aktivitas Terbaru</h5>
        <ActivityList>
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id}>
              <div className="icon">
                {activity.type === 'surat_masuk' && <FaEnvelope />}
                {activity.type === 'surat_keluar' && <FaEnvelopeOpen />}
                {activity.type === 'validasi' && <FaUserCircle />}
              </div>
              <div className="content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <p>{activity.time}</p>
              </div>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivityCard>
    </Layout>
  );
};

export default DashboardPage; 