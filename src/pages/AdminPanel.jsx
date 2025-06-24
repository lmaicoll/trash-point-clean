import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Table, Button, Spinner, Form, Row, Col, Pagination } from 'react-bootstrap';
import { UserEditModal } from '../components/Admin/UserEditModal';

export const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/users/${user.id}`, {
        ...user,
        status: user.status === 1 ? 0 : 1
      });
      fetchUsers();
    } catch (error) {
      console.error('Error al actualizar estado del usuario', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${updatedUser.id}`, updatedUser);
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar cambios', error);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    if (search.trim() !== '') {
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      const statusValue = statusFilter === 'active' ? 1 : 0;
      result = result.filter(u => u.status === statusValue);
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, statusFilter, users]);

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>
      <p>Lista de usuarios registrados:</p>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u, index) => (
                <tr key={u.id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 1 ? 'Administrador' : 'Usuario'}</td>
                  <td>
                    <span className={`badge bg-${u.status === 1 ? 'success' : 'secondary'}`}>
                      {u.status === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(u)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant={u.status === 1 ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => toggleStatus(u)}
                      disabled={u.id === currentUser.id}
                    >
                      {u.status === 1 ? 'Desactivar' : 'Activar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Paginación */}
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          <UserEditModal
            show={showModal}
            onHide={() => setShowModal(false)}
            user={selectedUser}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
};
