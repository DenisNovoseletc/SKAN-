import React from 'react';
// Импортируем HashRouter вместо BrowserRouter
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';

// Стили
import './styles.css';
import SearchForm from './pages/SearchForm';

// Создаем компонент Main для маршрутов
const Main: React.FC = () => {
  return (
    <main className="main">
      <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchForm />} />        
      </Routes>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Router> {/* Вот здесь меняем на HashRouter */}
      <AuthProvider>
        <Header />
        <Main /> 
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
