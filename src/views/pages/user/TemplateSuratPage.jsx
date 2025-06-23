import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaCheck, FaTimes, FaDownload, FaUpload, FaUndo } from 'react-icons/fa';
import { debounce } from 'lodash';
import Layout from '../../components/Base/Layout';
import Toast from '../../components/Base/Toast';
import SuccessModal from '../../components/Base/SuccessModal';
import useToast from '../../../hooks/useToast';
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
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background-color: #0d6efd;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #0b5ed7;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
    }
  }

  &.secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #5c636a;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
    }
  }

  &.success {
    background-color: #198754;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #157347;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(25, 135, 84, 0.3);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4154f1;
  }
`;

const TemplateSuratPage = () => {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const authUser = useSelector((state) => state.authUser);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedSuratData, setSubmittedSuratData] = useState(null);
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    tanggal_kirim: '',
    ditujukan_kepada: '',
    perihal: '',
    keterangan: '',
    divisi: authUser.divisi,
    lampiran: '',
    tujuan: '',
    lokasi_tujuan: '',
    alasan: '',
    hari_tanggal: '',
    waktu: '',
    tempat: '',
    agenda_items: ['', '', '', ''],
    penerima: '',
    waktu_kedatangan: '',
    nama_petugas: '',
    jabatan_petugas: '',
    tugas: '',
    lokasi_tugas: '',
    waktu_tugas: '',
    durasi_tugas: '',
    bekal_tugas: '',
    tanda_tangan: null,
    nama_penandatangan: '',
    jabatan_penandatangan: ''
  });
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // TODO: Fetch templates from API
    setTemplates([
      {
        id: 1,
        nama: 'Surat Dinas',
        jenis: 'Surat Keluar',
        deskripsi: 'Template untuk surat undangan rapat',
        dibuat: '2024-03-20',
        formFields: [
          { name: 'nomor_surat', label: 'Nomor Surat', type: 'text', required: true },
          { name: 'lampiran', label: 'Lampiran', type: 'text', required: false },
          { name: 'perihal', label: 'Perihal', type: 'text', required: true },
          { name: 'tujuan', label: 'Tujuan', type: 'text', required: true },
          { name: 'lokasi_tujuan', label: 'Lokasi Tujuan', type: 'text', required: true },
          { name: 'alasan', label: 'Alasan', type: 'textarea', required: true },
          { name: 'hari_tanggal', label: 'Hari/Tanggal', type: 'date', required: true },
          { name: 'waktu', label: 'Waktu', type: 'text', required: true },
          { name: 'tempat', label: 'Tempat', type: 'text', required: true },
          { name: 'agenda_items', label: 'Agenda', type: 'dynamic_list', required: true },
          { name: 'penerima', label: 'Penerima', type: 'text', required: true },
          { name: 'waktu_kedatangan', label: 'Waktu Kedatangan', type: 'text', required: true },
          { name: 'tanggal_surat', label: 'Tanggal Surat', type: 'date', required: true },
          { name: 'jabatan_penandatangan', label: 'Jabatan Penandatangan', type: 'text', required: true },
          { name: 'nama_penandatangan', label: 'Nama Penandatangan', type: 'text', required: true },
          { name: 'tanda_tangan', label: 'File Tanda Tangan', type: 'file', required: true, accept: 'image/*' }
        ],
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
                  <p style="margin: 5px 0 2px 30px;">: [Nomor Surat]</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 2px 0;"><strong>Lampiran</strong></p>
                </td>
                <td>
                  <p style="margin: 2px 0 2px 30px;">: [Lampiran]</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 2px 0;"><strong>Perihal</strong></p>
                </td>
                <td>
                  <p style="margin: 2px 0 2px 30px;">: [Perihal]</p>
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
              <p style="margin: 5px 0 2px 0;">[Tujuan]</p>
              <p style="margin: 5px 0 2px 0;">di-</p>
              <p style="margin: 2px 0 2px 0;">[Lokasi Tujuan]</p>
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
                Dalam rangka [Alasan], Komisi Pemilihan Umum Kota Manado akan menyelenggarakan
                rapat koordinasi dengan agenda sebagai berikut:
              </p>

              <div style="margin: 10px 0; padding-left: 40px;">
              <table>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Hari/Tanggal</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Hari/Tanggal]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Waktu</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Waktu]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Tempat</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Tempat]</p>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin-block: 5px;"><strong>Agenda</strong></p>
                  </td>
                  <td style="vertical-align: top; display: flex; gap: 5px;">
                    <p style="margin-left: 15px; margin-block: 5px;">:</p>
                    <ul style="margin-block: 5px; display: flex; flex-direction: column; gap: 5px;">
                      [Agenda Items]
                    </ul>
                  </td>
                </tr>
              </table>
              </div>

              <p style="margin: 10px 0; text-indent: 0; line-height: 1.15;">
                Mengingat pentingnya rapat ini, kami mengharapkan kehadiran [Penerima] atau
                perwakilan yang ditunjuk dengan membawa surat tugas, paling lambat
                [Waktu Kedatangan].
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
              <p style="margin: 5px 0;">Manado, [Tanggal Surat]</p>
              <p style="margin: 5px 0; font-weight: bold;">Komisi Pemilihan Umum Kota Manado</p>
              <p style="margin: 5px 0;"><strong>[Jabatan Penandatangan]</strong></p>
              <div style="display: flex; flex-direction: column; align-items: end; gap: 10px; justify-content: flex-end; margin-top: 5px;">
                <div style="display: flex; flex-direction: column; align-items: end; gap: 5px;">
                  <div style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; align-self: center;">
                    <img src="[Tanda Tangan]" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: end; gap: 10px; justify-content: flex-end;">
                    <p style="margin: 0;"><strong>[Nama Penandatangan]</strong></p>
                  </div>
                </div>
              </div>
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
        formFields: [
          { name: 'nomor_surat', label: 'Nomor Surat', type: 'text', required: true },
          { name: 'perihal', label: 'Perihal', type: 'text', required: true },
          { name: 'nama_petugas', label: 'Nama Petugas', type: 'text', required: true },
          { name: 'jabatan_petugas', label: 'Jabatan Petugas', type: 'text', required: true },
          { name: 'tugas', label: 'Tugas', type: 'textarea', required: true },
          { name: 'lokasi_tugas', label: 'Lokasi Tugas', type: 'text', required: true },
          { name: 'waktu_tugas', label: 'Waktu Tugas', type: 'text', required: true },
          { name: 'durasi_tugas', label: 'Durasi Tugas', type: 'text', required: true },
          { name: 'bekal_tugas', label: 'Bekal Tugas', type: 'textarea', required: false },
          { name: 'tanggal_surat', label: 'Tanggal Surat', type: 'date', required: true },
          { name: 'jabatan_penandatangan', label: 'Jabatan Penandatangan', type: 'text', required: true },
          { name: 'nama_penandatangan', label: 'Nama Penandatangan', type: 'text', required: true },
          { name: 'tanda_tangan', label: 'File Tanda Tangan', type: 'file', required: true, accept: 'image/*' }
        ],
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
                  <p style="margin: 5px 0 2px 30px;">: [Nomor Surat]</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 2px 0;"><strong>Perihal</strong></p>
                </td>
                <td>
                  <p style="margin: 2px 0 2px 30px;">: [Perihal]</p>
                </td>
              </tr>
            </table>
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
                Sehubungan dengan tugas dan fungsi Komisi Pemilihan Umum Kota Manado, maka dengan ini
                kami menugaskan:
              </p>

              <div style="margin: 10px 0; padding-left: 40px;">
              <table>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Nama</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Nama Petugas]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Jabatan</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Jabatan Petugas]</p>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin-block: 5px;"><strong>Tugas</strong></p>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin-left: 15px; margin-block: 5px;">: [Tugas]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Lokasi</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Lokasi Tugas]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Waktu</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Waktu Tugas]</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin-block: 5px;"><strong>Durasi</strong></p>
                  </td>
                  <td>
                    <p style="margin-left: 15px; margin-block: 5px;">: [Durasi Tugas]</p>
                  </td>
                </tr>
              </table>
              </div>

              <p style="margin: 10px 0; text-indent: 40px; line-height: 1.15;">
                [Bekal Tugas]
              </p>

              <p style="margin: 10px 0; text-indent: 0; line-height: 1.15;">
                Demikian surat tugas ini kami sampaikan untuk dapat dilaksanakan dengan sebaik-baiknya.
              </p>
            </div>

            <div 
              class="penutup" 
              style="
                text-align: right; 
                margin-top: 40px;
              "
            >
              <p style="margin: 5px 0;">Manado, [Tanggal Surat]</p>
              <p style="margin: 5px 0; font-weight: bold;">Komisi Pemilihan Umum Kota Manado</p>
              <p style="margin: 5px 0;"><strong>[Jabatan Penandatangan]</strong></p>
              <div style="display: flex; flex-direction: column; align-items: end; gap: 10px; justify-content: flex-end; margin-top: 5px;">
                <div style="display: flex; flex-direction: column; align-items: end; gap: 5px;">
                  <div style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; align-self: center;">
                    <img src="[Tanda Tangan]" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: end; gap: 10px; justify-content: flex-end;">
                    <p style="margin: 0;"><strong>[Nama Penandatangan]</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      }
    ]);
  }, []);

  // Clear signature preview when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        tanda_tangan: null
      }));
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedTemplate?.id]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Reset form data when selecting a new template
    setFormData({
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      ditujukan_kepada: '',
      perihal: '',
      keterangan: '',
      divisi: authUser.divisi,
      lampiran: '',
      tujuan: '',
      lokasi_tujuan: '',
      alasan: '',
      hari_tanggal: '',
      waktu: '',
      tempat: '',
      agenda_items: ['', '', '', ''],
      penerima: '',
      waktu_kedatangan: '',
      nama_petugas: '',
      jabatan_petugas: '',
      tugas: '',
      lokasi_tugas: '',
      waktu_tugas: '',
      durasi_tugas: '',
      bekal_tugas: '',
      tanda_tangan: null,
      nama_penandatangan: '',
      jabatan_penandatangan: ''
    });

    // Reset file input element
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'tanda_tangan' && files) {
      const file = files[0];
      if (file) {
        // Create a preview URL for the signature
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            [name]: e.target.result // Store the data URL
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAgendaChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      agenda_items: prev.agenda_items.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      agenda_items: [...prev.agenda_items, '']
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda_items: prev.agenda_items.filter((_, i) => i !== index)
    }));
  };

  const formatIndonesianDate = (dateString) => {
    if (!dateString) return '[Hari/Tanggal]';
    
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}, ${dateNum} ${month} ${year}`;
  };

  const generatePreview = () => {
    if (!selectedTemplate) return '';
    
    let preview = selectedTemplate.template;
    
    // Replace placeholders with actual data
    const replacements = {
      '[Nomor Surat]': formData.nomor_surat || '[Nomor Surat]',
      '[Lampiran]': formData.lampiran || '[Lampiran]',
      '[Perihal]': formData.perihal || '[Perihal]',
      '[Tujuan]': formData.tujuan || '[Tujuan]',
      '[Lokasi Tujuan]': formData.lokasi_tujuan || '[Lokasi Tujuan]',
      '[Alasan]': formData.alasan || '[Alasan]',
      '[Hari/Tanggal]': formatIndonesianDate(formData.hari_tanggal),
      '[Waktu]': formData.waktu || '[Waktu]',
      '[Tempat]': formData.tempat || '[Tempat]',
      '[Agenda Items]': formData.agenda_items?.map(item => 
        `<li>${item || '[Agenda Item]'}</li>`
      ).join('') || '<li>[Agenda Item]</li>',
      '[Penerima]': formData.penerima || '[Penerima]',
      '[Waktu Kedatangan]': formData.waktu_kedatangan || '[Waktu Kedatangan]',
      '[Tanggal Surat]': formData.tanggal_surat ? formatIndonesianDate(formData.tanggal_surat) : '[Tanggal Surat]',
      '[Jabatan Penandatangan]': formData.jabatan_penandatangan || '[Jabatan Penandatangan]',
      '[Nama Penandatangan]': formData.nama_penandatangan || '[Nama Penandatangan]',
      '[Tanda Tangan]': formData.tanda_tangan || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNDQ0NDQ0MiLz4KPHN2ZyB4PSIyMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5OTk5Ij4KPHBhdGggZD0iTTE5IDNoLTRWMWMwLS41NS0uNDUtMS0xLTFzLTEgLjQ1LTEgMXYySDhjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnpNMTAgMTloLTJ2LTJoMnYyem0wLTZoLTJ2LTJoMnYyem0wLTZoLTJWN2gydjJ6bTQgMTJoLTJ2LTJoMnYyem0wLTZoLTJ2LTJoMnYyem0wLTZoLTJWN2gydjJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K',
      
      // Surat Tugas specific fields
      '[Nama Petugas]': formData.nama_petugas || '[Nama Petugas]',
      '[Jabatan Petugas]': formData.jabatan_petugas || '[Jabatan Petugas]',
      '[Tugas]': formData.tugas || '[Tugas]',
      '[Lokasi Tugas]': formData.lokasi_tugas || '[Lokasi Tugas]',
      '[Waktu Tugas]': formData.waktu_tugas || '[Waktu Tugas]',
      '[Durasi Tugas]': formData.durasi_tugas || '[Durasi Tugas]',
      '[Bekal Tugas]': formData.bekal_tugas || '[Bekal Tugas]'
    };
    
    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      preview = preview.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });
    
    return preview;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
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
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm
      
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

      // Create form data with required backend fields
      const formDataToSend = new FormData();
      formDataToSend.append('file', pdfBlob, 'surat.pdf');
      
      // Required fields for backend (mapping from template data)
      formDataToSend.append('nomor_surat', formData.nomor_surat);
      formDataToSend.append('tanggal_surat', formData.tanggal_surat);
      formDataToSend.append('tanggal_kirim', formData.tanggal_surat); // Use tanggal_surat as tanggal_kirim
      formDataToSend.append('ditujukan_kepada', 
        selectedTemplate.id === 1 ? formData.tujuan : formData.nama_petugas
      );
      formDataToSend.append('perihal', formData.perihal);
      formDataToSend.append('divisi', authUser.divisi);
      
      // Combine template-specific data into keterangan
      let keterangan = '';
      if (selectedTemplate.id === 1) {
        // Surat Undangan
        keterangan = `${formData.alasan}`;
      } else if (selectedTemplate.id === 2) {
        // Surat Tugas
        keterangan = `${formData.tugas}`;
      }
      formDataToSend.append('keterangan', keterangan);

      // Send to API
      const response = await _fetchWithAuth(`${BASE_URL}/surat-keluar/`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save surat');
      }

      // Set success data and show modal
      setSubmittedSuratData({
        nomor_surat: formData.nomor_surat,
        perihal: formData.perihal,
        ditujukan_kepada: selectedTemplate.id === 1 ? formData.tujuan : formData.nama_petugas,
        tanggal_surat: formData.tanggal_surat,
        template_name: selectedTemplate.nama
      });
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error saving surat:', err);
      showError('Gagal!', err.message || 'Terjadi kesalahan saat menyimpan surat');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSubmittedSuratData(null);
    // Reset form
    handleResetForm();
  };

  const handleSuccessNavigate = () => {
    setShowSuccessModal(false);
    setSubmittedSuratData(null);
    navigate('/surat-keluar');
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
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm
      
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

  const renderFormFields = () => {
    if (!selectedTemplate) return null;

    return selectedTemplate.formFields.map((field) => (
      <FormGroup key={field.name} style={{ marginBottom: '10px' }}>
        <Label>
          {field.label}
          {field.required && <span style={{ color: 'red' }}> *</span>}
        </Label>
        {field.type === 'file' ? (
          <div>
            <Input
              ref={fileInputRef}
              type={field.type}
              name={field.name}
              onChange={handleInputChange}
              accept={field.accept}
              required={field.required}
              key={`${selectedTemplate.id}-${field.name}`}
            />
            {formData[field.name] && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData[field.name]} 
                  alt="Preview Tanda Tangan" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '100px', 
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            )}
          </div>
        ) : field.type === 'dynamic_list' ? (
          <div>
            {formData.agenda_items?.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
                <Input
                  type="text"
                  value={item}
                  onChange={(e) => handleAgendaChange(index, e.target.value)}
                  placeholder={`Agenda ${index + 1}`}
                  style={{ flex: 1 }}
                />
                {formData.agenda_items.length > 1 && (
                  <Button 
                    type="button" 
                    onClick={() => removeAgendaItem(index)}
                    style={{ 
                      padding: '5px 10px', 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              onClick={addAgendaItem}
              style={{ 
                padding: '5px 10px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '5px'
              }}
            >
              + Tambah Agenda
            </Button>
          </div>
        ) : field.type === 'textarea' ? (
          <TextArea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            required={field.required}
          />
        ) : (
          <Input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            required={field.required}
          />
        )}
      </FormGroup>
    ));
  };

  const handleResetForm = () => {
    setFormData({
      nomor_surat: '',
      tanggal_surat: '',
      tanggal_kirim: '',
      ditujukan_kepada: '',
      perihal: '',
      keterangan: '',
      divisi: authUser.divisi,
      lampiran: '',
      tujuan: '',
      lokasi_tujuan: '',
      alasan: '',
      hari_tanggal: '',
      waktu: '',
      tempat: '',
      agenda_items: ['', '', '', ''],
      penerima: '',
      waktu_kedatangan: '',
      nama_petugas: '',
      jabatan_petugas: '',
      tugas: '',
      lokasi_tugas: '',
      waktu_tugas: '',
      durasi_tugas: '',
      bekal_tugas: '',
      tanda_tangan: null,
      nama_penandatangan: '',
      jabatan_penandatangan: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onNavigate={handleSuccessNavigate}
        suratData={submittedSuratData}
        title="Surat Berhasil Dibuat!"
        message={`Surat ${submittedSuratData?.template_name} telah berhasil dibuat dan disimpan ke dalam sistem`}
        navigateText="Lihat Daftar Surat"
        autoNavigate={false}
        autoNavigateDelay={3000}
      />
      
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
            {templates.map((template) => (
              <tr key={template.id}>
                <td>{template.nama}</td>
                <td>{template.jenis}</td>
                <td>{template.deskripsi}</td>
                <td>{template.dibuat}</td>
                <td>
                  {template.id === selectedTemplate?.id ? (
                    <Button className="success" disabled onClick={() => handleTemplateSelect(template)}>
                      <FaCheck /> Digunakan
                    </Button>
                  ) : (
                    <Button className="primary" onClick={() => handleTemplateSelect(template)}>
                      Gunakan
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <div style={{ width: '100%', height: '1px', backgroundColor: '#000', margin: '20px 0' }}></div>
        </div>

        {selectedTemplate && (
          <div className="template-editor" style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'space-between' }}>
            <div className="editor-section" style={{flex: 0.6}}>
              <h3 style={{marginBottom: '20px' ,borderBottom: '1px solid #000', paddingBottom: '10px'}}>
                Form Surat - {selectedTemplate.nama}
              </h3>
              {renderFormFields()}
              <ActionButtons>
                <Button className="success" onClick={handleSave} disabled={loading}>
                  <FaUpload /> {loading ? 'Menyimpan...' : 'Upload ke Sistem'}
                </Button>
                <Button className="primary" onClick={handleDownload}>
                  <FaDownload /> Download PDF
                </Button>
                <Button className="secondary" onClick={handleResetForm}>
                  <FaUndo /> Reset Form
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