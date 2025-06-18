import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave } from 'react-icons/fa';
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

  &.success {
    background: #198754;
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

const TemplateEditor = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PreviewSection = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  min-height: 500px;
  background: white;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4154f1;
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4154f1;
  }
`;

const TemplateSuratPage = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    tanggal_kirim: '',
    ditujukan_kepada: '',
    perihal: '',
    keterangan: ''
  });
  
  useEffect(() => {
    // TODO: Fetch templates from API
    setTemplates([
      {
        id: 1,
        nama: 'Surat Undangan Rapat',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat undangan rapat',
        dibuat: '2024-03-20',
        template: `
          <div class="surat">
            <div class="header">
              <h2>KOMISI PEMILIHAN UMUM</h2>
              <h3>KABUPATEN BANDUNG</h3>
              <p>Jl. Raya Soreang No. 123</p>
            </div>
            <div class="nomor-surat">
              Nomor: {{nomor_surat}}
            </div>
            <div class="tanggal">
              {{tanggal_surat}}
            </div>
            <div class="penerima">
              Kepada Yth.<br/>
              {{ditujukan_kepada}}
            </div>
            <div class="perihal">
              Perihal: {{perihal}}
            </div>
            <div class="isi">
              {{keterangan}}
            </div>
          </div>
        `
      },
      {
        id: 2,
        nama: 'Surat Tugas',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat penugasan',
        dibuat: '2024-03-19',
        template: `
          <div class="surat">
            <div class="header">
              <h2>KOMISI PEMILIHAN UMUM</h2>
              <h3>KABUPATEN BANDUNG</h3>
              <p>Jl. Raya Soreang No. 123</p>
            </div>
            <div class="nomor-surat">
              Nomor: {{nomor_surat}}
            </div>
            <div class="tanggal">
              {{tanggal_surat}}
            </div>
            <div class="penerima">
              Kepada Yth.<br/>
              {{ditujukan_kepada}}
            </div>
            <div class="perihal">
              Perihal: {{perihal}}
            </div>
            <div class="isi">
              {{keterangan}}
            </div>
          </div>
        `
      }
    ]);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      ditujukan_kepada: '',
      perihal: '',
      keterangan: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePreview = () => {
    if (!selectedTemplate) return '';
    
    let preview = selectedTemplate.template;
    Object.entries(formData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return preview;
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving surat with data:', formData);
    // Navigate back to surat keluar page after saving
    navigate('/surat-keluar');
  };
  
  return (
    <Layout>
      <Card>
        <Header>
          <h5>Template Surat</h5>
          <ActionButtons>
            <Button className="primary" onClick={() => navigate('/surat-keluar')}>
              Kembali
            </Button>
          </ActionButtons>
        </Header>
        
        <Table>
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
                      className="primary"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <FaEye /> Gunakan
                    </Button>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedTemplate && (
          <TemplateEditor>
            <EditorSection>
              <h3>Form Input</h3>
              <FormGroup>
                <Label>Nomor Surat</Label>
                <Input
                  type="text"
                  name="nomor_surat"
                  value={formData.nomor_surat}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor surat"
                />
              </FormGroup>
              <FormGroup>
                <Label>Tanggal Surat</Label>
                <Input
                  type="date"
                  name="tanggal_surat"
                  value={formData.tanggal_surat}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Tanggal Kirim</Label>
                <Input
                  type="date"
                  name="tanggal_kirim"
                  value={formData.tanggal_kirim}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Ditujukan Kepada</Label>
                <Input
                  type="text"
                  name="ditujukan_kepada"
                  value={formData.ditujukan_kepada}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama penerima"
                />
              </FormGroup>
              <FormGroup>
                <Label>Perihal</Label>
                <Input
                  type="text"
                  name="perihal"
                  value={formData.perihal}
                  onChange={handleInputChange}
                  placeholder="Masukkan perihal surat"
                />
              </FormGroup>
              <FormGroup>
                <Label>Keterangan</Label>
                <TextArea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Masukkan keterangan surat"
                />
              </FormGroup>
              <Button className="success" onClick={handleSave}>
                <FaSave /> Simpan Surat
              </Button>
            </EditorSection>
            <PreviewSection>
              <h3>Preview Surat</h3>
              <div dangerouslySetInnerHTML={{ __html: generatePreview() }} />
            </PreviewSection>
          </TemplateEditor>
        )}
      </Card>
    </Layout>
  );
};

export default TemplateSuratPage; 