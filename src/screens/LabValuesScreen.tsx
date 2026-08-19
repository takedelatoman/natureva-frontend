    import React, { useState } from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Platform, 
    StatusBar,
    ScrollView,
    Alert,
    Image
    } from 'react-native';
    import { SafeAreaView } from 'react-native-safe-area-context'; 
    import { Ionicons } from '@expo/vector-icons';
    import * as ImagePicker from 'expo-image-picker';

    // ==========================================
    // COMPONENTE LA RUEDA (AHORA ES UN SCROLLVIEW)
    // ==========================================
    const WheelPicker = ({ label, unit, min, max, step = 1, initialValue, onValueChange }: any) => {
    const ITEM_HEIGHT = 60; 
    const length = Math.round((max - min) / step) + 1;
    const rawNumbers = Array.from({ length }, (_, i) => {
        const val = min + (i * step);
        return Number(val.toFixed(1)); 
    });
    
    const numbers = ['', ...rawNumbers, ''];
    
    let initIndex = rawNumbers.findIndex(n => n === initialValue);
    if (initIndex === -1) initIndex = 0;
    
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
            
            {/* CAMBIO CLAVE: Usamos ScrollView con nestedScrollEnabled */}
            <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleScroll}
            nestedScrollEnabled={true} // ¡Esto permite que gire aunque esté dentro de otra pantalla!
            contentOffset={{ x: 0, y: initIndex * ITEM_HEIGHT }} // Posición inicial
            >
            {numbers.map((item, index) => (
                <View key={index} style={[pickerStyles.item, { height: ITEM_HEIGHT }]}>
                <Text style={[pickerStyles.itemText, item === '' ? null : { color: '#999' }]}>
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
    const datosPrevios = route.params?.datosPrevios || {};
    const diagnosticos = datosPrevios.diagnosticos || [];

    const [labData, setLabData] = useState<any>({});
    const [imageUri, setImageUri] = useState<string | null>(null);

    const showDiabetes = diagnosticos.includes('Diabetes');
    const showHipertension = diagnosticos.includes('Presión Alta');
    const showColesterol = diagnosticos.includes('Colesterol Alto');

    const hasSpecificLabs = showDiabetes || showHipertension || showColesterol;

    const handleImageOption = () => {
        Alert.alert(
        "Adjuntar Laboratorio",
        "¿De dónde desea obtener la imagen?",
        [
            { text: "Tomar Foto", onPress: takePhoto },
            { text: "Elegir de Galería", onPress: pickImage },
            { text: "Cancelar", style: "cancel" }
        ]
        );
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
        Alert.alert("Permiso necesario", "Necesitamos acceso a la cámara para escanear sus laboratorios.");
        return;
        }
        const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8, 
        });
        if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
        Alert.alert("Permiso necesario", "Necesitamos acceso a su galería para subir la foto.");
        return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        });
        if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        const todosLosDatos = {
        ...datosPrevios,
        laboratorios: labData,
        fotoAdjunta: imageUri 
        };
        console.log("Datos enviados a Análisis:", todosLosDatos);
        navigation.navigate('Habits', { datosPrevios: todosLosDatos });
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="#333" />
            </TouchableOpacity>
        </View>

        {/* Regresamos al ScrollView normal para la pantalla */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>VALORES DE{'\n'}LABORATORIO</Text>

            {imageUri ? (
            <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.changeImageButton} onPress={handleImageOption}>
                <Ionicons name="refresh-circle-outline" size={24} color="#FFF" />
                <Text style={styles.changeImageText}>Cambiar foto</Text>
                </TouchableOpacity>
            </View>
            ) : (
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={handleImageOption}>
                <Ionicons name="camera-outline" size={40} color="#7EBAE4" />
                <Text style={styles.uploadTitle}>ADJUNTAR FOTO</Text>
                <Text style={styles.uploadSubtitle}>(Toque para escanear sus análisis)</Text>
            </TouchableOpacity>
            )}

            {hasSpecificLabs && (
            <>
                <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
                <View style={styles.line} />
                </View>

                {showDiabetes && (
                <>
                    <WheelPicker 
                    label="1. Nivel de Glucosa" unit="mg/dL" 
                    min={60} max={300} step={1} initialValue={110}
                    onValueChange={(val: number) => setLabData({...labData, glucosa: val})} 
                    />
                    <WheelPicker 
                    label="2. Hemoglobina Glicosilada" unit="%" 
                    min={4} max={15} step={0.1} initialValue={6.5}
                    onValueChange={(val: number) => setLabData({...labData, hemoglobina: val})} 
                    />
                </>
                )}

                {showHipertension && (
                <>
                    <WheelPicker 
                    label="Presión Sistólica (Alta)" unit="mmHg" 
                    min={90} max={200} step={1} initialValue={120}
                    onValueChange={(val: number) => setLabData({...labData, sistolica: val})} 
                    />
                    <WheelPicker 
                    label="Presión Diastólica (Baja)" unit="mmHg" 
                    min={60} max={130} step={1} initialValue={80}
                    onValueChange={(val: number) => setLabData({...labData, diastolica: val})} 
                    />
                </>
                )}

                {showColesterol && (
                <WheelPicker 
                    label="Colesterol Total" unit="mg/dL" 
                    min={100} max={400} step={1} initialValue={200}
                    onValueChange={(val: number) => setLabData({...labData, colesterol: val})} 
                />
                )}
            </>
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
    imagePreviewContainer: { width: '100%', alignItems: 'center', marginBottom: 20 },
    previewImage: { width: '100%', height: 200, borderRadius: 15, borderWidth: 1, borderColor: '#CCC', marginBottom: 10 },
    changeImageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7EBAE4', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    changeImageText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 30, marginTop: 10 },
    line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14, fontWeight: 'bold' },
    continueButton: {
        backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%',
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
    },
    continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
    });