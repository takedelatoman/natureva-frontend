    import React, { useState } from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Platform, 
    StatusBar,
    ScrollView,
    TextInput
    } from 'react-native';
    import { SafeAreaView } from 'react-native-safe-area-context'; 
    import { Ionicons } from '@expo/vector-icons';

    export default function HabitsScreen({ route, navigation }: any) {
    // Traemos los datos acumulados (Diagnósticos, Síntomas, Laboratorios)
    const datosPrevios = route.params?.datosPrevios || {};

    const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
    const [otherHabit, setOtherHabit] = useState<string>('');

    // Lista de hábitos basada en los mensajes de tu jefe
    const habitsList = [
        'No hago ejercicio', 'Bebo poca agua', 
        'Mucha comida rápida', 'Exceso de azúcar / dulces',
        'Fumo tabaco / vapeo', 'Consumo alcohol frecuente',
        'Duermo menos de 6 horas', 'Paso mucho tiempo sentado',
        'Dieta balanceada', 'Hago ejercicio regular'
    ];

    const toggleHabit = (habit: string) => {
        if (selectedHabits.includes(habit)) {
        setSelectedHabits(selectedHabits.filter(h => h !== habit));
        } else {
        setSelectedHabits([...selectedHabits, habit]);
        }
    };

    const handleContinue = () => {
        const todosLosDatos = {
        ...datosPrevios,
        habitos: selectedHabits,
        otrosHabitos: otherHabit
        };
        // Pasamos a la pantalla de Salud Mental
        navigation.navigate('MentalRisk', { datosPrevios: todosLosDatos });
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="#333" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <Text style={styles.title}>HÁBITOS Y{'\n'}DIETA</Text>
            <Text style={styles.subtitle}>Seleccione los hábitos que mejor describen su día a día.</Text>

            <View style={styles.chipContainer}>
            {habitsList.map((item, index) => {
                const isSelected = selectedHabits.includes(item);
                return (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleHabit(item)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : ''}{item}
                    </Text>
                </TouchableOpacity>
                );
            })}
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>¿Otro hábito relevante?</Text>
            <TextInput 
                style={styles.textInput}
                placeholder="Ej: Ayuno intermitente..."
                placeholderTextColor="#999"
                value={otherHabit}
                onChangeText={setOtherHabit}
            />
            </View>

            <View style={{flex: 1, minHeight: 40}} />

            <TouchableOpacity 
            style={[styles.continueButton, (selectedHabits.length === 0 && !otherHabit) && styles.disabledButton]}
            disabled={selectedHabits.length === 0 && !otherHabit}
            onPress={handleContinue}
            >
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
            </TouchableOpacity>

        </ScrollView>
        </SafeAreaView>
    );
    }

    // (He usado los mismos estilos accesibles que ya probamos que funcionan)
    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    topBar: { width: '100%', paddingHorizontal: 20, top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40), alignItems: 'flex-start', zIndex: 10, position: 'absolute' },
    backButton: { padding: 5, backgroundColor: '#FFF', borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 120 : 130, paddingBottom: 40, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 10, letterSpacing: 0.5 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginBottom: 20 },
    chip: { width: '48%', backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 18, paddingHorizontal: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, minHeight: 70 },
    chipSelected: { backgroundColor: '#EBF5FB', borderColor: '#7EBAE4', borderWidth: 3 },
    chipText: { fontSize: 15, color: '#555', fontWeight: 'bold', textAlign: 'center' },
    chipTextSelected: { color: '#0056b3', fontSize: 16 },
    inputContainer: { width: '100%', marginBottom: 30 },
    inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    textInput: { width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 18, borderWidth: 2, borderColor: '#E5E7EB', fontSize: 16 },
    continueButton: { backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
    disabledButton: { opacity: 0.5 },
    continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
    });