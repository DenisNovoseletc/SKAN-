import React, { useState } from 'react';
import axios from 'axios'; 
import '../styles/login.css';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const Login: React.FC = () => {  
  const { login } = useAuth();
  const navigate = useNavigate(); // Создаем экземпляр navigate
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsFormValid(e.target.value.trim() !== '' && password.trim() !== '');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsFormValid(username.trim() !== '' && e.target.value.trim() !== '');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://gateway.scan-interfax.ru/api/v1/account/login', {
        login: username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Full response:', response);

      const { accessToken, expire } = response.data;

      if (accessToken && expire) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('tokenExpire', expire);
        console.log('Access token and expiration saved:', { accessToken, expire });
        login(accessToken);
        
        // Очистить поля ввода
        setUsername('');
        setPassword('');
        
        // Перенаправить на главную страницу
        navigate('/'); // Замените '/' на путь к вашей главной странице
      } else {
        console.error('Access token or expiration date is missing in the response');
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response);
        setError(err.response?.data?.message || 'Ошибка входа');
      } else {
        console.error('Unexpected error:', err);
        setError('Произошла ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login__container'>
      <section className="subscription">
        <h1 className="subscription__title">Для оформления подписки на тариф, необходимо авторизоваться.</h1>
        <div className="subscription__content">
          <img className="subscription__image" src='./images/login-image.png' alt="Страница авторизации" />
          <div className="subscription__placeholder">
            <img className="placeholder__image" src='./images/placeholder-image.svg' alt="Авторизация" />
            <div className="auth__container">
              <div className="auth__item auth__item--login">
                <button className="auth__button auth__button--login active">Войти</button>
                <div className="auth__underline auth__underline--login active"></div>
              </div>
              <div className="auth__item auth__item--register">
                <button className="auth__button auth__button--register">Зарегистрироваться</button>
                <div className="auth__underline auth__underline--register"></div>
              </div>
            </div>

            {/* Форма авторизации */}
            <div className="subscription__form">
              <label className="subscription__label">Логин или номер телефона:</label>
              <input 
                type="text" 
                placeholder="Логин или номер телефона" 
                className="subscription__input" 
                value={username}
                onChange={handleUsernameChange} 
              />
              <label className="subscription__label">Пароль:</label>
              <input 
                type="password" 
                placeholder="Пароль" 
                className="subscription__input" 
                value={password}
                onChange={handlePasswordChange} 
              />
              {error && <p className="error-message">{error}</p>}
              <button 
                className={`subscription__button ${isFormValid ? 'active' : ''}`} 
                onClick={handleLogin}
                disabled={loading || !isFormValid} // Отключаем кнопку, если форма не валидна
              >
                {loading ? 'Загрузка...' : 'Войти'}
              </button>
              <a href='#' className='subscription__href'>Восстановить пароль</a>
              <div className="social-login" style={{ width: '308px', height: '65px', marginTop: '20px' }}>
                <p className="social-login__text">Войти через:</p>
                <div className="social-login__icons">
                  <img src='./images/social1.svg' alt="Социальная сеть 1" className="social-icon" />
                  <img src='./images/social2.svg' alt="Социальная сеть 2" className="social-icon" />
                  <img src='./images/social3.svg' alt="Социальная сеть 3" className="social-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
