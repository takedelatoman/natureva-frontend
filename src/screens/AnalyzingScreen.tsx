    import React, { useEffect } from 'react';
    import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    ActivityIndicator, 
    Image 
    } from 'react-native';

    export default function AnalyzingScreen({ route, navigation }: any) {
    const datosPrevios = route.params?.datosPrevios || {};

    useEffect(() => {
        // Simulamos que la IA o el Backend está pensando durante 3.5 segundos
        const timer = setTimeout(() => {
        // Usamos "replace" en lugar de "navigate" para que el usuario 
        // no pueda regresar a esta pantalla de carga usando la flecha de atrás del celular
        navigation.replace('RecipeResult', { datosPrevios });
        }, 3500);

        // Limpiamos el temporizador si el componente se desmonta por alguna razón
        return () => clearTimeout(timer);
    }, [navigation, datosPrevios]);

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.topDecoration} />

        <View style={styles.content}>
            
            {/* Logo central (Asegúrate de que la ruta a tu logo sea correcta) */}
            <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
            />

            {/* El circulito nativo de carga (Spinner) */}
            <ActivityIndicator size="large" color="#7EBAE4" style={styles.spinner} />

            <Text style={styles.title}>
            NaturMD ESTÁ{'\n'}ANALIZANDO SU{'\n'}INFORMACIÓN...
            </Text>

            <Text style={styles.subtitle}>
            Estamos procesando sus{'\n'}
            datosn y/o foto(s).{'\n'}
            Por favor espere unos{'\n'}
            segundos.
            </Text>

        </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA', // Si en el mockup es un poco más azul, puedes cambiarlo a '#EBF5FB'
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logo: {
        width: 350,
        height: 350,
        marginBottom: 50,
    },
    spinner: {
        transform: [{ scale: 1.5 }], // Lo hacemos un 50% más grande para que se note bien
        marginBottom: 40,
    },
    
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 1,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    }
    });