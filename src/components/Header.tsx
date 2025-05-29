import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from './AuthProvider';

const Header: React.FC = () => {
    const { logout, isAuthenticated, accountInfo, loading } = useAuth(); 
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('Token:', token);
        if (token) {
            console.log('User  is authenticated');
        } else {
            console.log('User  is not authenticated');
        }
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className='header'>
            <img src='./images/header-logo.svg' alt="logo" className="header__logo" />
            <nav className='header__nav'>
                <Link to="/">Главная</Link>
                <Link to="/">Тарифы</Link>
                <Link to="/">FAQ</Link>
            </nav>
            {isAuthenticated ? (
                <div className='header__user'>
                    <div className='header__account-info'>
                        {loading ? ( // Индикатор загрузки
                            <div className="loader"></div>
                        ) : (
                            accountInfo && (
                                <>
                                    <div>Использовано компаний <span className='accountInfo__used-companies'>{accountInfo.usedCompanies}</span></div>
                                    <div>Лимит по компаниям <span className='accountInfo__company-limit'>{accountInfo.companyLimit}</span></div>
                                </>
                            )
                        )}
                    </div>
                    <div className='header__login-menu'>
                        <span className='burger__span' onClick={toggleMenu} role="button" tabIndex={0} aria-label="Toggle menu">
                            <img src='./images/burger.svg' alt='menu' className='button__burger-menu' />
                        </span>
                        <div className='login-menu__logout-block'>
                            <span>Алексей А.</span> 
                            <button className='LogoutButton' onClick={handleLogout}>Выйти</button>
                        </div>
                        <span className='user-avatar__span'>
                            <img src='./images/avatar.png' alt='Avatar' className='user-avatar' />
                        </span>                        
                    </div>
                </div>
            ) : (
                <div className='header__auth'>
                    <span className='burger__span' onClick={toggleMenu} role="button" tabIndex={0} aria-label="Toggle menu">
                        <img src='./images/burger.svg' alt='menu' className='button__burger-menu' />
                    </span>
                    <span className='header__auth-visibleblock'>
                        <Link to="/register">Зарегистрироваться</Link>
                        <div className='divider'>.</div>
                        <Link className='login-button' to="/login">Войти</Link>
                    </span>
                </div>
            )}
            {menuOpen && (
                <div className='burger-menu'>
                    <span onClick={toggleMenu} className='close-button' aria-label="Close menu">
                        <img src='./images/burgerclose.svg' alt='close' />
                    </span>
                    <div className='burger-content__block'>
                        <nav className='header__nav'>
                            <Link to="/">Главная</Link>
                            <Link to="/">Тарифы</Link>
                            <Link to="/">FAQ</Link>
                        </nav>
                        {isAuthenticated ? (
                            <div className='header__user'>                    
                                <div className='header__login-menu'>
                                    <div className='login-menu__logout-block'>
                                        <span>Алексей А.</span> 
                                        <button className='LogoutButton' onClick={handleLogout}>Выйти</button>
                                    </div>
                                    <span className='user-avatar__span'>
                                        <img src='./images/avatar.png' alt='Avatar' className='user-avatar' />
                                    </span>                        
                                </div>
                            </div>
                        ) : (
                            <div className='header__auth'>                 
                                <span className='header__auth-visibleblock'>
                                    <Link className='register-button' to="/register">Зарегистрироваться</Link>
                                    <div className='divider'>.</div>
                                    <Link className='login-button' to="/login">Войти</Link>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
