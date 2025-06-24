// src/pages/reports/ReportList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Table, Spinner, Badge, Form, Row, Col, Pagination, Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { ReportEditModal } from './ReportEditModal';
import { FaMapMarkerAlt, FaTrashAlt } from 'react-icons/fa';

export const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/reports`);
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReports(currentUser.role === 1 ? sorted : sorted.filter(r => r.user_id === currentUser.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const openView = r => {
    const lat = parseFloat(r.latitude), lng = parseFloat(r.longitude);
    if (!r.address || isNaN(lat) || isNaN(lng)) {
      alert('Ubicación no disponible o inválida.');
      return;
    }
    setSelected(r);
    setShowView(true);
  };

  const openEdit = r => {
    setSelected(r);
    setShowEdit(true);
  };

  const handleSave = async upd => {
    await axios.put(`${API_BASE_URL}/reports/${upd.id}`, upd);
    setAlertMsg('Reporte actualizado');
    setShowEdit(false);
    fetchReports();
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const deleteReport = async r => {
    if (!window.confirm('Eliminar reporte?')) return;
    await axios.delete(`${API_BASE_URL}/reports/${r.id}`);
    setAlertMsg('Reporte eliminado');
    fetchReports();
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const toggleStatus = async r => {
    const newStatus = r.status === 'pendiente' ? 'solucionado' : 'pendiente';
    await axios.put(`${API_BASE_URL}/reports/${r.id}`, {
      ...r,
      status: newStatus
    });
    setAlertMsg(`Estado cambiado a "${newStatus}"`);
    fetchReports();
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const filtered = reports.filter(r =>
    (!searchText || r.description.toLowerCase().includes(searchText.toLowerCase()) || `${r.id}`.includes(searchText)) &&
    (!searchStatus || r.status === searchStatus)
  );
  const pages = Math.ceil(filtered.length / perPage);
  const display = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Lista de reportes</h2>
        <Button onClick={() => navigate('/report/create')}>Crear nuevo reporte</Button>
      </div>

      {alertMsg && <Alert variant="success">{alertMsg}</Alert>}

      <Row className="mb-3">
        <Col><Form.Control placeholder="Buscar..." value={searchText} onChange={e => { setSearchText(e.target.value); setPage(1); }} /></Col>
        <Col>
          <Form.Select value={searchStatus} onChange={e => { setSearchStatus(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="solucionado">Solucionado</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? <Spinner /> :
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th><th>Desc</th><th>Dirección</th><th>Imagen</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {display.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.description}</td>
                <td>
                  <Button size="sm" onClick={() => openView(r)}>
                    <FaMapMarkerAlt /> Ver ubicación
                  </Button>
                </td>
                <td><a href={r.image_url} target="_blank" rel="noreferrer">Ver</a></td>
                <td><Badge bg={r.status === 'solucionado' ? 'success' : 'warning'}>{r.status}</Badge></td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  {(currentUser.role === 1 || r.user_id === currentUser.id) && (
                    <>
                      <Button size="sm" onClick={() => openEdit(r)}>Editar</Button>{' '}
                      <Button size="sm" variant={r.status==='pendiente'?'success':'secondary'} 
                              onClick={() => toggleStatus(r)}>
                        {r.status === 'pendiente' ? 'Marcar como solucionado' : 'Marcar pendiente'}
                      </Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => deleteReport(r)}>
                        <FaTrashAlt />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }

      {pages > 1 && <Pagination>
        {Array.from({ length: pages }, (_, i) =>
          <Pagination.Item key={i+1} active={i+1 === page} onClick={() => setPage(i+1)}>
            {i+1}
          </Pagination.Item>
        )}
      </Pagination>}

      <ReportEditModal
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        report={selected}
        onSave={handleSave}
      />

      <ReportEditModal
        show={showView}
        readonly={true}
        handleClose={() => setShowView(false)}
        report={selected}
        onSave={() => {}}
      />
    </div>
  );
};
