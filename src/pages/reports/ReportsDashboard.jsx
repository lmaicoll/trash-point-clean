import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Table, Form, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaListAlt } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reportsRes = await axios.get(`${API_BASE_URL}/reports`);
      const usersRes = await axios.get(`${API_BASE_URL}/users`);
      setUsers(usersRes.data);

      const sorted = reportsRes.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setReports(
        currentUser.role === 1
          ? sorted
          : sorted.filter((r) => r.user_id === currentUser.id)
      );
    } catch (e) {
      console.error('Error al obtener datos', e);
    } finally {
      setLoading(false);
    }
  };

  const total = reports.length;
  const activos = reports.filter((r) => r.status !== 'solucionado').length;
  const solucionados = reports.filter((r) => r.status === 'solucionado').length;

  const filtered = reports.filter(
    (r) =>
      (!statusFilter || r.status === statusFilter) &&
      (!userFilter || `${r.user_id}` === userFilter)
  );

  const chartData = [
    { name: 'Pendientes', count: activos, status: 'pendiente' },
    { name: 'Solucionados', count: solucionados, status: 'solucionado' }
  ];

  const uniqueUsers = [
    ...new Set(
      reports.map((r) => {
        const user = users.find((u) => `${u.id}` === `${r.user_id}`);
        return user ? user : { id: r.user_id, name: `Usuario ${r.user_id}` };
      })
    )
  ];

  const getUserName = (id) => {
    const user = users.find((u) => `${u.id}` === `${id}`);
    return user ? user.name : `Usuario ${id}`;
  };

  const capitalizeFirstLetter = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard de Reportes</h2>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Cards */}
          <Row className="mb-4">
            <Col md={4}>
              <Card bg="primary" text="white" className="text-center">
                <Card.Body>
                  <FaListAlt size={30} />
                  <Card.Title>Total: {total}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card bg="warning" text="dark" className="text-center">
                <Card.Body>
                  <FaClock size={30} />
                  <Card.Title>Activos: {activos}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card bg="success" text="white" className="text-center">
                <Card.Body>
                  <FaCheckCircle size={30} />
                  <Card.Title>Solucionados: {solucionados}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filtros */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filtrar por estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="solucionado">Solucionado</option>
              </Form.Select>
            </Col>
            {currentUser.role === 1 && (
              <Col md={6}>
                <Form.Select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <option value="">Filtrar por usuario</option>
                  {uniqueUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            )}
          </Row>

          {/* Gráfica */}
          <Row className="mb-4">
            <Col>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.status === 'pendiente' ? '#ffc107' : '#28a745'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>

          {/* Tabla Últimos reportes */}
          <h5>Últimos reportes</h5>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.description}</td>
                  <td>{getUserName(r.user_id)}</td>
                  <td>
                    <Badge
                      bg={r.status === 'solucionado' ? 'success' : 'warning'}
                    >
                      {capitalizeFirstLetter(r.status)}
                    </Badge>
                  </td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};
