// LabValuesScreen.tsx - COMPLETO CON GUARDADO DE ARCHIVOS Y LABORATORIOS
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { laboratorioService } from '../services/laboratorioService';
import { archivoService } from '../services/archivoService';
import * as DocumentPicker from 'expo-document-picker';

// ==========================================
// COMPONENTE PERSONALIZADO: LA RUEDA (PICKER)
// ==========================================
const WheelPicker = ({ label, unit, min, max, initialValue, onValueChange }: any) => {
  const ITEM_HEIGHT = 60;
  const numbers = ['', ...Array.from({ length: max - min + 1 }, (_, i) => min + i), ''];
  
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedNumber = numbers[index + 1];
    if (selectedNumber !== '' && selectedNumber !== undefined) {
      onValueChange(selectedNumber);
    }
  };

  return (
    <View style={pickerStyles.container}>
      <Text style={pickerStyles.label}>{label} <Text style={pickerStyles.unit}>({unit})</Text></Text>
      
      <View style={pickerStyles.wheelContainer}>
        <View style={pickerStyles.selectionBox} pointerEvents="none" />
        
        <FlatList
          data={numbers}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          initialScrollIndex={initialValue ? initialValue - min : 0}
          renderItem={({ item }) => (
            <View style={[pickerStyles.item, { height: ITEM_HEIGHT }]}>
              <Text style={[pickerStyles.itemText, item === '' ? null : { color: '#999' }]}>
                {item}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

// ==========================================
// PANTALLA PRINCIPAL
// ==========================================
export default function LabValuesScreen({ route, navigation }: any) {
  const datosPrevios = route.params?.datosPrevios || {};
  const diagnosticos = datosPrevios.diagnosticos || [];
  const pacienteId = datosPrevios.pacienteId || null;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);

  // Estados para laboratorios
  const [labData, setLabData] = useState<any>({});
  const [generalLab, setGeneralLab] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  // Verificar qué diagnósticos tiene
  const showDiabetes = diagnosticos.some((d: string) => d.includes('Diabetes'));
  const showHipertension = diagnosticos.some((d: string) => d.includes('Presión Alta') || d.includes('Hipertensión'));
  const showColesterol = diagnosticos.some((d: string) => d.includes('Colesterol Alto'));

  // ✅ Seleccionar archivo (imagen o PDF)
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

      const files = result.assets.map((asset: any) => ({
        uri: asset.uri,
        name: asset.name || 'archivo',
        type: asset.mimeType || 'application/octet-stream',
      }));

      setSelectedFiles([...selectedFiles, ...files]);
    } catch (error) {
      console.error('Error al seleccionar archivo:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  // ✅ GUARDAR TODOS LOS DATOS Y NAVEGAR A ANALYZING
  const handleGuardarYAnalizar = async () => {
    // Validar que haya datos
    if (!pacienteId) {
      Alert.alert('Error', 'No se encontró el ID del paciente');
      return;
    }

    // Si no hay valores ni archivos, preguntar si quiere continuar
    const tieneValores = Object.keys(labData).length > 0 || generalLab.trim() !== '';
    const tieneArchivos = selectedFiles.length > 0;

    if (!tieneValores && !tieneArchivos) {
      Alert.alert(
        'Datos opcionales',
        'No has ingresado valores de laboratorio ni adjuntado archivos. ¿Quieres continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => guardarYContinuar() }
        ]
      );
      return;
    }

    guardarYContinuar();
  };

  // ✅ Función principal para guardar y continuar
  const guardarYContinuar = async () => {
    setLoading(true);
    try {
      let laboratorioId = null;
      let archivosSubidos = [];

      // 1. CREAR LABORATORIO EN EL BACKEND
      const labDataToSend: any = {
        paciente_id: pacienteId,
        tipo_examen: 'SANGRE',
        observacion: generalLab.trim() || 'Análisis de laboratorio',
        resultados: labData,
        estado: 'COMPLETADO',
      };

      console.log('📤 1. Creando laboratorio...', labDataToSend);
      
      const labResponse = await laboratorioService.guardarLaboratorio(labDataToSend);
      
      if (labResponse.success && labResponse.data) {
        laboratorioId = labResponse.data.id;
        console.log('✅ Laboratorio creado:', laboratorioId);
      } else {
        console.warn('⚠️ Error al crear laboratorio:', labResponse.message);
        // Si falla, continuar igual pero sin laboratorio
      }

      // 2. SUBIR ARCHIVOS ASOCIADOS AL LABORATORIO
      if (selectedFiles.length > 0 && laboratorioId) {
        setUploadingFiles(true);
        console.log('📤 2. Subiendo archivos...');
        
        const archivoResponse = await archivoService.subirMultiplesArchivos(selectedFiles, {
          paciente_id: pacienteId,
          laboratorio_id: laboratorioId,
          categoria: 'LABORATORIO',
        });
        
        if (archivoResponse.success) {
          archivosSubidos = archivoResponse.data || [];
          console.log('✅ Archivos subidos:', archivosSubidos.length);
        } else {
          console.warn('⚠️ Error al subir archivos:', archivoResponse.message);
        }
        setUploadingFiles(false);
      }

      // 3. PREPARAR DATOS COMPLETOS PARA ANÁLISIS
      const todosLosDatos = {
        ...datosPrevios,
        laboratorios: labData,
        laboratorioId: laboratorioId,
        laboratorioGeneral: generalLab.trim(),
        archivos: selectedFiles.map((f) => f.name),
        archivosSubidos: archivosSubidos,
        tieneLaboratorio: laboratorioId !== null,
        tieneArchivos: archivosSubidos.length > 0,
      };
      
      console.log('✅ 3. Datos completos para análisis:', todosLosDatos);
      
      // 4. NAVEGAR A ANALYZING
      navigation.navigate('Analyzing', { datosPrevios: todosLosDatos });
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar los datos');
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>VALORES DE{'\n'}LABORATORIO</Text>

        {/* SECCIÓN PARA ADJUNTAR ARCHIVOS */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickFile} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={40} color="#7EBAE4" />
          <Text style={styles.uploadTitle}>ADJUNTAR FOTO O PDF</Text>
          <Text style={styles.uploadSubtitle}>(Toque para subir imágenes o PDFs)</Text>
          {selectedFiles.length > 0 && (
            <View style={styles.fileList}>
              {selectedFiles.map((file, index) => (
                <Text key={index} style={styles.fileName}>📎 {file.name}</Text>
              ))}
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
          <View style={styles.line} />
        </View>

        {/* SECCIÓN DINÁMICA DE RUEDAS SEGÚN DIAGNÓSTICOS */}
        {showDiabetes && (
          <>
            <WheelPicker 
              label="1. Nivel de Glucosa" unit="mg/dL" 
              min={60} max={300} initialValue={110}
              onValueChange={(val: number) => setLabData({...labData, glucosa: val})} 
            />
            <WheelPicker 
              label="2. Hemoglobina Glicosilada" unit="%" 
              min={4} max={15} initialValue={6}
              onValueChange={(val: number) => setLabData({...labData, hemoglobina: val})} 
            />
          </>
        )}

        {showHipertension && (
          <>
            <WheelPicker 
              label="Presión Sistólica" unit="mmHg" 
              min={90} max={200} initialValue={120}
              onValueChange={(val: number) => setLabData({...labData, sistolica: val})} 
            />
            <WheelPicker 
              label="Presión Diastólica" unit="mmHg" 
              min={60} max={130} initialValue={80}
              onValueChange={(val: number) => setLabData({...labData, diastolica: val})} 
            />
          </>
        )}

        {showColesterol && (
          <WheelPicker 
            label="Colesterol Total" unit="mg/dL" 
            min={100} max={400} initialValue={200}
            onValueChange={(val: number) => setLabData({...labData, colesterol: val})} 
          />
        )}

        {/* CAJA GENÉRICA PARA OTROS VALORES */}
        <View style={styles.genericInputContainer}>
          <Text style={styles.genericInputLabel}>
            {!showDiabetes && !showHipertension && !showColesterol 
              ? 'Escriba sus valores más relevantes:' 
              : 'Observaciones adicionales (opcional):'}
          </Text>
          <TextInput 
            style={styles.textInput}
            placeholder={
              !showDiabetes && !showHipertension && !showColesterol 
                ? 'Ej: Ácido úrico 8.2...' 
                : 'Ej: Otros valores que quieras compartir...'
            }
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={4}
            value={generalLab}
            onChangeText={setGeneralLab}
          />
        </View>

        <View style={{ height: 20 }} />

        {/* BOTÓN PRINCIPAL */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleGuardarYAnalizar}
          disabled={loading || uploadingFiles}
        >
          {loading || uploadingFiles ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.continueButtonText}>VER MI RECOMENDACIÓN</Text>
          )}
        </TouchableOpacity>
        
        {selectedFiles.length > 0 && (
          <Text style={styles.fileInfo}>
            📎 {selectedFiles.length} archivo(s) seleccionado(s)
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const pickerStyles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', marginBottom: 35 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  unit: { fontSize: 14, color: '#666', fontWeight: 'normal' },
  wheelContainer: { height: 180, width: 140, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  selectionBox: {
    position: 'absolute', top: 60,
    width: 120, height: 60,
    borderWidth: 2, borderColor: '#7EBAE4', borderRadius: 12, backgroundColor: '#F0F8FF', zIndex: -1,
  },
  item: { justifyContent: 'center', alignItems: 'center', width: 140 },
  itemText: { fontSize: 32, fontWeight: 'bold', color: '#4A90E2' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topBar: {
    width: '100%', paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
    alignItems: 'flex-start', zIndex: 10, position: 'absolute',
  },
  backButton: { padding: 5, backgroundColor: '#FFF', borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  scrollContent: {
    flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 120 : 130, paddingBottom: 40, alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 30, letterSpacing: 0.5 },
  uploadBox: {
    width: '100%', backgroundColor: '#EBF5FB', borderWidth: 2, borderStyle: 'dashed',
    borderColor: '#7EBAE4', borderRadius: 15, padding: 30, alignItems: 'center', marginBottom: 20,
  },
  uploadTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  uploadSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  fileList: { marginTop: 10, width: '100%' },
  fileName: { fontSize: 14, color: '#333', marginTop: 2 },
  fileInfo: { fontSize: 14, color: '#7EBAE4', marginTop: 10, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14, fontWeight: 'bold' },
  genericInputContainer: { width: '100%', marginBottom: 20 },
  genericInputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  textInput: {
    width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 18,
    borderWidth: 2, borderColor: '#E5E7EB', fontSize: 16, textAlignVertical: 'top', minHeight: 100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  continueButton: {
    backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%',
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
});