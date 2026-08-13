import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos nuestras pantallas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; // <-- NUEVA PANTALLA
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import DiagnosisScreen from './src/screens/DiagnosisScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* headerShown: false oculta la barra superior fea por defecto para que nuestro diseño resalte */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}