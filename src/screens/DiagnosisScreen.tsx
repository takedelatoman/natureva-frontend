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
    // 1. NUEVO ESTADO: Pregunta principal SÍ/NO
    const [hasDiagnosis, setHasDiagnosis] = useState<boolean | null>(null);

    // Estados para guardar lo que selecciona
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [otherDetails, setOtherDetails] = useState<string>('');

    // Listas de datos según lo que responda
    const diagnosisList = [
        'Diabetes', 'Hipertensión', 'Artritis', 'Gastritis', 
        'Asma', 'Migraña Crónica', 'Hipotiroidismo', 'Ansiedad Clínica'
    ];

    const symptomsList = [
        'Dolor de cabeza', 'Estrés', 'Insomnio', 'Mala digestión', 
        'Dolor muscular', 'Fatiga', 'Resfriado', 'Falta de energía'
    ];

    // Función para seleccionar/deseleccionar los chips
    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
        setSelectedItems([...selectedItems, item]);
        }
    };

    // Si cambia de opinión (de SÍ a NO), limpiamos lo que había marcado antes
    const handleHasDiagnosisSelect = (value: boolean) => {
        if (hasDiagnosis !== value) {
        setHasDiagnosis(value);
        setSelectedItems([]); 
        }
    };

    const handleAnalyze = () => {
        const data = {
        tieneDiagnostico: hasDiagnosis,
        // Si dijo que SÍ, mandamos "diagnosticos", si dijo que NO, mandamos "sintomas"
        [hasDiagnosis ? 'diagnosticos' : 'sintomas']: selectedItems,
        detallesAdicionales: otherDetails
        };
        console.log("Datos médicos listos para el backend:", data);
        
        // navigation.navigate('RecipeResult'); 
    };

    // Variable para saber qué lista mostrar según la respuesta
    const currentList = hasDiagnosis ? diagnosisList : symptomsList;

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
                <Text style={styles.title}>Evaluación Médica</Text>
                <Text style={styles.subtitle}>Ayúdenos a entender mejor su estado actual de salud.</Text>
            </View>

            {/* --- 1. PREGUNTA PRINCIPAL (SÍ/NO) --- */}
            <View style={styles.questionSection}>
                <Text style={styles.questionText}>¿Tiene un diagnóstico médico previo?</Text>
                <View style={styles.yesNoContainer}>
                <TouchableOpacity 
                    style={[
                    styles.choiceButton, 
                    hasDiagnosis === true && styles.choiceButtonSelected
                    ]}
                    onPress={() => handleHasDiagnosisSelect(true)}
                >
                    <Text style={[styles.choiceText, hasDiagnosis === true && styles.choiceTextSelected]}>
                    SÍ, TENGO
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                    styles.choiceButton, 
                    hasDiagnosis === false && styles.choiceButtonSelected
                    ]}
                    onPress={() => handleHasDiagnosisSelect(false)}
                >
                    <Text style={[styles.choiceText, hasDiagnosis === false && styles.choiceTextSelected]}>
                    NO, SOLO SÍNTOMAS
                    </Text>
                </TouchableOpacity>
                </View>
            </View>

            {/* --- 2. ZONA DINÁMICA (Solo aparece después de tocar SÍ o NO) --- */}
            {hasDiagnosis !== null && (
                <View style={{ width: '100%' }}>
                <Text style={styles.dynamicTitle}>
                    {hasDiagnosis ? 'Seleccione sus diagnósticos:' : '¿Qué malestares presenta?'}
                </Text>
                
                <View style={styles.chipContainer}>
                    {currentList.map((item, index) => {
                    const isSelected = selectedItems.includes(item);
                    return (
                        <TouchableOpacity 
                        key={index} 
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleItem(item)}
                        >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {isSelected ? '✓ ' : ''}{item}
                        </Text>
                        </TouchableOpacity>
                    );
                    })}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                    {hasDiagnosis ? '¿Otro diagnóstico? Escríbalo aquí:' : '¿Siente algo más? (Opcional)'}
                    </Text>
                    <TextInput 
                    style={styles.textInput}
                    placeholder={hasDiagnosis ? "Ej: Ovario poliquístico..." : "Describa otros malestares..."}
                    placeholderTextColor="#999"
                    multiline={true} 
                    numberOfLines={4} 
                    value={otherDetails}
                    onChangeText={setOtherDetails}
                    />
                </View>
                </View>
            )}

            <View style={{flex: 1, minHeight: 40}} />

            {/* Botón Final: Solo se activa si respondió SÍ/NO, y si seleccionó algo o escribió algo */}
            <TouchableOpacity 
                style={[
                styles.continueButton, 
                (hasDiagnosis === null || (selectedItems.length === 0 && !otherDetails)) && styles.disabledButton
                ]}
                disabled={hasDiagnosis === null || (selectedItems.length === 0 && !otherDetails)}
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
        paddingTop: 120, 
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

    // --- ESTILOS DE LA PREGUNTA SÍ/NO ---
    questionSection: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    yesNoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    choiceButton: {
        width: '48%',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
    },
    choiceButtonSelected: {
        borderColor: '#7EBAE4',
        backgroundColor: '#F0F8FF', // Un azul muy clarito
    },
    choiceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    choiceTextSelected: {
        color: '#7EBAE4',
    },
    // ------------------------------------

    dynamicTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        width: '100%',
        marginBottom: 30,
        gap: 10, 
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
        minHeight: 100, 
        textAlignVertical: 'top', 
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