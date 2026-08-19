// LabValuesScreen.tsx - COMPLETO Y FUNCIONAL
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { laboratorioService } from '../services/laboratorioService';
import { archivoService } from '../services/archivoService';

// ==========================================
// COMPONENTE: RUEDA (WHEEL PICKER) - CORREGIDO
// ==========================================
const WheelPicker = ({ label, unit, min, max, initialValue, onValueChange }: any) => {
  const ITEM_HEIGHT = 60;
  const numbers = ['', ...Array.from({ length: max - min + 1 }, (_, i) => min + i), ''];
  const flatListRef = useRef<FlatList>(null);
  const [currentValue, setCurrentValue] = useState(initialValue || min);

  // ✅ Inicializar en el valor correcto
  useEffect(() => {
    if (flatListRef.current && initialValue) {
      const index = initialValue - min + 1;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: index,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedNumber = numbers[index];
    if (selectedNumber !== '' && selectedNumber !== undefined) {
      const num = parseInt(selectedNumber);
      if (!isNaN(num)) {
        setCurrentValue(num);
        onValueChange(num);
      }
    }
  };

  return (
    <View style={pickerStyles.container}>
      <Text style={pickerStyles.label}>
        {label} <Text style={pickerStyles.unit}>({unit})</Text>
      </Text>
      
      <View style={pickerStyles.wheelContainer}>
        <View style={pickerStyles.selectionBox} pointerEvents="none" />
        <FlatList
          ref={flatListRef}
          data={numbers}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={[pickerStyles.item, { height: ITEM_HEIGHT }]}>
              <Text style={[
                pickerStyles.itemText,
                item === '' ? { color: 'transparent' } : { color: '#333' }
              ]}>
                {item}
              </Text>
            </View>
          )}
          scrollEnabled={true}
          style={{ height: ITEM_HEIGHT * 3 }}
        />
      </View>
    </View>
  );
};

