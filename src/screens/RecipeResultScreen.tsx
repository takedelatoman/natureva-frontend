    import React, { useState } from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    ScrollView, 
    Platform, 
    StatusBar,
    TextInput,
    KeyboardAvoidingView
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';

    export default function RecipeResultScreen({ route, navigation }: any) {
    // Aquí llegan todos los datos recolectados (en el futuro se usarán para generar esta receta dinámicamente)
    const datosPrevios = route.params?.datosPrevios || {};

    // Estado para las "pestañas" superiores
    const [activeTab, setActiveTab] = useState('Remedios'); 
    const [doubtText, setDoubtText] = useState('');

    const tabs = ['Alimentación', 'Ejercicios', 'Remedios', 'Descansos'];

    const goHome = () => {
        // Volvemos al inicio y borramos el historial para una nueva consulta
        navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topDecoration} />

        <View style={styles.topBar}>
            <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <Ionicons name="home-outline" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <Text style={styles.title}>
                SU RECOMENDACIÓN NATURAL{'\n'}NATURMD
            </Text>

            {/* --- PESTAÑAS (TABS) --- */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>

            {/* --- CONTENIDO DE LA RECETA --- */}
            <View style={styles.recipeCard}>
                
                <View style={styles.timeSection}>
                <Text style={styles.timeTitle}>MAÑANA</Text>
                <Text style={styles.recipeText}>• Té de jengibre y cúrcuma en ayunas.</Text>
                </View>
                
                <View style={styles.divider} />

                <View style={styles.timeSection}>
                <Text style={styles.timeTitle}>NOCHE</Text>
                <Text style={styles.recipeText}>• Magnesio (suplemento natural) antes de dormir.</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.timeSection}>
                <Text style={styles.timeTitle}>NOTAS ADICIONALES</Text>
                <Text style={styles.recipeText}>• Caminar 30 minutos al día.</Text>
                <Text style={styles.recipeText}>• Evitar azúcares procesados.</Text>
                </View>

            </View>

            {/* --- CAJA DE DUDAS (CHAT) --- */}
            <View style={styles.chatContainer}>
                <Text style={styles.chatLabel}>¿Tiene dudas sobre algo?</Text>
                <View style={styles.chatInputWrapper}>
                <TextInput 
                    style={styles.chatInput}
                    placeholder="Escriba su duda aquí..."
                    placeholderTextColor="#999"
                    value={doubtText}
                    onChangeText={setDoubtText}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="#FFF" />
                </TouchableOpacity>
                </View>
            </View>

            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    topDecoration: {
        position: 'absolute', top: -80, right: -80, width: 200, height: 200,
        borderRadius: 100, borderWidth: 35, borderColor: '#7EBAE4', opacity: 0.8,
    },
    topBar: {
        width: '100%', paddingHorizontal: 20,
        top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
        alignItems: 'flex-start', zIndex: 10, position: 'absolute', 
    },
    homeButton: { padding: 5, backgroundColor: '#FFF', borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
    keyboardView: { flex: 1 },
    scrollContent: {
        flexGrow: 1, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 120 : 130, paddingBottom: 40, alignItems: 'center',
    },
    title: { fontSize: 20, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 25, letterSpacing: 0.5 },
    
    // Pestañas
    tabsContainer: {
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginBottom: 25, gap: 10
    },
    tabButton: {
        width: '47%', paddingVertical: 12, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E5E7EB',
        borderRadius: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    tabButtonActive: { borderColor: '#7EBAE4', backgroundColor: '#EBF5FB' },
    tabText: { fontSize: 13, fontWeight: 'bold', color: '#666' },
    tabTextActive: { color: '#0056b3' },

    // Tarjeta de la receta
    recipeCard: {
        width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 30,
    },
    timeSection: { marginBottom: 15 },
    timeTitle: { fontSize: 14, fontWeight: '900', color: '#333', marginBottom: 5 },
    recipeText: { fontSize: 15, color: '#555', lineHeight: 22, marginLeft: 5 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },

    // Cajita de dudas
    chatContainer: { width: '100%' },
    chatLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    chatInputWrapper: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 15,
        paddingVertical: 5, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1,
    },
    chatInput: { flex: 1, height: 45, fontSize: 15, color: '#333' },
    sendButton: {
        backgroundColor: '#7EBAE4', width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 10,
    }
    });