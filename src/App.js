import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Escuchar eventos personalizados para actualizar estado de login
  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('loginChange', handleLogin);
    return () => window.removeEventListener('loginChange', handleLogin);
  }, []);

  return (
    <BrowserRouter>
      {user && <Header />}
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
