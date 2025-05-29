import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AccountInfoType {
  companyLimit: number;
  usedCompanies: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accountInfo: AccountInfoType | null;
  loading: boolean; // Добавлено состояние загрузки
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('accessToken') !== null;
  });
  const [accountInfo, setAccountInfo] = useState<AccountInfoType | null>(null);
  const [loading, setLoading] = useState(false); // Состояние загрузки

  // Функция для загрузки информации об аккаунте
  const fetchAccountInfo = async (token: string) => {
    setLoading(true); // Устанавливаем loading в true
    try {
      const response = await axios.get('https://gateway.scan-interfax.ru/api/v1/account/info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { usedCompanyCount, companyLimit } = response.data.eventFiltersInfo;
      setAccountInfo({ usedCompanies: usedCompanyCount, companyLimit });
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      setAccountInfo(null);
    } finally {
      setLoading(false); // Устанавливаем loading в false
    }
  };

  // При монтировании проверяем токен и загружаем данные аккаунта
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      fetchAccountInfo(token);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    await fetchAccountInfo(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setAccountInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accountInfo, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};