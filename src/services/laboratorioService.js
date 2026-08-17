// src/services/laboratorioService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const laboratorioService = {
  // ✅ Guardar laboratorio
  guardarLaboratorio: async (data, archivos = []) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const formData = new FormData();
      
      // Agregar campos al FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]));
        }
      });

      // Agregar archivos
      archivos.forEach((file, index) => {
        formData.append('archivos', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || `archivo_${index}.jpg`,
        });
      });

      const response = await fetch(`${API_URL}/laboratorios`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      console.log('📥 Respuesta del servidor (laboratorio):', result);
      return result;
    } catch (error) {
      console.error('❌ Error en guardarLaboratorio:', error);
      throw error;
    }
  },

  // ✅ Obtener laboratorios del paciente
  obtenerLaboratorios: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/laboratorios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en obtenerLaboratorios:', error);
      throw error;
    }
  },

  // ✅ Obtener laboratorio por ID
  obtenerLaboratorioPorId: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/laboratorios/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en obtenerLaboratorioPorId:', error);
      throw error;
    }
  },

  // ✅ Actualizar laboratorio
  actualizarLaboratorio: async (id, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/laboratorios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en actualizarLaboratorio:', error);
      throw error;
    }
  },
};