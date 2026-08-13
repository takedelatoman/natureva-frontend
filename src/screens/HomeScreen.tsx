import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from 'react-native';

export default function HomeScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.25,
          duration: 1200, 
          useNativeDriver: true, 
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />

      <View style={styles.content}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.greetingText}>¡HOLA</Text>
          <Text style={styles.titleText}>BIENVENIDO A</Text>
          <Text style={styles.brandText}>NaturMD!</Text>
        </View>

        {/* --- CAJA INVISIBLE PARA NO EMPUJAR EL TEXTO --- */}
        <View style={styles.logoContainer}>
          <Animated.Image 
            source={require('../../assets/logo.png')} 
            style={[
              styles.logo, 
              { transform: [{ scale: scaleAnim }] }
            ]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.subtitle}>
          Comencemos a cuidar su salud{'\n'}naturalmente
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')} 
      >
        <View style={styles.buttonIconPlaceholder} />
        <Text style={styles.buttonText}>INICIAR CONSULTA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
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
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greetingText: {
    fontSize: 26, 
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 30, 
    fontWeight: '900',
    color: '#000',
    marginTop: 5,
  },
  brandText: {
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },

  // ==========================================
  // EL TRUCO DE DISEÑO PARA EL LOGO GIGANTE
  // ==========================================
  logoContainer: {
    height: 250, // Mantiene el mismo espacio de antes en la pantalla
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    zIndex: -1, // Si el logo crece mucho, quedará por detrás de las letras sin taparlas
  },
  logo: {
    width: 380, // ¡Tamaño gigante!
    height: 380,
    position: 'absolute', // Magia: flota sin empujar a sus vecinos
  },
  // ==========================================

  subtitle: {
    fontSize: 18, 
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7EBAE4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5, 
    marginBottom: 20,
  },
  buttonIconPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
});