// ==========================================
// PANTALLA PRINCIPAL
// ==========================================
export default function LabValuesScreen({ route, navigation }: any) {
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [labData, setLabData] = useState<any>({});
  const [generalLab, setGeneralLab] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const datosPrevios = route.params?.datosPrevios || {};
  const diagnosticos = datosPrevios.diagnosticos || [];

  // ✅ Cargar pacienteId
  useEffect(() => {
    const loadPacienteId = async () => {
      let id = route.params?.pacienteId || null;
      if (!id) {
        id = await AsyncStorage.getItem('pacienteId');
      }
      if (!id) {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          id = user.pacienteId || null;
        }
      }
      setPacienteId(id);
      console.log('✅ [LabValues] pacienteId final:', id);
    };
    loadPacienteId();
  }, []);

  const showDiabetes = diagnosticos.includes('Diabetes');
  const showHipertension = diagnosticos.includes('Presión Alta');
  const showColesterol = diagnosticos.includes('Colesterol Alto');

  // ✅ Seleccionar archivo
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) return;

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

  // ✅ Eliminar archivo
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // ✅ GUARDAR Y CONTINUAR
  const handleContinue = async () => {
    const id = pacienteId || await AsyncStorage.getItem('pacienteId');
    
    if (!id) {
      Alert.alert('Error', 'No se encontró el ID del paciente. Inicia sesión nuevamente.');
      return;
    }

    console.log('✅ [LabValues] Usando pacienteId:', id);

    setLoading(true);
    try {
      let laboratorioId = null;

      // 1. Crear laboratorio
      const labDataToSend = {
        paciente_id: id,
        tipo_examen: 'SANGRE',
        observacion: generalLab.trim() || 'Análisis de laboratorio',
        resultados: labData,
        estado: 'COMPLETADO',
      };

      console.log('📤 Creando laboratorio...', labDataToSend);
      
      const labResponse = await laboratorioService.guardarLaboratorio(labDataToSend);
      
      if (labResponse.success && labResponse.data) {
        laboratorioId = labResponse.data.id;
        console.log('✅ Laboratorio creado:', laboratorioId);
      } else {
        Alert.alert('Error', labResponse.message || 'Error al guardar laboratorio');
        setLoading(false);
        return;
      }

      // 2. Subir archivos
      let archivosSubidos = [];
      if (selectedFiles.length > 0 && laboratorioId) {
        setUploadingFiles(true);
        console.log('📤 Subiendo archivos...');
        
        const archivoResponse = await archivoService.subirMultiplesArchivos(selectedFiles, {
          paciente_id: id,
          laboratorio_id: laboratorioId,
          categoria: 'LABORATORIO',
        });
        
        if (archivoResponse.success) {
          archivosSubidos = archivoResponse.data || [];
          console.log('✅ Archivos subidos:', archivosSubidos.length);
        }
        setUploadingFiles(false);
      }

      // 3. Navegar a Analyzing
      const todosLosDatos = {
        ...datosPrevios,
        pacienteId: id,
        laboratorios: labData,
        laboratorioId: laboratorioId,
        laboratorioGeneral: generalLab.trim(),
        archivos: selectedFiles.map((f) => f.name),
        archivosSubidos: archivosSubidos,
      };
      
      console.log('✅ Datos completos enviados a Análisis:', todosLosDatos);
      navigation.navigate('Analyzing', { datosPrevios: todosLosDatos });
      
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar los datos');
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  // ✅ Data para FlatList
  const sections = [];
  sections.push({ type: 'title', key: 'title' });
  sections.push({ type: 'upload', key: 'upload' });
  sections.push({ type: 'divider', key: 'divider' });

  if (showDiabetes) {
    sections.push({ type: 'glucosa', key: 'glucosa' });
    sections.push({ type: 'hemoglobina', key: 'hemoglobina' });
  }
  if (showHipertension) {
    sections.push({ type: 'sistolica', key: 'sistolica' });
    sections.push({ type: 'diastolica', key: 'diastolica' });
  }
  if (showColesterol) {
    sections.push({ type: 'colesterol', key: 'colesterol' });
  }

  if (!showDiabetes && !showHipertension && !showColesterol) {
    sections.push({ type: 'general', key: 'general' });
  }

  sections.push({ type: 'button', key: 'button' });

  const renderSection = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'title':
        return <Text style={styles.title}>VALORES DE{'\n'}LABORATORIO</Text>;
      
      case 'upload':
        return (
          <View>
            <TouchableOpacity style={styles.uploadBox} onPress={pickFile} activeOpacity={0.7}>
              <Ionicons name="camera-outline" size={40} color="#7EBAE4" />
              <Text style={styles.uploadTitle}>ADJUNTAR FOTO O PDF</Text>
              <Text style={styles.uploadSubtitle}>(Toque para subir imágenes o PDFs)</Text>
            </TouchableOpacity>
            
            {selectedFiles.length > 0 && (
              <View style={styles.fileListContainer}>
                <Text style={styles.fileListTitle}>📎 Archivos seleccionados:</Text>
                {selectedFiles.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <TouchableOpacity onPress={() => removeFile(index)}>
                      <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      
      case 'divider':
        return (
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
            <View style={styles.line} />
          </View>
        );
      
      case 'glucosa':
        return (
          <WheelPicker
            label="1. Nivel de Glucosa"
            unit="mg/dL"
            min={60}
            max={300}
            initialValue={110}
            onValueChange={(val: number) => setLabData({ ...labData, glucosa: val })}
          />
        );
      
      case 'hemoglobina':
        return (
          <WheelPicker
            label="2. Hemoglobina Glicosilada"
            unit="%"
            min={4}
            max={15}
            initialValue={6}
            onValueChange={(val: number) => setLabData({ ...labData, hemoglobina: val })}
          />
        );
      
      case 'sistolica':
        return (
          <WheelPicker
            label="Presión Sistólica"
            unit="mmHg"
            min={90}
            max={200}
            initialValue={120}
            onValueChange={(val: number) => setLabData({ ...labData, sistolica: val })}
          />
        );
      
      case 'diastolica':
        return (
          <WheelPicker
            label="Presión Diastólica"
            unit="mmHg"
            min={60}
            max={130}
            initialValue={80}
            onValueChange={(val: number) => setLabData({ ...labData, diastolica: val })}
          />
        );
      
      case 'colesterol':
        return (
          <WheelPicker
            label="Colesterol Total"
            unit="mg/dL"
            min={100}
            max={400}
            initialValue={200}
            onValueChange={(val: number) => setLabData({ ...labData, colesterol: val })}
          />
        );
      
      case 'general':
        return (
          <View style={styles.genericInputContainer}>
            <Text style={styles.genericInputLabel}>Escriba sus valores más relevantes:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: Ácido úrico 8.2..."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              value={generalLab}
              onChangeText={setGeneralLab}
            />
          </View>
        );
      
      case 'button':
        return (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={loading || uploadingFiles}
          >
            {loading || uploadingFiles ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.continueButtonText}>VER MI RECOMENDACIÓN</Text>
            )}
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const pickerStyles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  unit: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'normal',
  },
  wheelContainer: {
    height: 190,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectionBox: {
    position: 'absolute',
    top: 65,
    width: '80%',
    height: 60,
    borderWidth: 2,
    borderColor: '#7EBAE4',
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    zIndex: 0,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
    alignItems: 'flex-start',
    zIndex: 10,
    position: 'absolute',
  },
  backButton: {
    padding: 5,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 120 : 130,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  uploadBox: {
    width: '100%',
    backgroundColor: '#EBF5FB',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7EBAE4',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  fileListContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fileName: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  genericInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  genericInputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  continueButton: {
    backgroundColor: '#7EBAE4',
    paddingVertical: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
});