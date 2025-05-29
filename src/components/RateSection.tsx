import React from 'react';
import { useAuth } from './AuthProvider'; // Импортируем useAuth
import '../styles/RateSection.css';


const RateSection: React.FC = () => {
    const { accountInfo } = useAuth(); // Получаем accountInfo из контекста

    // Определяем текущий тариф на основе companyLimit
    let currentRate = null;

    if (accountInfo) {
        if (accountInfo.companyLimit <= 5) {
            currentRate = 'Beginner';
        } else if (accountInfo.companyLimit <= 10) {
            currentRate = 'Intermediate';
        } else if (accountInfo.companyLimit <= 15) {
            currentRate = 'Advanced';
        }
    }

    return (
        <section className='container__rate'>
            <div className={`rate__card beginner ${currentRate === 'Beginner' ? 'highlight' : ''}`}>
                <header className='rate__header'>
                   <h2 className='rate__title'>Beginner</h2>
                   <p className='rate__header-text'>Для небольшого исследования</p>
                    <img src='./images/rate1.svg' alt='изображение тариф Beginner' className='rate1Svg' />
                </header>
                <main className='rate__main'>
                     {currentRate === 'Beginner' && <span className='rate__badge'>Текущий тариф</span>}
                    
                    <p className='rate__price'>799 ₽  <span className='rate__old-price'>1 200 ₽</span></p>
                  
                    <p className='rate__installment'>или 150 ₽/мес. при рассрочке на 24 мес.</p>
                    <div className='rate__features'>
                        <h3 className='rate__features-tittle'>В тариф входит:</h3>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Все пункты тарифа Beginner</span>
                        </div>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Экспорт истории</span>
                        </div>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Рекомендации по приоритетам</span>
                        </div>
                    </div>
                    
                    <button className={`button__rate pro ${currentRate === 'Beginner' ? 'button__rate--advanced' : 'button__rate--default'}`}>
    {currentRate === 'Beginner' ? 'Перейти в личный кабинет' : 'Подробнее'}
</button>
                </main>
            </div>

            <div className={`rate__card ${currentRate === 'Intermediate' ? 'highlight' : ''}`}>
                <header className='rate__header pro'>
                     <h2 className='rate__title'>Pro</h2>
                         <p className='rate__header-text'>Для HR и фрилансеров</p>
                    <img src='./images/rate2.svg' alt='изображение тариф Pro' className='rate2Svg' />
                </header>
                <main className='rate__main'>
                    {currentRate === 'Intermediate' && <span className='rate__badge'>Текущий тариф</span>}
                   
                    <p className='rate__price'>1 299 ₽ <span className='rate__old-price'>2 600 ₽</span></p>
                   
                    <p className='rate__installment'>или 279 ₽/мес. при рассрочке на 24 мес.</p>
                    <div className='rate__features'>
                        <h3 className='rate__features-tittle'>В тариф входит:</h3>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Все пункты тарифа Beginner</span>
                        </div>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Экспорт истории</span>
                        </div>
                          <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Рекомендации по приоритетам</span>
                        </div>
                    </div>
                    <button className={`button__rate ${currentRate === 'Intermediate' ? 'button__rate--advanced' : 'button__rate--default'}`}>
    {currentRate === 'Intermediate' ? 'Перейти в личный кабинет' : 'Подробнее'}
</button>
                </main>
            </div>

            <div className={`rate__card bussines${currentRate === 'Advanced' ? 'highlight' : ''}`}>
                <header className='rate__header bussines'>
                     <h2 className='rate__title'>Bussines</h2>
                       <p className='rate__header-text'>Для корпоративных клиентов</p>
                    <img src='./images/rate3.svg' alt='изображение тариф Advanced' className='rate3Svg' />
                     
                </header>
                <main className='rate__main'>
                    {currentRate === 'Advanced' && <span className='rate__badge'>Текущий тариф</span>}
                   
                    <p className='rate__price'>2 379 ₽<span className='rate__old-price'>3 700 ₽</span></p>
                    
                    <p className='rate__installment'></p>
                    <div className='rate__features'>
                        <h3 className='rate__features-tittle'>В тариф входит:</h3>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Все пункты тарифа Pro</span>
                        </div>
                        <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Безлимитное количество запросов</span>
                        </div>
                         <div className='rate__feature'>
                            <img src='./images/iconcheck.png' alt='✔' className='rate__check-icon' />
                            <span>Приоритетная поддержка</span>
                        </div>
                        
                    </div>
                   
                    <button className={`button__rate ${currentRate === 'Advanced' ? 'button__rate--advanced' : 'button__rate--default'}`}>
    {currentRate === 'Advanced' ? 'Перейти в личный кабинет' : 'Подробнее'}
</button>
                </main>
            </div>
        </section>
    );
};

export default RateSection;
