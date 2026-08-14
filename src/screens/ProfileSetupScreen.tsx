// ProfileSetupScreen.tsx - COMPLETO Y CORREGIDO
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pacienteService } from '../services/pacienteService';

export default function ProfileSetupScreen({ navigation }: any) {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [nombre, setNombre] = useState<string>('');
  const [edad, setEdad] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');

  // ✅ Guardar género seleccionado
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setModalVisible(true);
  };

  // ✅ Guardar datos del perfil en el backend
  const handleSaveProfile = async () => {
    // Validar campos
    if (!nombre.trim() || !edad.trim() || !peso.trim() || !altura.trim()) {
      Alert.alert('Datos incompletos', 'Por favor completa todos los campos');
      return;
    }

    if (!selectedGender) {
      Alert.alert('Error', 'Selecciona un género');
      return;
    }

    setLoading(true);
    try {
      const data = {
        nombre: nombre.trim(),
        edad: parseInt(edad),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        genero: selectedGender === 'MASCULINO' ? 'masculino' : 'femenino',
      };

      console.log('📤 Enviando datos al backend:', data);

      const response = await pacienteService.actualizarPerfil(data);

      if (response.success) {
        console.log('✅ Perfil guardado:', response.data);
        Alert.alert('¡Excelente!', 'Datos guardados correctamente');
        Keyboard.dismiss();
        setModalVisible(false);
        // ✅ Navegar a HasDiagnosis (la pantalla que existe)
        navigation.navigate('HasDiagnosis');
      } else {
        Alert.alert('Error', response.message || 'Error al guardar datos');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Continuar (validar antes de ir a HasDiagnosis)
  const handleContinue = () => {
    if (!selectedGender) {
      Alert.alert(
        'Falta información',
        'Por favor, selecciona tu género para poder personalizar tu receta.'
      );
      return;
    }

    if (!nombre.trim() || !edad.trim() || !peso.trim() || !altura.trim()) {
      Alert.alert(
        'Datos incompletos',
        'Necesitamos tus datos físicos para continuar.',
        [{ text: 'Completar ahora', onPress: () => setModalVisible(true) }]
      );
      return;
    }

    // Si todo está correcto, armamos el JSON
    const dataParaElBackend = {
      nombre: nombre,
      edad: parseInt(edad),
      peso: parseFloat(peso),
      altura: parseFloat(altura),
      genero: selectedGender
    };
    
    console.log("¡Éxito! JSON listo para enviar:", dataParaElBackend);
    
    // ✅ Navegar a HasDiagnosis (SOLO UNA VEZ)
    navigation.navigate('HasDiagnosis');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.header}>
            <Text style={styles.brandText}>NaturMD</Text>
            <Text style={styles.subtitle}>Ayúdenos a personalizar{'\n'}su receta</Text>
          </View>

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, styles.maleButton, selectedGender === 'MASCULINO' && styles.selectedButton]}
              onPress={() => handleGenderSelect('MASCULINO')}
            >
              <Text style={styles.genderText}>👨 SOY HOMBRE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, styles.femaleButton, selectedGender === 'FEMENINO' && styles.selectedButton]}
              onPress={() => handleGenderSelect('FEMENINO')}
            >
              <Text style={styles.genderText}>👩 SOY MUJER</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ MODAL PARA DATOS DEL PACIENTE */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Tus datos físicos</Text>
              <Text style={styles.modalSubtitle}>Esta información es vital para tu diagnóstico.</Text>

              <View style={{ width: '100%' }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: Juan Pérez"
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.label}>Edad (años)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: 26"
                      keyboardType="numeric"
                      value={edad}
                      onChangeText={setEdad}
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.label}>Peso (kg)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: 70.5"
                      keyboardType="numeric"
                      value={peso}
                      onChangeText={setPeso}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Altura (metros)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 1.75"
                    keyboardType="numeric"
                    value={altura}
                    onChangeText={setAltura}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveModalButton}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveModalButtonText}>GUARDAR DATOS</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topDecoration: {
    position: 'absolute', top: -80, right: -80, width: 200, height: 200,
    borderRadius: 100, borderWidth: 35, borderColor: '#7EBAE4', opacity: 0.8,
  },
  topBar: { width: '100%', paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-start', zIndex: 10 },
  backButton: { padding: 5 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, alignItems: 'center', paddingBottom: 40 },
  topSection: { width: '100%', alignItems: 'center' },
  spacer: { flex: 1, minHeight: 40 },
  header: { alignItems: 'center', marginBottom: 50, marginTop: 10 },
  brandText: { fontSize: 34, fontWeight: '900', color: '#000', marginBottom: 8, letterSpacing: 0.5 },
  subtitle: { fontSize: 18, fontWeight: '500', textAlign: 'center', color: '#444' },
  genderContainer: { width: '100%', alignItems: 'center', marginBottom: 20 },
  genderButton: {
    width: '95%', paddingVertical: 20, borderRadius: 15, alignItems: 'center',
    marginBottom: 18, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  maleButton: { backgroundColor: '#7EBAE4' },
  femaleButton: { backgroundColor: '#C39BD3' },
  selectedButton: { borderColor: '#333', borderWidth: 3 },
  genderText: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  continueButton: {
    backgroundColor: '#7EBAE4', paddingVertical: 18, paddingHorizontal: 40,
    borderRadius: 30, width: '90%', alignItems: 'center', borderWidth: 2, borderColor: '#000',
  },
  continueButtonText: { fontSize: 16, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '88%', backgroundColor: '#FFF', borderRadius: 20, padding: 25,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
  },
  closeModalButton: { position: 'absolute', top: 15, right: 15, zIndex: 1, padding: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10 },
  modalSubtitle: { fontSize: 13, color: '#666', marginBottom: 20, textAlign: 'center' },
  inputGroup: { width: '100%', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 5, marginLeft: 5 },
  input: {
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#E5E7EB', fontSize: 15, width: '100%',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  halfInput: { width: '48%' },
  saveModalButton: {
    backgroundColor: '#7EBAE4', paddingVertical: 15, paddingHorizontal: 30,
    borderRadius: 15, marginTop: 15, width: '100%', alignItems: 'center',
  },
  saveModalButtonText: { fontSize: 16, fontWeight: 'bold', color: '#000', letterSpacing: 0.5 },
});