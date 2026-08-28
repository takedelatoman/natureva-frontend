// screens/LabValuesScreen.tsx - VERSIÓN DEFINITIVA COMPLETA
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { laboratorioService } from '../services/laboratorioService';
import { archivoService } from '../services/archivoService';

const { width } = Dimensions.get('window');

// ==========================================
// COMPONENTE LA RUEDA (WheelPicker) - CON ScrollView INTERNO
// ==========================================
const WheelPicker = ({ 
  label, 
  unit, 
  min, 
  max, 
  step = 1, 
  initialValue, 
  onValueChange,
  disabled = false 
}: any) => {
  const ITEM_HEIGHT = 60;
  const length = Math.round((max - min) / step) + 1;
  const rawNumbers = Array.from({ length }, (_, i) => {
    const val = min + (i * step);
    return Number(val.toFixed(1));
  });

  const numbers = ['', ...rawNumbers, ''];
  const scrollViewRef = useRef<ScrollView>(null);

  let initIndex = rawNumbers.findIndex(n => n === initialValue);
  if (initIndex === -1) initIndex = 0;

  // Actualizar valor cuando cambia el índice
  const handleScroll = (event: any) => {
    if (disabled) return;
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const selectedNumber = numbers[index + 1];
    if (selectedNumber !== '' && selectedNumber !== undefined) {
      onValueChange(selectedNumber);
    }
  };

  // Scroll al valor inicial
  useEffect(() => {
    if (scrollViewRef.current && initIndex > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: initIndex * ITEM_HEIGHT,
          animated: true,
        });
      }, 200);
    }
  }, []);

  return (
    <View style={pickerStyles.container}>
      <Text style={pickerStyles.label}>
        {label} <Text style={pickerStyles.unit}>({unit})</Text>
      </Text>
      <View style={pickerStyles.wheelContainer}>
        <View style={pickerStyles.selectionBox} pointerEvents="none" />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          scrollEnabled={!disabled}
          contentContainerStyle={pickerStyles.scrollContent}
          bounces={false}
          nestedScrollEnabled={true}
        >
          {numbers.map((item, index) => (
            <View key={index} style={[pickerStyles.item, { height: ITEM_HEIGHT }]}>
              <Text style={[
                pickerStyles.itemText, 
                item === '' ? pickerStyles.itemTextEmpty : null,
                disabled && pickerStyles.itemTextDisabled
              ]}>
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
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
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const datosPrevios = route.params?.datosPrevios || {};
  const diagnosticos = datosPrevios.diagnosticos || [];

  // Efecto para cargar pacienteId
  useEffect(() => {
    const loadPacienteId = async () => {
      try {
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
      } catch (error) {
        console.error('❌ Error cargando pacienteId:', error);
      }
    };
    
    loadPacienteId();
  }, []);

  // Verificar diagnósticos
  const showDiabetes = diagnosticos.some((d: string) => 
    d.toLowerCase().includes('diabetes')
  );
  const showHipertension = diagnosticos.some((d: string) => 
    d.toLowerCase().includes('presión') || 
    d.toLowerCase().includes('hipertensión')
  );
  const showColesterol = diagnosticos.some((d: string) => 
    d.toLowerCase().includes('colesterol') || 
    d.toLowerCase().includes('lípido')
  );
  const hasSpecificLabs = showDiabetes || showHipertension || showColesterol;

  // LÓGICA DE LA CÁMARA Y GALERÍA
  const handleImageOption = useCallback(() => {
    Alert.alert(
      "Adjuntar Laboratorio",
      "¿De dónde desea obtener la imagen?",
      [
        { text: "📷 Tomar Foto", onPress: takePhoto },
        { text: "🖼️ Elegir de Galería", onPress: pickImage },
        { text: "❌ Cancelar", style: "cancel" }
      ]
    );
  }, []);

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permiso necesario", "Necesitamos acceso a la cámara.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        console.log('📸 Foto tomada:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permiso necesario", "Necesitamos acceso a la galería.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        console.log('🖼️ Imagen seleccionada:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removeImage = useCallback(() => {
    Alert.alert(
      "Eliminar imagen",
      "¿Deseas eliminar la imagen adjunta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => setImageUri(null), style: "destructive" }
      ]
    );
  }, []);

  // ✅ GUARDAR LABORATORIO Y NAVEGAR A HABITS
  const handleContinue = async () => {
    if (!imageUri && Object.keys(labData).length === 0) {
      Alert.alert(
        'Sin datos de laboratorio',
        'No has adjuntado imagen ni ingresado valores. ¿Deseas continuar?',
        [
          { text: 'Volver', style: 'cancel' },
          { text: 'Continuar', onPress: () => navegarASiguiente() }
        ]
      );
      return;
    }
    navegarASiguiente();
  };

  const navegarASiguiente = async () => {
    const id = pacienteId || await AsyncStorage.getItem('pacienteId');

    if (!id) {
      Alert.alert('Error', 'No se encontró el ID del paciente.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoading(true);

    try {
      let laboratorioId = null;
      let archivosSubidos = [];

      if (Object.keys(labData).length > 0 || imageUri) {
        const labDataToSend = {
          paciente_id: id,
          tipo_examen: 'SANGRE',
          observacion: 'Análisis de laboratorio',
          resultados: labData,
          estado: 'COMPLETADO',
        };

        console.log('📤 Creando laboratorio...', labDataToSend);

        const labResponse = await laboratorioService.guardarLaboratorio(labDataToSend);

        if (labResponse.success && labResponse.data) {
          laboratorioId = labResponse.data.id;
          console.log('✅ Laboratorio creado:', laboratorioId);
        } else {
          throw new Error(labResponse.message || 'Error al guardar laboratorio');
        }

        if (imageUri && laboratorioId) {
          setUploadingFiles(true);
          console.log('📤 Subiendo imagen...');

          try {
            const archivoResponse = await archivoService.subirMultiplesArchivos(
              [{
                uri: imageUri,
                name: `laboratorio_${Date.now()}.jpg`,
                type: 'image/jpeg',
              }],
              {
                paciente_id: id,
                laboratorio_id: laboratorioId,
                categoria: 'LABORATORIO',
              }
            );

            if (archivoResponse.success) {
              archivosSubidos = archivoResponse.data || [];
              console.log('✅ Imagen subida:', archivosSubidos.length);
            }
          } catch (uploadError) {
            console.error('⚠️ Error al subir imagen:', uploadError);
          }
          setUploadingFiles(false);
        }
      }

      const todosLosDatos = {
        ...datosPrevios,
        pacienteId: id,
        laboratorios: labData,
        laboratorioId: laboratorioId,
        tieneLaboratorios: !!laboratorioId || !!imageUri || Object.keys(labData).length > 0,
        archivos: imageUri ? [imageUri] : [],
        archivosSubidos: archivosSubidos,
      };

      console.log('✅ Navegando a Habits con datos:', {
        pacienteId: id,
        laboratorioId,
        tieneLaboratorios: todosLosDatos.tieneLaboratorios,
        archivosSubidos: archivosSubidos.length
      });

      navigation.navigate('Habits', { datosPrevios: todosLosDatos });

    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al guardar los datos.');
    } finally {
      setLoading(false);
      setUploadingFiles(false);
      setIsSubmitting(false);
    }
  };

  // Limpiar imagen al salir
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setImageUri(null);
    });
    return unsubscribe;
  }, [navigation]);

  // ✅ Contenido principal como Header del FlatList
  const renderHeader = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>VALORES DE{'\n'}LABORATORIO</Text>
      <Text style={styles.subtitle}>
        Adjunta una foto de tus análisis o ingresa los valores manualmente
      </Text>

      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageActionButton} onPress={handleImageOption}>
              <Ionicons name="refresh-circle-outline" size={22} color="#FFF" />
              <Text style={styles.imageActionText}>Cambiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imageActionButton, styles.imageActionDelete]} onPress={removeImage}>
              <Ionicons name="trash-outline" size={22} color="#FFF" />
              <Text style={styles.imageActionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadBox} 
          activeOpacity={0.7} 
          onPress={handleImageOption} 
          disabled={loading}
        >
          <Ionicons name="camera-outline" size={50} color="#7EBAE4" />
          <Text style={styles.uploadTitle}>ADJUNTAR FOTO</Text>
          <Text style={styles.uploadSubtitle}>
            Toca para escanear o seleccionar tus análisis
          </Text>
        </TouchableOpacity>
      )}

      {hasSpecificLabs && (
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
          <View style={styles.line} />
        </View>
      )}
    </View>
  );

  // ✅ Footer del FlatList (botones y progreso)
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {showDiabetes && (
        <>
          <WheelPicker
            label="1. Nivel de Glucosa"
            unit="mg/dL"
            min={60}
            max={300}
            step={1}
            initialValue={110}
            disabled={loading}
            onValueChange={(val: number) => setLabData({ ...labData, glucosa: val })}
          />
          <WheelPicker
            label="2. Hemoglobina Glicosilada"
            unit="%"
            min={4}
            max={15}
            step={0.1}
            initialValue={6.5}
            disabled={loading}
            onValueChange={(val: number) => setLabData({ ...labData, hemoglobina: val })}
          />
        </>
      )}

      {showHipertension && (
        <>
          <WheelPicker
            label="Presión Sistólica"
            unit="mmHg"
            min={90}
            max={200}
            step={1}
            initialValue={120}
            disabled={loading}
            onValueChange={(val: number) => setLabData({ ...labData, sistolica: val })}
          />
          <WheelPicker
            label="Presión Diastólica"
            unit="mmHg"
            min={60}
            max={130}
            step={1}
            initialValue={80}
            disabled={loading}
            onValueChange={(val: number) => setLabData({ ...labData, diastolica: val })}
          />
        </>
      )}

      {showColesterol && (
        <WheelPicker
          label="Colesterol Total"
          unit="mg/dL"
          min={100}
          max={400}
          step={1}
          initialValue={200}
          disabled={loading}
          onValueChange={(val: number) => setLabData({ ...labData, colesterol: val })}
        />
      )}

      <View style={{ height: 20 }} />

      <TouchableOpacity
        style={[
          styles.continueButton, 
          (loading || uploadingFiles) && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={loading || uploadingFiles}
      >
        {loading || uploadingFiles ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFF" size="small" />
            <Text style={styles.loadingText}>
              {uploadingFiles ? 'Subiendo imagen...' : 'Guardando...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.continueButtonText}>
            {imageUri || Object.keys(labData).length > 0 
              ? 'CONTINUAR A HÁBITOS' 
              : 'SALTAR'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
        <View style={styles.progressLine} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <Text style={styles.progressText}>Laboratorio</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={loading || uploadingFiles}
        >
          <Ionicons name="arrow-back" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ✅ FlatList PRINCIPAL con renderItem agregado */}
      <FlatList
        data={[]}
        keyExtractor={() => 'main'}
        renderItem={null} // ✅ Obligatorio, pero no se usa porque data está vacío
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
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
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  unit: { 
    fontSize: 13, 
    color: '#666', 
    fontWeight: 'normal' 
  },
  wheelContainer: { 
    height: 180, 
    width: 140, 
    overflow: 'hidden', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 10,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  selectionBox: {
    position: 'absolute', 
    top: 60,
    width: 120, 
    height: 60,
    borderWidth: 2, 
    borderColor: '#7EBAE4', 
    borderRadius: 12, 
    backgroundColor: '#F0F8FF',
    zIndex: -1,
  },
  item: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 140 
  },
  itemText: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#4A90E2' 
  },
  itemTextEmpty: { 
    color: 'transparent' 
  },
  itemTextDisabled: {
    opacity: 0.4
  }
});

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' 
  },
  topBar: {
    width: '100%', 
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
    alignItems: 'flex-start', 
    zIndex: 10, 
    position: 'absolute',
  },
  backButton: { 
    padding: 8, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 } 
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 120 : 120,
    paddingBottom: 40,
  },
  contentContainer: {
    alignItems: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1A1A2E', 
    textAlign: 'center', 
    marginBottom: 6, 
    letterSpacing: 0.5 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  uploadBox: {
    width: '100%', 
    backgroundColor: '#EBF5FB', 
    borderWidth: 2, 
    borderStyle: 'dashed',
    borderColor: '#7EBAE4', 
    borderRadius: 20, 
    padding: 30, 
    alignItems: 'center', 
    marginBottom: 20,
    minHeight: 160,
    justifyContent: 'center',
  },
  uploadTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 10 
  },
  uploadSubtitle: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 4,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  previewImage: {
    width: '100%', 
    height: 180, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    marginBottom: 10,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  imageActionButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#7EBAE4',
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    marginHorizontal: 4,
  },
  imageActionDelete: {
    backgroundColor: '#EF5350',
  },
  imageActionText: {
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 13, 
    marginLeft: 6,
  },
  divider: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 20, 
    marginTop: 8 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#E5E7EB' 
  },
  dividerText: { 
    marginHorizontal: 15, 
    color: '#999', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  continueButton: {
    backgroundColor: '#7EBAE4', 
    paddingVertical: 16, 
    borderRadius: 30, 
    width: '100%',
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#FFF', 
    letterSpacing: 1 
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },
  progressDotActive: {
    backgroundColor: '#7EBAE4',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  progressLine: {
    flex: 0.4,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#7EBAE4',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});