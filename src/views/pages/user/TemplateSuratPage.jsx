import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaCheck, FaTimes, FaDownload, FaUpload } from 'react-icons/fa';
import { debounce } from 'lodash';
import Layout from '../../components/Base/Layout';
import { BASE_URL } from '../../../globals/config';
import { _fetchWithAuth } from '../../../utils/auth_helper';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';

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
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: all 0.3s ease;

  &.primary {
    background-color: #0d6efd;
    color: white;
  }

  &.secondary {
    background-color: #6c757d;
    color: white;
  }

  &.success {
    background-color: #198754;
    color: white;
  }

  &:hover {
    opacity: 0.9;
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
  const user = useSelector((state) => state.authUser);
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
  const previewRef = useRef(null);
  
  useEffect(() => {
    // TODO: Fetch templates from API
    setTemplates([
      {
        id: 1,
        nama: 'Surat Tugas',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat penugasan',
        dibuat: '2024-03-19',
        template: `
          <div 
            class="surat" 
            style="
              width: 210mm;
              min-height: 297mm;
              padding: 2.54cm;
              margin: 0;
              border: 1px solid #000;
              box-sizing: border-box;
              font-family: 'Times New Roman', Times, serif;
              font-size: 12pt;
              line-height: 1.15;
            "
          >
            <div 
              class="header" 
              style="
                text-align: center; 
                margin-bottom: 10px;
                border-bottom: 1px solid #000;
                padding-top: 80px;
                padding-bottom: 10px;
                position: relative;
              "
            >
            <img src="/logo_kpu.png" alt="KPU Logo" className="logo" style="width: 90px; height: 90px; margin-bottom: 20px; position: absolute; top: -30px; left: 50%; transform: translateX(-50%);"/>
              <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase;">
                KOMISI PEMILIHAN UMUM KOTA MANADO
              </h2>
              <p style="margin: 5px 0 0 0;">Jalan Balai Kota No. 1, Manado, Sulawesi Utara 95111</p>
              <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <p style="margin: 5px 0 0 0;">Telp. (0431) 841346</p>
                <p style="margin: 5px 0 0 0;">Fax. (0431) 841346</p>
              </div>
            </div>

            <div 
              class="info-surat" 
              style="
                margin-top: 20px; 
                margin-bottom: 20px;
              "
            >
            <table>
              <tr>
                <td>
                  <p style="margin: 5px 0 2px;"><strong>Nomor</strong></p>
                </td>
                <td>
                  <p style="margin: 5px 0 2px 30px;">: {{nomor_surat}}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 2px 0;"><strong>Lampiran</strong></p>
                </td>
                <td>
                  <p style="margin: 2px 0 2px 30px;">: {{lampiran}}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 2px 0;"><strong>Perihal</strong></p>
                </td>
                <td>
                  <p style="margin: 2px 0 2px 30px;">: {{perihal}}</p>
                </td>
              </tr>
            </table>
            </div>

            <div 
              class="tujuan-surat" 
              style="
                margin-bottom: 20px;
              "
            >
              <p style="margin: 5px 0 2px 0;">Kepada Yth.</p>
              <p style="margin: 5px 0 2px 0;">{{tujuan}}</p>
              <p style="margin: 5px 0 2px 0;">di-</p>
              <p style="margin: 2px 0 2px 0;">{{lokasi_tujuan}}</p>
            </div>

            <div 
              class="isi-surat" 
              style="
                margin-bottom: 20px;
                text-align: justify;
              "
            >
              <p style="margin: 10px 0 5px 0;">Dengan hormat,</p>
              <p style="margin: 5px 0; text-indent: 40px; line-height: 1.15;">
                Dalam rangka {{alasan}}, Komisi Pemilihan Umum Kota Manado akan menyelenggarakan
                rapat koordinasi dengan agenda sebagai berikut:
              </p>

              <div style="margin: 10px 0; padding-left: 40px;">
              <table>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Hari/Tanggal</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: {{hari_tanggal}}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Waktu</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: {{waktu}}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Tempat</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: {{tempat}}</p>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin-block: 5px;"><strong>Agenda</strong></p>
                  </td>
                  <td style="vertical-align: top; display: flex; gap: 5px;">
                    <p style="margin-left: 15px; margin-block: 5px;">:</p>
                    <ul style="margin-block: 5px; display: flex; flex-direction: column; gap: 5px;">
                      <li> {{agenda_1}}</li>
                      <li> {{agenda_2}}</li>
                      <li> {{agenda_3}}</li>
                      <li> {{agenda_4}}</li>
                    </ul>
                  </td>
                </tr>
              </table>
              </div>

              <p style="margin: 10px 0; text-indent: 0; line-height: 1.15;">
                Mengingat pentingnya rapat ini, kami mengharapkan kehadiran {{penerima}} atau
                perwakilan yang ditunjuk dengan membawa surat tugas, paling lambat
                {{waktu_kedatangan}}.
              </p>

              <p style="margin: 10px 0; text-indent: 0; line-height: 1.15;">
                Demikian surat undangan ini kami sampaikan. Atas perhatian dan kerja sama
                Bapak/Ibu/Saudara/i, kami ucapkan terima kasih.
              </p>
            </div>

            <div 
              class="penutup" 
              style="
                text-align: right; 
                margin-top: 40px;
              "
            >
              <p style="margin: 5px 0;">Manado, {{tanggal_surat}}</p>
              <p style="margin: 5px 0;"><strong>Komisi Pemilihan Umum Kota Manado</strong></p>
              <p style="margin: 60px 0 0 0;"><strong>Juan Johanis Derry</strong></p>
              <p style="margin: 0;">NIP 19013008</p>
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
    try {
      if (!previewRef.current) {
        throw new Error('Preview element not found');
      }

      // Generate PDF from preview
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in cm
      const imgHeight = 297;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0, // x position
        0, // y position
        imgWidth,
        imgHeight
      );

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');

      // Create form data
      const formDataToSend = new FormData();
      formDataToSend.append('file', pdfBlob, 'surat.pdf');
      formDataToSend.append('nomor_surat', formData.nomor_surat);
      formDataToSend.append('tanggal_surat', formData.tanggal_surat);
      formDataToSend.append('tanggal_kirim', formData.tanggal_kirim);
      formDataToSend.append('ditujukan_kepada', formData.ditujukan_kepada);
      formDataToSend.append('perihal', formData.perihal);
      formDataToSend.append('keterangan', formData.keterangan || '');

      // Log the form data for debugging
      console.log('Sending form data:', {
        nomor_surat: formData.nomor_surat,
        tanggal_surat: formData.tanggal_surat,
        tanggal_kirim: formData.tanggal_kirim,
        ditujukan_kepada: formData.ditujukan_kepada,
        perihal: formData.perihal,
        keterangan: formData.keterangan
      });

      // Send to API
      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save surat');
      }

      // Show success message
      alert('Surat berhasil disimpan');
      
      // Navigate back
      navigate('/surat-keluar');
    } catch (err) {
      console.error('Error saving surat:', err);
      alert('Gagal menyimpan surat: ' + err.message);
    }
  };

  const handleDownload = async () => {
    try {
      if (!previewRef.current) {
        throw new Error('Preview element not found. Please make sure the preview is loaded.');
      }

      // Create canvas from the element
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in cm
      const imgHeight = 297;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0, // x position
        0, // y position
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save('surat.pdf');

    } catch (err) {
      console.error('Error downloading surat:', err);
      alert('Gagal mengunduh surat. Silakan coba lagi.');
    }
  };

  return (
    <Layout>
      <Card>
        
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
                  <Button className="primary" onClick={() => handleTemplateSelect(template)}>
                    <FaCheck /> Gunakan
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          {/* divider line */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#000', margin: '20px 0' }}></div>
        </div>

        {selectedTemplate && (
          <div className="template-editor" style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'space-between' }}>
            <div className="editor-section" style={{flex: 0.6}}>
              <h3 style={{marginBottom: '20px' ,borderBottom: '1px solid #000', paddingBottom: '10px'}}>Form Surat</h3>
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
                  placeholder="Masukkan ditujukan kepada"
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
                <Input
                  as="textarea"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Masukkan keterangan (opsional)"
                />
              </FormGroup>
              <ActionButtons>
                <Button className="success" onClick={handleSave}>
                  <FaUpload /> Upload ke Sistem
                </Button>
                <Button className="primary" onClick={handleDownload}>
                  <FaDownload /> Download PDF
                </Button>
                <Button className="secondary" onClick={() => setSelectedTemplate(null)}>
                  <FaTimes /> Batal
                </Button>
              </ActionButtons>
            </div>
            <div className="preview-section" style={{flex: 1}}>
              <h3 style={{marginBottom: '20px' ,borderBottom: '1px solid #000', paddingBottom: '10px'}}>Preview Surat</h3>
              <div 
                ref={previewRef}
                style={{
                  margin: '0px',
                  padding: '0px',
                }}
                dangerouslySetInnerHTML={{ __html: generatePreview() }} 
              />
              
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default TemplateSuratPage; 