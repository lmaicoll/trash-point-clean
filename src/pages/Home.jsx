import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Body className="text-center p-5">
          <h1 className="display-5 fw-bold text-primary">Bienvenido a Trash Point App</h1>
          <p className="lead mt-3">
            Trash Point es una plataforma digital creada para transformar la gestión de basuras y escombros en Bogotá. 
            Nuestro objetivo es reducir los residuos mal dispuestos en el espacio público, que generan malos olores, 
            obstruyen vías, contaminan el suelo y afectan la salud de todos.
          </p>
          <p className="text-muted">
            Con nuestra aplicación puedes <strong>reportar puntos críticos de acumulación de residuos</strong>, 
            solicitar su recolección de manera ágil y consultar en un 
            <strong> mapa interactivo</strong> los sitios autorizados para la disposición de escombros. 
            Así ayudamos a mantener la ciudad más limpia y a optimizar el trabajo de las entidades encargadas.
          </p>

          <Row className="mt-4">
            <Col md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold text-success">🌱 Beneficios</h5>
                  <ul className="text-start">
                    <li>Reducimos la contaminación en zonas urbanas.</li>
                    <li>Ayudamos a prevenir enfermedades.</li>
                    <li>Recuperamos espacios públicos para todos.</li>
                    <li>Contribuimos a una ciudad más limpia y ordenada.</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold text-info">📌 Cómo funciona</h5>
                  <ul className="text-start">
                    <li>Regístrate e inicia sesión en la plataforma.</li>
                    <li>Reporta un punto crítico de basura o escombros.</li>
                    <li>Consulta el mapa interactivo con los reportes.</li>
                    <li>Haz seguimiento al estado de tus reportes.</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/report/create')}>
              📍 Crear nuevo reporte
            </Button>{' '}
            <Button variant="outline-success" size="lg" onClick={() => navigate('/map')}>
              🌍 Ver mapa interactivo
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
