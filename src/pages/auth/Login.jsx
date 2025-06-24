import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      const user = res.data.find(
        u => u.email === form.email && u.password === form.password
      );

      if (user) {
        if (user.status !== 1) {
          setError('Tu cuenta está inactiva. Contacta al administrador.');
        } else {
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('loginChange'));
          navigate('/');
        }
      } else {
        setError('Credenciales incorrectas');
      }
    } catch {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Iniciar sesión</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Ingresar
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
            <br />
            ¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala</a>
          </small>
        </div>
      </div>
    </div>
  );
};
