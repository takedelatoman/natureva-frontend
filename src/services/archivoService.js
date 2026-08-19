// src/services/archivoService.js
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const archivoService = {
  subirMultiplesArchivos: async (files, datos = {}) => {
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
      console.error('❌ Error en subirMultiplesArchivos:', error);
      throw error;
    }
  },
};