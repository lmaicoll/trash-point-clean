import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import MapComponent from '../../components/Map/MapComponent';

export const ReportEditModal = ({
  show, readonly = false, report, onSave, handleClose
}) => {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setDescription(report.description || '');
      setImageUrl(report.image_url || '');
      const lat = parseFloat(report.latitude), lng = parseFloat(report.longitude);
      setMarker(!isNaN(lat) && !isNaN(lng) ? { lat, lng } : null);
      setAddress(report.address || '');
      setAlertMsg('');
    }
  }, [report]);

  const handleSubmit = async () => {
    if (!marker || isNaN(marker.lat) || isNaN(marker.lng)) {
      setAlertMsg('Coordenadas inválidas. Selecciona un punto válido.');
      return;
    }
    setLoading(true);
    const updated = {
      ...report,
      description,
      image_url: imageUrl,
      latitude: marker.lat,
      longitude: marker.lng,
      address
    };
    try {
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
            as="textarea" rows={3}
            value={description}
            disabled={readonly}
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL imagen</Form.Label>
          <Form.Control
            type="text" value={imageUrl}
            disabled={readonly}
            onChange={e => setImageUrl(e.target.value)}
          />
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
          <Form.Control
            type="text" value={address}
            readOnly
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        {!readonly && (
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Guardar Cambios'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
