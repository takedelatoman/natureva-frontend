// HasLabsScreen.tsx - COMPLETO Y CORREGIDO
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HasLabsScreen({ route, navigation }: any) {
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const datosPrevios = route.params?.datosPrevios || {};

  useEffect(() => {
    const loadPacienteId = async () => {
      // 1. Intentar de params
      let id = route.params?.pacienteId || null;
      
      // 2. Si no, de AsyncStorage
      if (!id) {
        id = await AsyncStorage.getItem('pacienteId');
      }
      
      // 3. Si aún no, del usuario guardado
      if (!id) {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          id = user.pacienteId || null;
        }
      }
      
      setPacienteId(id);
      console.log('✅ [HasLabs] pacienteId final:', id);
    };
    loadPacienteId();
  }, []);

  console.log('🔍 [HasLabs] pacienteId:', pacienteId);
  console.log('🔍 [HasLabs] datosPrevios:', datosPrevios);

  const handleYes = () => {
    console.log('📤 [HasLabs] Enviando a LabValues - pacienteId:', pacienteId);
    navigation.navigate('LabValues', {
      pacienteId: pacienteId,
      datosPrevios: datosPrevios,
    });
  };

  const handleNo = () => {
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