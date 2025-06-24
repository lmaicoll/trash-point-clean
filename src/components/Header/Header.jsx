import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const handleChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('loginChange', handleChange);
    return () => window.removeEventListener('loginChange', handleChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('loginChange'));
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">TrashPoint</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/map">Mapa</Nav.Link>
            <Nav.Link as={Link} to="/reports/list">
              Reportes
            </Nav.Link>
             <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            {user.role === 1 && (
              <Nav.Link as={Link} to="/admin">Administración</Nav.Link>
            )}
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">
              {user.name}
            </Navbar.Text>
            <Button variant="outline-light" onClick={handleLogout}>Cerrar sesión</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
