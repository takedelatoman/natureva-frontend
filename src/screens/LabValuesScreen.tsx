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
    TextInput
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';

    // ==========================================
    // COMPONENTE PERSONALIZADO: LA RUEDA (PICKER)
    // ==========================================
    const WheelPicker = ({ label, unit, min, max, initialValue, onValueChange }: any) => {
    const ITEM_HEIGHT = 60; // Altura grande para que sea fácil de tocar
    // Generamos los números y le agregamos espacios vacíos al inicio y al final para que pueda centrarse
    const numbers = ['', ...Array.from({length: max - min + 1}, (_, i) => min + i), ''];
    
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const selectedNumber = numbers[index + 1]; // +1 por el espacio vacío inicial
        if (selectedNumber !== '' && selectedNumber !== undefined) {
        onValueChange(selectedNumber);
        }
    };

    return (
        <View style={pickerStyles.container}>
        <Text style={pickerStyles.label}>{label} <Text style={pickerStyles.unit}>({unit})</Text></Text>
        
        <View style={pickerStyles.wheelContainer}>
            {/* Caja azul decorativa en el centro (como en tu imagen) */}
            <View style={pickerStyles.selectionBox} pointerEvents="none" />
            
            <FlatList
            data={numbers}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleScroll}
            getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
            // Iniciamos el scroll en el valor inicial que le pasemos
            initialScrollIndex={initialValue ? initialValue - min : 0} 
            renderItem={({ item }) => (
                <View style={[pickerStyles.item, { height: ITEM_HEIGHT }]}>
                <Text style={[
                    pickerStyles.itemText, 
                    item === '' ? null : { color: '#999' } // Color gris por defecto, el azul lo da la ilusión de la caja central
                ]}>
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

    // Estados para guardar los laboratorios
    const [labData, setLabData] = useState<any>({});
    const [generalLab, setGeneralLab] = useState<string>('');

    // LÓGICA MÉDICA DINÁMICA: ¿Qué le mostramos según sus enfermedades?
    const showDiabetes = diagnosticos.includes('Diabetes');
    const showHipertension = diagnosticos.includes('Presión Alta');
    const showColesterol = diagnosticos.includes('Colesterol Alto');

    const handleContinue = () => {
        const todosLosDatos = {
        ...datosPrevios,
        laboratorios: labData,
        laboratorioGeneral: generalLab
        };
        console.log("Datos completísimos enviados a Análisis:", todosLosDatos);
        
        // Viajamos a la pantalla final de carga
        navigation.navigate('Analyzing', { datosPrevios: todosLosDatos });
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

            {/* 1. SECCIÓN DE FOTO (Igual al mockup) */}
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={40} color="#7EBAE4" />
            <Text style={styles.uploadTitle}>ADJUNTAR FOTO</Text>
            <Text style={styles.uploadSubtitle}>(Toque para escanear sus análisis)</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
            <View style={styles.line} />
            </View>

            {/* 2. SECCIÓN DINÁMICA DE RUEDAS (Pickers) */}
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
                label="Presión Sistólica (Alta)" unit="mmHg" 
                min={90} max={200} initialValue={120}
                onValueChange={(val: number) => setLabData({...labData, sistolica: val})} 
                />
                <WheelPicker 
                label="Presión Diastólica (Baja)" unit="mmHg" 
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

            {/* 3. CAJA GENÉRICA: Si no tiene ninguna de esas enfermedades, le dejamos una caja de texto */}
            {!showDiabetes && !showHipertension && !showColesterol && (
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
            )}

            <View style={{flex: 1, minHeight: 40}} />

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>VER MI RECOMENDACIÓN</Text>
            </TouchableOpacity>

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
        position: 'absolute', top: 60, // Exactamente en el centro de los 180px de altura
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
    backButton: { padding: 5, backgroundColor: '#FFF', borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }, // Le puse fondo blanco a la flecha para que se vea siempre bien
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
    
    divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 30 },
    line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14, fontWeight: 'bold' },
    
    genericInputContainer: { width: '100%', marginBottom: 20 },
    genericInputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    textInput: {
        width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 18,
        borderWidth: 2, borderColor: '#E5E7EB', fontSize: 16, textAlignVertical: 'top', minHeight: 120,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    
    continueButton: {
        backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%',
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
    },
    continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
    });