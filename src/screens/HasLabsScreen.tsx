// HasLabsScreen.tsx - COMPLETO CON ESTILOS
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HasLabsScreen({ route, navigation }: any) {
  // Traemos TODO el historial del usuario (Diagnósticos y Síntomas)
  const datosPrevios = route.params?.datosPrevios || {};
  const pacienteId = route.params?.pacienteId || null;

  console.log('🔍 [HasLabs] pacienteId:', pacienteId);
  console.log('🔍 [HasLabs] datosPrevios:', datosPrevios);

  const handleYes = () => {
    // Si toca SI, lo llevamos a la Página 9 (LabValues)
    navigation.navigate('LabValues', {
      pacienteId: pacienteId,
      datosPrevios: datosPrevios,
    });
  };

  const handleNo = () => {
    // Si toca NO, nos saltamos los laboratorios y vamos a Analyzing
    const datosCompletos = {
      ...datosPrevios,
      pacienteId: pacienteId,
      tieneLaboratorios: false,
      laboratorios: {},
      archivos: [],
      notas: 'Sin datos de laboratorio',
    };
    
    console.log('📊 Evaluación SIN laboratorios:', datosCompletos);
    navigation.navigate('Analyzing', { datosPrevios: datosCompletos });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          TIENES VALORES{'\n'}DE LABORATORIO{'\n'}?
        </Text>

        {/* Botones Cuadrados Gigantes */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.squareButton}
            activeOpacity={0.7}
            onPress={handleYes}
          >
            <Text style={styles.buttonText}>SI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.squareButton}
            activeOpacity={0.7}
            onPress={handleNo}
          >
            <Text style={styles.buttonText}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS COMPLETOS
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topDecoration: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 35,
    borderColor: '#7EBAE4',
    opacity: 0.8,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 15 : 50),
    alignItems: 'flex-start',
    zIndex: 10,
    position: 'absolute',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: 60,
    letterSpacing: 1,
    lineHeight: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
  },
  squareButton: {
    backgroundColor: '#7EBAE4',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
  },
});