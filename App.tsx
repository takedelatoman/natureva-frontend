// App.tsx - CORREGIDO
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos nuestras pantallas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HasDiagnosisScreen from './src/screens/HasDiagnosisScreen';
import SelectDiagnosisScreen from './src/screens/SelectDiagnosisScreen';
import HasSymptomsScreen from './src/screens/HasSymptomsScreen';
import SelectSymptomsScreen from './src/screens/SelectSymptomsScreen';
import HasLabsScreen from './src/screens/HasLabsScreen';
import LabValuesScreen from './src/screens/LabValuesScreen';
import AnalyzingScreen from './src/screens/AnalyzingScreen'; // 👈 AGREGAR ESTA LÍNEA
import RecipeResultScreen from './src/screens/RecipeResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="HasDiagnosis" component={HasDiagnosisScreen} />
        <Stack.Screen name="SelectDiagnosis" component={SelectDiagnosisScreen} />
        <Stack.Screen name="HasSymptoms" component={HasSymptomsScreen} />
        <Stack.Screen name="SelectSymptoms" component={SelectSymptomsScreen} />
        <Stack.Screen name="HasLabs" component={HasLabsScreen} />
        <Stack.Screen name="LabValues" component={LabValuesScreen} />
        <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
        <Stack.Screen name="RecipeResult" component={RecipeResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}