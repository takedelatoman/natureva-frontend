// src/services/authService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // ✅ SOLO 2 ARGUMENTOS: email, password
  register: async (email, password) => {
    try {
      const nombre = email.split('@')[0];
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, password }),
      });
      const data = await response.json();
      
      // ✅ Guardar token si el registro fue exitoso
      if (data.success && data.data?.token) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.usuario));
      }
      
      return data;
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      // ✅ Guardar token si el login fue exitoso
      if (data.success && data.data?.token) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.usuario));
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  loginGoogle: async (googleToken, email, nombre) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken, email, nombre }),
      });
      const data = await response.json();
      
      if (data.success && data.data?.token) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.usuario));
      }
      
      return data;
    } catch (error) {
      console.error('Error en loginGoogle:', error);
      throw error;
    }
  },

  // ✅ Obtener token guardado
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  // ✅ Obtener usuario guardado
  getUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ✅ Cerrar sesión
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};