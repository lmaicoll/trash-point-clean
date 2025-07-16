// src/pages/reports/ReportEditModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import MapComponent from '../../components/Map/MapComponent';

export const ReportEditModal = ({
  show,
  readonly = false,
  report,
  onSave,
  handleClose
}) => {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setDescription(report.description || '');
      setImageUrl(report.image_url || '');
      setNewImage(null);
      const lat = parseFloat(report.latitude),
        lng = parseFloat(report.longitude);
      setMarker(!isNaN(lat) && !isNaN(lng) ? { lat, lng } : null);
      setAddress(report.address || '');
      setAlertMsg('');
    }
  }, [report]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!marker || isNaN(marker.lat) || isNaN(marker.lng)) {
      setAlertMsg('Coordenadas inválidas. Selecciona un punto válido.');
      return;
    }

    setLoading(true);
    let finalImageUrl = imageUrl;

    try {
      if (newImage) {
        finalImageUrl = await convertToBase64(newImage);
      }

      const updated = {
        ...report,
        description,
        image_url: finalImageUrl,
        latitude: marker.lat,
        longitude: marker.lng,
        address
      };

      await onSave(updated);
    } catch {
      setAlertMsg('Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {readonly ? `Reporte #${report?.id}` : `Editar Reporte #${report?.id}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMsg && <Alert variant="danger">{alertMsg}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            disabled={readonly}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imagen actual</Form.Label>
          <div className="mb-2">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Reporte"
                thumbnail
                style={{ maxHeight: '150px' }}
              />
            ) : (
              <p className="text-muted">No hay imagen cargada</p>
            )}
          </div>
          {!readonly && (
            <>
              <Form.Label>Cargar nueva imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <MapComponent
            marker={marker}
            setMarker={readonly ? undefined : setMarker}
            setAddress={readonly ? undefined : setAddress}
            readonly={readonly}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control type="text" value={address} readOnly />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        {!readonly && (
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Guardar Cambios'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
