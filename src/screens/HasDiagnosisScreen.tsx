    import React from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Platform, 
    StatusBar 
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';

    export default function HasDiagnosisScreen({ navigation }: any) {
    
    const handleYes = () => {
        // Si toca SI, lo enviamos a la Página 5 (Indique su diagnóstico)
        navigation.navigate('SelectDiagnosis');
    };

    const handleNo = () => {
        // Si toca NO, nos saltamos la Pág 5 y lo enviamos directo a la Página 6 (¿Tienes algún síntoma?)
        navigation.navigate('HasSymptoms');
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topDecoration} />

        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            
            {/* Título idéntico al mockup */}
            <Text style={styles.title}>
            TIENES ALGÚN{'\n'}DIAGNÓSTICO?
            </Text>

            {/* Botones Cuadrados SI / NO */}
            <View style={styles.buttonsContainer}>
            <TouchableOpacity 
                style={styles.squareButton} 
                activeOpacity={0.7}
                onPress={handleYes}
            >
                <Text style={styles.buttonText}>SI</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.squareButton} 
                activeOpacity={0.7}
                onPress={handleNo}
            >
                <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
            </View>

        </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    topDecoration: {
        position: 'absolute',
        top: -80,
        right: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 35,
        borderColor: '#7EBAE4',
        opacity: 0.8,
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '900', // Muy negrita, como en el mockup
        color: '#000',
        textAlign: 'center',
        marginBottom: 60,
        letterSpacing: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20, // Espacio entre los dos cuadrados
    },
    squareButton: {
        backgroundColor: '#7EBAE4',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000', // Borde negro como en el mockup
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
    }
    });