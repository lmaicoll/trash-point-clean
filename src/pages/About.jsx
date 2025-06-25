import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Badge } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const About = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/reports`)
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  const activos = reports.filter(r => r.status === 'pendiente').length;
  const solucionados = reports.filter(r => r.status === 'solucionado').length;
  const total = reports.length;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">¿Qué es Trash Point?</h1>
      <p className="text-center mb-5">
        Trash Point es una plataforma ciudadana para reportar, visualizar y solucionar puntos críticos de residuos en tu ciudad. 
        Con ayuda de mapas interactivos y datos en tiempo real, buscamos promover la participación ciudadana en la gestión de residuos.
      </p>


      <h2 className="text-center mb-4">Estadísticas generales</h2>
      <Row className="text-center">
        <Col md={4}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3><Badge bg="info">{total}</Badge></h3>
              <Card.Text>Total de reportes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3><Badge bg="warning">{activos}</Badge></h3>
              <Card.Text>Reportes activos</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3><Badge bg="success">{solucionados}</Badge></h3>
              <Card.Text>Reportes solucionados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
