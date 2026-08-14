// src/services/diagnosticoService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const diagnosticoService = {
  // ✅ Guardar diagnósticos del paciente
  guardarDiagnosticos: async (diagnosticos, otraEnfermedad) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/diagnosticos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: diagnosticos,
          otraEnfermedad: otraEnfermedad || '',
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error en guardarDiagnosticos:', error);
      throw error;
    }
  },

  // ✅ Obtener diagnósticos del paciente
  obtenerDiagnosticos: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/diagnosticos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerDiagnosticos:', error);
      throw error;
    }
  },
};