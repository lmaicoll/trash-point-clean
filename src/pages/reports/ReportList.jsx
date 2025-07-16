import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  Spinner,
  Badge,
  Form,
  Row,
  Col,
  Pagination,
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { ReportEditModal } from './ReportEditModal';
import { FaMapMarkerAlt, FaTrashAlt } from 'react-icons/fa';

export const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/reports`);
      const usersRes = await axios.get(`${API_BASE_URL}/users`);
      const users = usersRes.data;

      // Relacionar reportes con nombres de usuarios
      const reportsWithUsers = data.map((r) => {
        const user = users.find((u) => u.id === r.user_id);
        return {
          ...r,
          user_name: user ? user.name : `Usuario ${r.user_id}`
        };
      });

      const sorted = reportsWithUsers.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setReports(currentUser.role === 1
        ? sorted
        : sorted.filter((r) => r.user_id === currentUser.id)
      );
    } catch (e) {
      console.error('Error al obtener reportes:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (report) => {
    try {
      const newStatus = report.status === 'solucionado' ? 'pendiente' : 'solucionado';
      await axios.put(`${API_BASE_URL}/reports/${report.id}`, {
        ...report,
        status: newStatus
      });
      fetchReports();
    } catch {
      alert('Error al cambiar el estado del reporte');
    }
  };

  const deleteReport = async (report) => {
    if (!window.confirm('¿Estás seguro de eliminar este reporte?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/reports/${report.id}`);
      setAlert('Reporte eliminado correctamente');
      fetchReports();
      setTimeout(() => setAlert(''), 3000);
    } catch {
      alert('Error al eliminar el reporte');
    }
  };

  const handleSaveEdit = async (updatedReport) => {
    try {
      await axios.put(`${API_BASE_URL}/reports/${updatedReport.id}`, updatedReport);
      setAlert('Reporte actualizado correctamente');
      setShowEditModal(false);
      fetchReports();
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
    }
  };

  const openLocationModal = (report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const capitalizeFirstLetter = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const filteredReports = reports.filter((r) =>
    (!searchText ||
      r.description.toLowerCase().includes(searchText.toLowerCase()) ||
      `${r.id}`.includes(searchText)) &&
    (!searchStatus || r.status.toLowerCase().includes(searchStatus.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de reportes</h2>
        <Button variant="primary" onClick={() => navigate('/report/create')}>
          Crear nuevo reporte
        </Button>
      </div>

      {alert && <Alert variant="success">{alert}</Alert>}

      <Row className="mb-3">
        <Col md={6} sm={12} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Buscar por # o descripción..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={6} sm={12}>
          <Form.Select
            value={searchStatus}
            onChange={(e) => {
              setSearchStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="solucionado">Solucionado</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Descripción</th>
                <th>Dirección</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((r) => (
                <tr
                  key={r.id}
                  className={r.status === 'solucionado' ? 'table-success' : 'table-secondary'}
                >
                  <td>{r.id}</td>
                  <td>{r.description}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => openLocationModal(r)}
                    >
                      <FaMapMarkerAlt /> Ver dirección
                    </Button>
                  </td>
                  <td>{r.user_name}</td>
                  <td className="text-center">
                    <Badge
                      bg={r.status === 'solucionado' ? 'success' : 'warning'}
                      className="text-capitalize"
                    >
                      {capitalizeFirstLetter(r.status)}
                    </Badge>
                  </td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td className="text-center">
                    {(currentUser.role === 1 || currentUser.id === r.user_id) && (
                      <>
                        <Button
                          size="sm"
                          variant="info"
                          className="me-2 mb-1"
                          onClick={() => {
                            setSelectedReport(r);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={r.status === 'solucionado' ? 'success' : 'warning'}
                          className="me-2 mb-1 text-capitalize"
                          onClick={() => toggleStatus(r)}
                        >
                          {capitalizeFirstLetter(
                            r.status === 'solucionado' ? 'solucionado' : 'pendiente'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteReport(r)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </div>
      )}

      <ReportEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        report={selectedReport}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
