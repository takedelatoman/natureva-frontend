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

    export default function MentalRiskScreen({ route, navigation }: any) {
    const datosPrevios = route.params?.datosPrevios || {};

    const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
    const [otherRisk, setOtherRisk] = useState<string>('');

    const risksList = [
        'Perdí a un familiar/ser querido', 'Divorcio o Separación', 
        'Sufro de maltrato', 'Estrés laboral o económico',
        'Siento tristeza constante', 'Sufro de mucha ansiedad',
        'Me siento muy solo/a', 'Ninguna de las anteriores'
    ];

    const toggleRisk = (risk: string) => {
        // Si toca "Ninguna", desmarcamos todo lo demás
        if (risk === 'Ninguna de las anteriores') {
        setSelectedRisks(['Ninguna de las anteriores']);
        return;
        }
        // Si toca otra cosa, quitamos "Ninguna" de la lista
        let newSelected = selectedRisks.filter(r => r !== 'Ninguna de las anteriores');
        
        if (newSelected.includes(risk)) {
        newSelected = newSelected.filter(r => r !== risk);
        } else {
        newSelected.push(risk);
        }
        setSelectedRisks(newSelected);
    };

    const handleContinue = () => {
        const todosLosDatos = {
        ...datosPrevios,
        saludMental: selectedRisks,
        otrosRiesgos: otherRisk
        };
        console.log("¡JSON FINAL LISTO PARA EL BACKEND!", JSON.stringify(todosLosDatos, null, 2));
        
        // Ahora SÍ, vamos a la pantalla de Analizando
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
            
            <Text style={styles.title}>FACTORES DE{'\n'}RIESGO Y MENTAL</Text>
            <Text style={styles.subtitle}>Las emociones impactan su salud física. ¿Ha experimentado algo de esto últimamente?</Text>

            <View style={styles.chipContainer}>
            {risksList.map((item, index) => {
                const isSelected = selectedRisks.includes(item);
                return (
                <TouchableOpacity 
                    key={index} 
                    style={[
                    styles.chip, 
                    isSelected && styles.chipSelected,
                    // Le damos un diseño especial a la opción "Ninguna"
                    item === 'Ninguna de las anteriores' && { width: '100%', marginTop: 10 }
                    ]}
                    onPress={() => toggleRisk(item)}
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
            <Text style={styles.inputLabel}>¿Desea compartir algo más? (Opcional)</Text>
            <TextInput 
                style={styles.textInput}
                placeholder="Nos importa su bienestar integral..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
                value={otherRisk}
                onChangeText={setOtherRisk}
            />
            </View>

            <View style={{flex: 1, minHeight: 40}} />

            <TouchableOpacity 
            style={[styles.continueButton, (selectedRisks.length === 0 && !otherRisk) && styles.disabledButton]}
            disabled={selectedRisks.length === 0 && !otherRisk}
            onPress={handleContinue}
            >
            <Text style={styles.continueButtonText}>FINALIZAR CUESTIONARIO</Text>
            </TouchableOpacity>

        </ScrollView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    topBar: { width: '100%', paddingHorizontal: 20, top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40), alignItems: 'flex-start', zIndex: 10, position: 'absolute' },
    backButton: { padding: 5, backgroundColor: '#FFF', borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 120 : 130, paddingBottom: 40, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 10, letterSpacing: 0.5 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10, lineHeight: 22 },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginBottom: 20 },
    chip: { width: '48%', backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 18, paddingHorizontal: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, minHeight: 70 },
    chipSelected: { backgroundColor: '#EBF5FB', borderColor: '#7EBAE4', borderWidth: 3 },
    chipText: { fontSize: 14, color: '#555', fontWeight: 'bold', textAlign: 'center' },
    chipTextSelected: { color: '#0056b3', fontSize: 16 },
    inputContainer: { width: '100%', marginBottom: 30 },
    inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    textInput: { width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 18, borderWidth: 2, borderColor: '#E5E7EB', fontSize: 16, textAlignVertical: 'top', minHeight: 90 },
    continueButton: { backgroundColor: '#7EBAE4', paddingVertical: 20, borderRadius: 30, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
    disabledButton: { opacity: 0.5 },
    continueButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
    });