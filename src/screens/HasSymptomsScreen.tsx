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

    export default function HasSymptomsScreen({ route, navigation }: any) {
    // Recibimos los datos de la pantalla anterior (si es que vienen de la Página 5)
    const datosPrevios = route.params?.datosPrevios || null;

    const handleYes = () => {
        // Si toca SI, lo enviamos a la Página 7 (Qué síntomas tienes)
        navigation.navigate('SelectSymptoms', { datosPrevios });
    };

    const handleNo = () => {
        // Si toca NO, nos saltamos la Pág 7 y lo enviamos a la Página 8 (Valores de Laboratorio)
        navigation.navigate('HasLabs', { datosPrevios });
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topDecoration} />

        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={32} color="#333" />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            
            <Text style={styles.title}>
            ¿TIENES ALGÚN{'\n'}SÍNTOMA?
            </Text>

            {/* Botones Cuadrados Gigantes para adultos mayores */}
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
        fontSize: 30, // Letra muy grande y clara
        fontWeight: '900', 
        color: '#000',
        textAlign: 'center',
        marginBottom: 60,
        letterSpacing: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 25, // Un poco más de espacio entre los botones
    },
    squareButton: {
        backgroundColor: '#7EBAE4',
        width: 120, // Botones un poco más grandes para mayor accesibilidad
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6, // Sombra más pronunciada en Android
        borderRadius: 10, // Bordes apenas redondeados para que no sean tan filosos
    },
    buttonText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#000',
    }
    });