// src/services/mentalHealthService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const mentalHealthService = {
  /**
   * ✅ Guardar factores de riesgo/mental del paciente
   * POST /api/salud-mental
   */
  guardarSaludMental: async (opcionesSeleccionadas, otroRiesgo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log('📤 Enviando salud mental:', { opcionesSeleccionadas, otroRiesgo });
      
      const response = await fetch(`${API_URL}/salud-mental`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: opcionesSeleccionadas || [],
          otroRiesgo: otroRiesgo || '',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar salud mental');
      }
      
      console.log('✅ Salud mental guardada:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en guardarSaludMental:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener salud mental del paciente
   * GET /api/salud-mental
   */
  obtenerSaludMental: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/salud-mental`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener salud mental');
      }
      
      console.log('✅ Salud mental obtenida:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en obtenerSaludMental:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener salud mental por ID
   * GET /api/salud-mental/:id
   */
  obtenerSaludMentalPorId: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/salud-mental/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener salud mental');
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Error en obtenerSaludMentalPorId:', error);
      throw error;
    }
  },

  /**
   * ✅ Actualizar salud mental
   * PUT /api/salud-mental/:id
   */
  actualizarSaludMental: async (id, opcionesSeleccionadas, otroRiesgo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/salud-mental/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: opcionesSeleccionadas || [],
          otroRiesgo: otroRiesgo || '',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar salud mental');
      }
      
      console.log('✅ Salud mental actualizada:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en actualizarSaludMental:', error);
      throw error;
    }
  },

  /**
   * ✅ Eliminar salud mental
   * DELETE /api/salud-mental/:id
   */
  eliminarSaludMental: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/salud-mental/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar salud mental');
      }
      
      console.log('✅ Salud mental eliminada:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en eliminarSaludMental:', error);
      throw error;
    }
  },
};