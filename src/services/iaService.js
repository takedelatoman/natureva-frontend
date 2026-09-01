// src/services/iaService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const iaService = {
  /**
   * ✅ Generar recomendación personalizada
   * POST /api/ia/recomendacion
   */
  generarRecomendacion: async (datosCompletos) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log('📤 Enviando datos para recomendación:', JSON.stringify(datosCompletos, null, 2));
      
      const response = await fetch(`${API_URL}/ia/recomendacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(datosCompletos),
      });
      
      // ✅ Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Respuesta no es JSON:', textResponse.substring(0, 300));
        throw new Error(`El servidor devolvió: ${textResponse.substring(0, 100)}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ Recomendación generada:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en generarRecomendacion:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener recomendaciones históricas del paciente
   * GET /api/ia/recomendaciones
   */
  obtenerRecomendacionesHistoricas: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/ia/recomendaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Respuesta no es JSON:', textResponse.substring(0, 200));
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener recomendaciones');
      }
      
      console.log('✅ Recomendaciones históricas obtenidas:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en obtenerRecomendacionesHistoricas:', error);
      throw error;
    }
  },

  /**
   * ✅ Enviar duda/pregunta al chat
   * POST /api/ia/chat
   */
  enviarDuda: async (pregunta, contexto) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/ia/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pregunta: pregunta,
          contexto: contexto || {}
        }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Respuesta no es JSON:', textResponse.substring(0, 200));
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar duda');
      }
      
      console.log('✅ Respuesta del chat:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error en enviarDuda:', error);
      throw error;
    }
  },
};