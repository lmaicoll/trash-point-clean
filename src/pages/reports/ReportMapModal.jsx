// src/pages/ReportMapModal.jsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export const ReportMapModal = ({ show, onHide, report }) => {
  const position = [parseFloat(report?.latitude), parseFloat(report?.longitude)];

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ubicación del Reporte #{report?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {report?.address && (
          <p><strong>Dirección:</strong> {report.address}</p>
        )}
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <Marker position={position} />
          </MapContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
};
