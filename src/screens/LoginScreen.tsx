// LoginScreen.tsx - CORREGIDO (CONECTADO AL BACKEND)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [isRegisterModalVisible, setRegisterModalVisible] = useState<boolean>(false);
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  // ========== LOGIN CON BACKEND ==========
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 [Login] Intentando login:', { email });
      
      const response = await authService.login(email, password);
      
      console.log('📥 [Login] Respuesta:', response);

      if (response.success && response.data) {
        const pacienteId = response.data.usuario?.pacienteId;
        const token = response.data.token;
        
        console.log('✅ Login exitoso - pacienteId:', pacienteId);
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('pacienteId', pacienteId);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        Alert.alert('✅ Éxito', 'Login exitoso');
        navigation.navigate('ProfileSetup', { 
          pacienteId: pacienteId,
          usuario: response.data.usuario 
        });
      } else {
        Alert.alert('Error', response?.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ========== LOGIN CON GOOGLE ==========
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.loginGoogle(
        'mock_token_123',
        'test2@gmail.com',
        'Usuario Google'
      );
      
      if (response.success && response.data) {
        const pacienteId = response.data.usuario?.pacienteId;
        const token = response.data.token;
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('pacienteId', pacienteId);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        Alert.alert('✅ Éxito', 'Login con Google exitoso');
        navigation.navigate('ProfileSetup', { 
          pacienteId: pacienteId,
          usuario: response.data.usuario 
        });
      } else {
        Alert.alert('Error', response?.message || 'Error con Google');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ========== REGISTRO CON BACKEND ==========
  const handleRegister = async () => {
    if (!regEmail || !regPassword || !regConfirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 [Register] Registrando:', { email: regEmail });
      
      const response = await authService.register(regEmail, regPassword);
      
      console.log('📥 [Register] Respuesta:', response);

      if (response.success && response.data) {
        const pacienteId = response.data.usuario?.pacienteId;
        const token = response.data.token;
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('pacienteId', pacienteId);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        Alert.alert('✅ Éxito', 'Cuenta creada correctamente');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegisterModalVisible(false);
        navigation.navigate('ProfileSetup', { 
          pacienteId: pacienteId,
          usuario: response.data.usuario 
        });
      } else {
        Alert.alert('Error', response?.message || 'Error al registrar');
      }
    } catch (error) {
      console.error('❌ Error en register:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.topDecoration} />

          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.brandText}>NaturMD</Text>
              <Text style={styles.subtitle}>Inicie sesión en su cuenta</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Correo electrónico" 
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email} 
                onChangeText={setEmail} 
              />
              
              <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                placeholderTextColor="#999"
                secureTextEntry={true} 
                value={password} 
                onChangeText={setPassword} 
              />
              
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, (!email || !password) && styles.disabledButton]}
              disabled={!email || !password || loading}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => setRegisterModalVisible(true)}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* MODAL DE REGISTRO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRegisterModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeModalButton} 
                onPress={() => setRegisterModalVisible(false)}
              >
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Crear Cuenta</Text>
              <Text style={styles.modalSubtitle}>Únete a NaturMD para personalizar tu salud.</Text>
              
              <View style={{ width: '100%' }}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Correo electrónico" 
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail} 
                  onChangeText={setRegEmail} 
                />
                
                <TextInput 
                  style={styles.input} 
                  placeholder="Contraseña (mínimo 6 caracteres)" 
                  placeholderTextColor="#999"
                  secureTextEntry={true} 
                  value={regPassword} 
                  onChangeText={setRegPassword} 
                />

                <TextInput 
                  style={styles.input} 
                  placeholder="Confirmar Contraseña" 
                  placeholderTextColor="#999"
                  secureTextEntry={true} 
                  value={regConfirmPassword} 
                  onChangeText={setRegConfirmPassword} 
                />
              </View>

              <TouchableOpacity 
                style={styles.registerButtonModal}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.registerButtonModalText}>REGISTRARSE</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// ========== ESTILOS (los mismos que tenías) ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 15 : 50),
    alignItems: 'flex-start',
    zIndex: 10,
    position: 'absolute',
  },
  backButton: { padding: 5 },
  keyboardView: { flex: 1 },
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
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  headerContainer: { alignItems: 'center', marginBottom: 35 },
  logo: { width: 240, height: 240, marginBottom: -10 },
  brandText: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#666' },
  formContainer: { width: '100%', marginBottom: 20 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 10 },
  forgotPasswordText: { color: '#7EBAE4', fontWeight: '600', fontSize: 14 },
  loginButton: {
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
    marginBottom: 20,
  },
  disabledButton: { opacity: 0.5 },
  loginButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 15, color: '#999', fontWeight: 'bold' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 25,
  },
  googleIcon: { marginRight: 10 },
  googleButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  registerContainer: { flexDirection: 'row', alignItems: 'center' },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 15, fontWeight: 'bold', color: '#7EBAE4' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeModalButton: { position: 'absolute', top: 15, right: 15, zIndex: 1, padding: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 25, textAlign: 'center', marginTop: 5 },
  registerButtonModal: {
    backgroundColor: '#7EBAE4',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  registerButtonModalText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
});