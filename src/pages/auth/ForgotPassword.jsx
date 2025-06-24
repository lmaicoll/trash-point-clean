import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuthStyles.css';
import API_BASE_URL from '../../config/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`);
      const user = data.find(u => u.email === email);

      if (user) {
        setUserFound(user);
        setError(null);
      } else {
        setUserFound(null);
        setError('No se encontró un usuario con ese correo');
      }
    } catch (err) {
      console.error(err);
      setError('Error al buscar el usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Recuperar contraseña</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Recuperar
          </Button>
        </Form>

        {userFound && (
          <Alert variant="success" className="mt-3">
            Usuario encontrado: <strong>{userFound.name}</strong>
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <Link to="/login" className="auth-link">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
};
