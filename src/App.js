// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Main from './Main'; // Assuming you have a Main component for the main content
import Header from './Header'; // Import the Header component

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Header /> {/* Add Header component here */}
      <div className="content">
        <h1>TercihMeta'ya Hoş Geldiniz</h1>
        <p>
          TercihMeta, üniversite tercihlerinizi daha bilinçli yapmanıza yardımcı olmak için burada.
          Geçmiş yıl verilerini ve analitik araçları kullanarak, hangi üniversite ve bölümler için
          uygun olduğunuzu değerlendirin.
        </p>
        <p>Üniversite seçiminde doğru kararlar alarak geleceğinize yön verin.</p>
        <div className="button-group">
          <button className="btn primary" onClick={() => navigate('/login')}>Giriş Yap</button>
          <button className="btn primary" onClick={() => navigate('/signup')}>Kaydol</button>
          <button className="btn secondary" onClick={() => navigate('/main')}>Misafir Olarak Devam Et</button>
        </div>
      </div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} /> {/* Main content page */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
