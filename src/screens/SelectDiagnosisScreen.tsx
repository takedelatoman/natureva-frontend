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

    export default function SelectDiagnosisScreen({ navigation }: any) {
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
    const [otherDiagnosis, setOtherDiagnosis] = useState<string>('');

    // Lista ampliada a 20 diagnósticos comunes en adultos (+45)
    const diagnosisList = [
        'Diabetes', 'Presión Alta', 
        'Colesterol Alto', 'Artritis / Artrosis', 
        'Osteoporosis', 'Hipotiroidismo',
        'Gastritis / Úlcera', 'Problemas de Próstata',
        'Menopausia', 'Cardiopatía',
        'Asma', 'EPOC (Pulmones)',
        'Migraña Crónica', 'Insuficiencia Renal',
        'Glaucoma / Cataratas', 'Insomnio Crónico',
        'Ansiedad / Depresión', 'Obesidad',
        'Ácido Úrico / Gota', 'Hígado Graso'
    ];

    const toggleDiagnosis = (diagnosis: string) => {
        if (selectedDiagnoses.includes(diagnosis)) {
        setSelectedDiagnoses(selectedDiagnoses.filter(d => d !== diagnosis));
        } else {
        setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
        }
    };

    const handleContinue = () => {
        const datosDiagnostico = {
        diagnosticos: selectedDiagnoses,
        otros: otherDiagnosis
        };
        console.log("Avanzando con estos diagnósticos:", datosDiagnostico);
        navigation.navigate('HasSymptoms', { datosPrevios: datosDiagnostico });
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
            showsVerticalScrollIndicator={true} // Obligamos a mostrar la barra lateral para mayor claridad
            >
            
            <Text style={styles.title}>
                INDIQUE SU{'\n'}DIAGNÓSTICO
            </Text>

            {/* Indicador visual claro para adultos mayores */}
            <View style={styles.scrollHintContainer}>
                <Ionicons name="chevron-down-circle" size={20} color="#7EBAE4" />
                <Text style={styles.scrollHintText}>Desliza hacia abajo para ver más opciones</Text>
            </View>

            <View style={styles.chipContainer}>
                {diagnosisList.map((item, index) => {
                const isSelected = selectedDiagnoses.includes(item);
                return (
                    <TouchableOpacity 
                    key={index} 
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleDiagnosis(item)}
                    activeOpacity={0.7} // Efecto de toque más suave
                    >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {isSelected ? '✓ ' : ''}{item}
                    </Text>
                    </TouchableOpacity>
                );
                })}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>¿Tiene otro? Escríbalo aquí:</Text>
                <TextInput 
                style={styles.textInput}
                placeholder="Ej: Hernia de disco..."
                placeholderTextColor="#999"
                value={otherDiagnosis}
                onChangeText={setOtherDiagnosis}
                />
            </View>

            <View style={{flex: 1, minHeight: 20}} />

            <TouchableOpacity 
                style={[
                styles.continueButton, 
                (selectedDiagnoses.length === 0 && !otherDiagnosis) && styles.disabledButton
                ]}
                disabled={selectedDiagnoses.length === 0 && !otherDiagnosis}
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
    // topBar a prueba de Android e iOS
    topBar: {
        width: '100%', paddingHorizontal: 20,
        top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
        alignItems: 'flex-start', zIndex: 10, position: 'absolute', 
    },
    backButton: { padding: 5 },
    keyboardView: { flex: 1 },
    scrollContent: {
        flexGrow: 1, 
        paddingHorizontal: 20, 
        // Espacio enorme arriba para que el título nunca choque con la flecha en ningún Android
        paddingTop: Platform.OS === 'ios' ? 120 : 140, 
        paddingBottom: 40, 
        alignItems: 'center',
    },
    title: {
        fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5,
    },
    
    // --- ESTILOS PARA LA PISTA DE DESPLAZAMIENTO ---
    scrollHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#7EBAE4',
    },
    scrollHintText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    // --- BOTONES (CHIPS) ADAPTADOS PARA MAYORES DE 45 ---
    chipContainer: {
        flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginBottom: 30,
    },
    chip: {
        width: '48%', 
        backgroundColor: '#FFF', 
        borderWidth: 2, // Bordes más gruesos para que se vean como botones
        borderColor: '#E5E7EB',
        paddingVertical: 18, // Mucho más altos para dedos imprecisos
        paddingHorizontal: 10,
        borderRadius: 15, // Bordes menos redondos (más tipo tarjeta)
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Sombra fuerte en Android para que parezcan botones físicos
        minHeight: 70, // Altura mínima garantizada
    },
    chipSelected: {
        backgroundColor: '#EBF5FB', borderColor: '#7EBAE4', borderWidth: 3, // Borde muy notorio al tocar
    },
    chipText: { 
        fontSize: 15, // Letra más grande
        color: '#555', 
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chipTextSelected: { color: '#0056b3', fontSize: 16 }, // Color más oscuro y un poco más grande al seleccionar
    
    // --- CAJA DE TEXTO PARA OTROS ---
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
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