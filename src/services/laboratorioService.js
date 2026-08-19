// src/services/laboratorioService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const laboratorioService = {
  // ✅ GUARDAR LABORATORIO (JSON)
  guardarLaboratorio: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log('📤 Enviando laboratorio:', data);
      
      const response = await fetch(`${API_URL}/laboratorios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 👈 JSON, NO FormData
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log('📥 Respuesta laboratorio:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en guardarLaboratorio:', error);
      throw error;
    }
  },

  // ✅ SUBIR ARCHIVOS (FormData)
  subirArchivos: async (files, datos) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append('archivos', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || `archivo_${index}.jpg`,
        });
      });
      
      Object.keys(datos).forEach(key => {
        if (datos[key] !== null && datos[key] !== undefined) {
          formData.append(key, String(datos[key]));
        }
      });

      const response = await fetch(`${API_URL}/archivos/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error en subirArchivos:', error);
      throw error;
    }
  },
};