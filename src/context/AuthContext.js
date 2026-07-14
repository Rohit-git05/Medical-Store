import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone, role });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  const updateProfile = async (name, phone, password) => {
    try {
      const { data } = await api.put('/auth/profile', { name, phone, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed.'
      };
    }
  };

  const uploadProfilePicture = async (formData) => {
    try {
      const { data } = await api.post('/auth/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const updatedUser = { ...user, profilePicture: data.profilePicture };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Image upload failed.'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadProfilePicture
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
