    import React, { useState } from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    SafeAreaView, 
    ScrollView, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    StatusBar 
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';

    export default function SelectSymptomsScreen({ route, navigation }: any) {
    // Recibimos los datos que vienen desde la selección de diagnósticos (si es que los hay)
    const datosPrevios = route.params?.datosPrevios || {};

    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [otherSymptom, setOtherSymptom] = useState<string>('');

    // Lista de unos 20 síntomas comunes y claros para adultos
    const symptomsList = [
        'Cansancio Extremo', 'Dolor Articular', 
        'Dolor de Espalda', 'Mareos / Vértigo',
        'Dolor de Cabeza', 'Visión Borrosa',
        'Acidez Estomacal', 'Estreñimiento',
        'Palpitaciones', 'Calambres',
        'Zumbido en Oídos', 'Falta de Aire',
        'Boca Seca', 'Hinchazón de Pies',
        'Insomnio', 'Sofocos / Calores',
        'Náuseas', 'Dificultad al Orinar',
        'Pérdida de Memoria', 'Temblores'
    ];

    const toggleSymptom = (symptom: string) => {
        if (selectedSymptoms.includes(symptom)) {
        setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleContinue = () => {
        // Juntamos la información del diagnóstico (si existe) con los síntomas de ahora
        const todosLosDatos = {
        ...datosPrevios,
        sintomas: selectedSymptoms,
        otrosSintomas: otherSymptom
        };
        
        console.log("Datos acumulados hasta ahora:", todosLosDatos);
        
        // Viajamos a la Página 8 (Valores de Laboratorio) pasándole TODO el paquete de datos
        navigation.navigate('HasLabs', { datosPrevios: todosLosDatos });
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topDecoration} />

        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={true}
            >
            
            <Text style={styles.title}>
                QUÉ SÍNTOMAS{'\n'}TIENES?
            </Text>

            {/* Indicador visual de desplazamiento */}
            <View style={styles.scrollHintContainer}>
                <Ionicons name="chevron-down-circle" size={20} color="#7EBAE4" />
                <Text style={styles.scrollHintText}>Desliza hacia abajo para ver más opciones</Text>
            </View>

            <View style={styles.chipContainer}>
                {symptomsList.map((item, index) => {
                const isSelected = selectedSymptoms.includes(item);
                return (
                    <TouchableOpacity 
                    key={index} 
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleSymptom(item)}
                    activeOpacity={0.7}
                    >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {isSelected ? '✓ ' : ''}{item}
                    </Text>
                    </TouchableOpacity>
                );
                })}
            </View>

            {/* Cajita para Otros */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Escribe otro síntoma:</Text>
                <TextInput 
                style={styles.textInput}
                placeholder="Ej: Picazón en la piel..."
                placeholderTextColor="#999"
                value={otherSymptom}
                onChangeText={setOtherSymptom}
                />
            </View>

            <View style={{flex: 1, minHeight: 20}} />

            {/* Botón Continuar */}
            <TouchableOpacity 
                style={[
                styles.continueButton, 
                (selectedSymptoms.length === 0 && !otherSymptom) && styles.disabledButton
                ]}
                disabled={selectedSymptoms.length === 0 && !otherSymptom}
                onPress={handleContinue}
            >
                <Text style={styles.continueButtonText}>CONTINUAR</Text>
            </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    topDecoration: {
        position: 'absolute', top: -80, right: -80, width: 200, height: 200,
        borderRadius: 100, borderWidth: 35, borderColor: '#7EBAE4', opacity: 0.8,
    },
    topBar: {
        width: '100%', paddingHorizontal: 20,
        top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
        alignItems: 'flex-start', zIndex: 10, position: 'absolute', 
    },
    backButton: { padding: 5 },
    keyboardView: { flex: 1 },
    scrollContent: {
        flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 120 : 140, paddingBottom: 40, alignItems: 'center',
    },
    title: {
        fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5,
    },
    scrollHintContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF',
        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 25,
        borderWidth: 1, borderColor: '#7EBAE4',
    },
    scrollHintText: {
        color: '#333', fontSize: 14, fontWeight: 'bold', marginLeft: 8,
    },
    chipContainer: {
        flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginBottom: 30,
    },
    chip: {
        width: '48%', backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E5E7EB',
        paddingVertical: 18, paddingHorizontal: 10, borderRadius: 15, alignItems: 'center', 
        justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, minHeight: 70,
    },
    chipSelected: {
        backgroundColor: '#EBF5FB', borderColor: '#7EBAE4', borderWidth: 3,
    },
    chipText: { 
        fontSize: 15, color: '#555', fontWeight: 'bold', textAlign: 'center',
    },
    chipTextSelected: { color: '#0056b3', fontSize: 16 },
    inputContainer: {
        width: '100%', marginBottom: 30,
    },
    inputLabel: {
        fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10,
    },
    textInput: {
        width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 18,
        borderWidth: 2, borderColor: '#E5E7EB', fontSize: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    continueButton: {
        backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%',
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
    },
    disabledButton: { opacity: 0.5 },
    continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
    });