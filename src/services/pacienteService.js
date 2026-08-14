// src/services/pacienteService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const pacienteService = {
  // ✅ Obtener perfil del paciente
  getPerfil: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/pacientes/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error en getPerfil:', error);
      throw error;
    }
  },

  // ✅ Actualizar perfil del paciente
  actualizarPerfil: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/pacientes/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error en actualizarPerfil:', error);
      throw error;
    }
  },

  // ✅ Obtener estadísticas
  getEstadisticas: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/pacientes/estadisticas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      throw error;
    }
  },
};