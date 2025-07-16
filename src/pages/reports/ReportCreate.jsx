// src/pages/reports/ReportCreate.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import MapComponent from '../../components/Map/MapComponent';

export const ReportCreate = () => {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    image: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return setError('Usuario no autenticado');
    if (!marker || !address) return setError('Selecciona una ubicación válida en el mapa.');

    try {
      let base64Image = 'https://via.placeholder.com/150?text=Sin+imagen';
      if (formData.image) {
        base64Image = await convertToBase64(formData.image);
      }

      const data = {
        user_id: user.id,
        description: formData.description,
        latitude: marker.lat,
        longitude: marker.lng,
        address,
        status: 'pendiente',
        created_at: new Date().toISOString(),
        image_url: base64Image
      };

      await axios.post(`${API_BASE_URL}/reports`, data);
      setSuccess(true);
      setTimeout(() => navigate('/reports/list'), 1500);
    } catch (err) {
      setError('Error al crear el reporte');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Nuevo Reporte</h2>
      <p>Registra un punto crítico de basura o escombro.</p>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Reporte creado con éxito</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <MapComponent marker={marker} setMarker={setMarker} setAddress={setAddress} />
          {address && (
            <Form.Text className="text-muted d-block mt-2">
              Dirección detectada: {address}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imagen (opcional)</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary">Registrar Reporte</Button>
      </Form>
    </div>
  );
};
