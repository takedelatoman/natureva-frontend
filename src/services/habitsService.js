// src/services/habitsService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const habitsService = {
  /**
   * ✅ Guardar hábitos del paciente
   * POST /api/habitos
   */
  guardarHabitos: async (opcionesSeleccionadas, otroHabito) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log('📤 Enviando hábitos:', { opcionesSeleccionadas, otroHabito });
      
      const response = await fetch(`${API_URL}/habitos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: opcionesSeleccionadas || [],
          otroHabito: otroHabito || '',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar hábitos');
      }
      
      console.log('✅ Hábitos guardados:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en guardarHabitos:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener hábitos del paciente
   * GET /api/habitos
   */
  obtenerHabitos: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/habitos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener hábitos');
      }
      
      console.log('✅ Hábitos obtenidos:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en obtenerHabitos:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener hábito por ID
   * GET /api/habitos/:id
   */
  obtenerHabitoPorId: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/habitos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener hábito');
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Error en obtenerHabitoPorId:', error);
      throw error;
    }
  },

  /**
   * ✅ Actualizar hábito
   * PUT /api/habitos/:id
   */
  actualizarHabito: async (id, opcionesSeleccionadas, otroHabito) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/habitos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          opcionesSeleccionadas: opcionesSeleccionadas || [],
          otroHabito: otroHabito || '',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar hábito');
      }
      
      console.log('✅ Hábito actualizado:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en actualizarHabito:', error);
      throw error;
    }
  },

  /**
   * ✅ Eliminar hábito
   * DELETE /api/habitos/:id
   */
  eliminarHabito: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/habitos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar hábito');
      }
      
      console.log('✅ Hábito eliminado:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en eliminarHabito:', error);
      throw error;
    }
  },
};