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

    export default function DiagnosisScreen({ navigation }: any) {
    // Aquí guardamos los síntomas que el usuario va tocando (es una lista/Array)
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [otherDetails, setOtherDetails] = useState<string>('');

    // Lista de síntomas comunes (puedes pedirle a tu backend que te envíe más después)
    const symptomsList = [
        'Dolor de cabeza', 'Estrés', 'Insomnio', 'Mala digestión', 
        'Ansiedad', 'Dolor muscular', 'Fatiga', 'Resfriado',
        'Alergia', 'Falta de energía'
    ];

    // Función mágica que agrega o quita un síntoma si lo tocas
    const toggleSymptom = (symptom: string) => {
        if (selectedSymptoms.includes(symptom)) {
        // Si ya estaba seleccionado, lo quitamos
        setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
        // Si no estaba, lo agregamos a la lista
        setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleAnalyze = () => {
        // Armamos el JSON final para mandarle a la IA o al Backend
        const data = {
        sintomasPrincipales: selectedSymptoms,
        detallesAdicionales: otherDetails
        };
        console.log("Analizando los siguientes síntomas:", data);
        
        // Aquí viajaríamos a la pantalla de la Receta o Resultados
        // navigation.navigate('RecipeResult'); 
    };

    return (
        <SafeAreaView style={styles.container}>
        {/* Botón de Atrás blindado para cualquier celular */}
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
                <Text style={styles.title}>¿Qué te trae por aquí?</Text>
                <Text style={styles.subtitle}>Selecciona los síntomas o malestares que presentas hoy.</Text>
            </View>

            {/* --- ZONA DE "CHIPS" DE SÍNTOMAS --- */}
            <View style={styles.chipContainer}>
                {symptomsList.map((symptom, index) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                    <TouchableOpacity 
                    key={index} 
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleSymptom(symptom)}
                    >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {isSelected ? '✓ ' : ''}{symptom}
                    </Text>
                    </TouchableOpacity>
                );
                })}
            </View>

            {/* --- ZONA DE TEXTO LIBRE --- */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>¿Sientes algo más? (Opcional)</Text>
                <TextInput 
                style={styles.textInput}
                placeholder="Describe con tus propias palabras cómo te sientes..."
                placeholderTextColor="#999"
                multiline={true} // Permite escribir varios renglones
                numberOfLines={4} // La caja nace siendo alta
                value={otherDetails}
                onChangeText={setOtherDetails}
                />
            </View>

            {/* Espaciador mágico */}
            <View style={{flex: 1, minHeight: 40}} />

            <TouchableOpacity 
                // Se deshabilita si no tocó ningún síntoma Y tampoco escribió nada
                style={[styles.continueButton, selectedSymptoms.length === 0 && !otherDetails && styles.disabledButton]}
                disabled={selectedSymptoms.length === 0 && !otherDetails}
                onPress={handleAnalyze}
            >
                <Text style={styles.continueButtonText}>ANALIZAR Y TRATAR</Text>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 120, // Empuja el contenido hacia abajo para que no choque con la flecha
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Esto hace que si no caben en la línea, pasen a la de abajo automáticamente
        width: '100%',
        marginBottom: 30,
        gap: 10, // Espacio entre los chips (necesita React Native moderno, Expo 54 lo tiene)
    },
    chip: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    chipSelected: {
        backgroundColor: '#7EBAE4',
        borderColor: '#7EBAE4',
    },
    chipText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
    },
    chipTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        fontSize: 15,
        minHeight: 120, // Altura inicial grande
        textAlignVertical: 'top', // Hace que el texto empiece arriba, no en el centro
    },
    continueButton: {
        backgroundColor: '#7EBAE4',
        paddingVertical: 18,
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
        opacity: 0.5,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
    });