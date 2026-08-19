import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

// Importamos nuestras pantallas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; // <-- NUEVA PANTALLA
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HasDiagnosisScreen from './src/screens/HasDiagnosisScreen'; // <-- IMPORTAMOS PÁGINA 4 la de si y no diaigno...
import SelectDiagnosisScreen from './src/screens/SelectDiagnosisScreen'; //pag5
import HasSymptomsScreen from './src/screens/HasSymptomsScreen'; // <-- IMPORTAMOS PÁGINA 6
import SelectSymptomsScreen from './src/screens/SelectSymptomsScreen'; // pag 7
import HasLabsScreen from './src/screens/HasLabsScreen'; // <-- importamos pagina 8
import LabValuesScreen from './src/screens/LabValuesScreen'; //pag 9
import HabitsScreen from './src/screens/HabitsScreen';
import MentalRiskScreen from './src/screens/MentalRiskScreen';
import AnalyzingScreen from './src/screens/AnalyzingScreen'; //pag10
import RecipeResultScreen from './src/screens/RecipeResultScreen'; //pag11



// Importaciones temporales para las pantallas 5 y 6 que haremos luego
// Componente fantasma para las pantallas que haremos después
const DummyScreen = () => <View style={{flex: 1, backgroundColor: '#FAFAFA'}} />;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* headerShown: false oculta la barra superior fea por defecto para que nuestro diseño resalte */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="HasDiagnosis" component={HasDiagnosisScreen} />
        <Stack.Screen name="SelectDiagnosis" component={SelectDiagnosisScreen} />
        <Stack.Screen name="HasSymptoms" component={HasSymptomsScreen} />
        <Stack.Screen name="SelectSymptoms" component={SelectSymptomsScreen} />
        <Stack.Screen name="HasLabs" component={HasLabsScreen} />
        <Stack.Screen name="LabValues" component={LabValuesScreen} />
        <Stack.Screen name="Habits" component={HabitsScreen} />
        <Stack.Screen name="MentalRisk" component={MentalRiskScreen} />
        <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
        <Stack.Screen name="RecipeResult" component={RecipeResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}