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

const TemplateSuratPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state);
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    // TODO: Fetch templates from API
    setTemplates([
      {
        id: 1,
        nama: 'Surat Undangan Rapat',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat undangan rapat',
        dibuat: '2024-03-20'
      },
      {
        id: 2,
        nama: 'Surat Tugas',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat penugasan',
        dibuat: '2024-03-19'
      }
    ]);
  }, []);
  
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      // TODO: Delete template via API
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Halaman ini masih dalam pengembangan</h5>
          {/* <ActionButtons>
            <Button className="primary" onClick={() => navigate('/template-surat/tambah')}>
              <FaPlus /> Tambah Template
            </Button>
          </ActionButtons> */}
        </Header>
        
        {/* <Table>
          <thead>
            <tr>
              <th>Nama Template</th>
              <th>Jenis</th>
              <th>Deskripsi</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(template => (
              <tr key={template.id}>
                <td>{template.nama}</td>
                <td>{template.jenis}</td>
                <td>{template.deskripsi}</td>
                <td>{template.dibuat}</td>
                <td>
                  <ActionButtons>
                    <Button
                      className="secondary"
                      onClick={() => navigate(`/template-surat/${template.id}`)}
                    >
                      <FaEye /> Lihat
                    </Button>
                    <Button
                      className="primary"
                      onClick={() => navigate(`/template-surat/${template.id}/edit`)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      className="danger"
                      onClick={() => handleDelete(template.id)}
                    >
                      <FaTrash /> Hapus
                    </Button>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </Card>
    </Layout>
  );
};

export default TemplateSuratPage; 