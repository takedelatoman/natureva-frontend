// src/services/sintomaService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sintomaService = {
  // ✅ Guardar síntomas del paciente
  guardarSintomas: async (sintomas, otroSintoma) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sintomas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: sintomas,
          otraEnfermedad: otroSintoma || '',
        }),
      });
      
      const data = await response.json();
      console.log('📥 Respuesta del servidor (síntomas):', data);
      return data;
    } catch (error) {
      console.error('❌ Error en guardarSintomas:', error);
      throw error;
    }
  },

  // ✅ Obtener síntomas del paciente
  obtenerSintomas: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sintomas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en obtenerSintomas:', error);
      throw error;
    }
  },

  // ✅ Obtener síntoma por ID
  obtenerSintomaPorId: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sintomas/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en obtenerSintomaPorId:', error);
      throw error;
    }
  },

  // ✅ Actualizar síntoma
  actualizarSintoma: async (id, sintomas, otroSintoma) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sintomas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: sintomas,
          otraEnfermedad: otroSintoma || '',
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en actualizarSintoma:', error);
      throw error;
    }
  },

  // ✅ Eliminar síntoma
  eliminarSintoma: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sintomas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en eliminarSintoma:', error);
      throw error;
    }
  },
};