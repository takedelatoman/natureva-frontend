// src/config/api.js
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // 🔥 Para el emulador Android, usa la IP de tu PC
  if (Platform.OS === 'android') {
    return 'http://192.168.1.28:3000/api';
  }
  return 'http://localhost:3000/api';
};

export const API_URL = getBaseUrl();

// ... el resto del código igual

export const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    google: `${API_URL}/auth/google`,
    facebook: `${API_URL}/auth/facebook`,
    verify: `${API_URL}/auth/verify`,
  },
  pacientes: {
    perfil: `${API_URL}/pacientes/perfil`,
    estadisticas: `${API_URL}/pacientes/estadisticas`,
  },
  evaluaciones: {
    crear: `${API_URL}/evaluaciones`,
    listar: `${API_URL}/evaluaciones`,
    obtener: (id) => `${API_URL}/evaluaciones/${id}`,
    eliminar: (id) => `${API_URL}/evaluaciones/${id}`,
  },
  laboratorios: {
    crear: `${API_URL}/laboratorios`,
    listar: `${API_URL}/laboratorios`,
    obtener: (id) => `${API_URL}/laboratorios/${id}`,
    actualizar: (id) => `${API_URL}/laboratorios/${id}`,
    eliminar: (id) => `${API_URL}/laboratorios/${id}`,
  },
  recomendaciones: {
    generar: `${API_URL}/recomendaciones/generar`,
    obtener: (id) => `${API_URL}/recomendaciones/${id}`,
    duda: (id) => `${API_URL}/recomendaciones/${id}/duda`,
  },
  archivos: {
    subir: `${API_URL}/archivos`,
    obtener: (pacienteId) => `${API_URL}/archivos/paciente/${pacienteId}`,
    descargar: (id) => `${API_URL}/archivos/${id}/download`,
  },
};