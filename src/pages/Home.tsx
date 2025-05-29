import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../components/AuthProvider';
import '../styles/home.css';
import Carousel from '../components/Carousel'; 
import RateSection from '../components/RateSection'; 
import { Link } from 'react-router-dom';
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); 
 
  return (
    <div className='home__container'>
      <h1 className='home__title '>сервис по поиску<br></br> публикаций <br></br>
о компании <br></br>
по его ИНН <img className="home__image1" src='./images/home1.png' alt="Изображение главной страницы" />     </h1>
<p className='home__text'>Комплексный анализ публикаций, получение данных <br></br>в формате PDF на электронную почту.</p>         
            {isAuthenticated && (
                 <Link to="/search" >
    <button className="button__search">
      Запросить данные
    </button>
  </Link>
            )}
    <h2 className='home_titleh2 home_titleh2--carousel'>Почему именно мы</h2>
            <Carousel />
            <img className="home__image2" src='./images/home2.png' alt="Изображение главной страницы" /> 
    <h2 className='home_titleh2'>наши тарифы</h2>
     <RateSection />
    </div>
  );
};

export default Home;
