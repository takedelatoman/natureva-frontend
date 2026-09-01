// screens/RecipeResultScreen.tsx
import React, { useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iaService } from '../services/iaService';

// Definir tipos para las recomendaciones
interface Recomendacion {
  alimentacion: {
    manana: string;
    tarde?: string;
    noche: string;
    consejos: string[];
  };
  ejercicios: {
    tipo: string;
    duracion: string;
    frecuencia: string;
    descripcion: string;
  };
  remedios: {
    nombre: string;
    ingredientes: string[];
    preparacion: string;
    dosis: string;
    contraindicaciones: string;
  };
  descanso: {
    horas: string;
    horario: string;
    consejos: string[];
    posicion: string;
  };
  notas: string;
}

export default function RecipeResultScreen({ route, navigation }: any) {
  const datosPrevios = route.params?.datosPrevios || {};
  const [activeTab, setActiveTab] = useState('Remedios');
  const [doubtText, setDoubtText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recomendacion, setRecomendacion] = useState<Recomendacion | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const tabs = ['Alimentación', 'Ejercicios', 'Remedios', 'Descanso'];

  // 📥 Generar recomendación al cargar la pantalla
  useEffect(() => {
    generarRecomendacion();
  }, []);

  const generarRecomendacion = async () => {
    setIsGenerating(true);
    
    try {
      // Preparar datos para el backend
      const datosParaBackend = {
        pacienteId: datosPrevios.pacienteId || null,
        diagnostico: datosPrevios.diagnosticos || [],
        otrosDiagnosticos: datosPrevios.otros || '',
        sintomas: datosPrevios.sintomas || [],
        otrosSintomas: datosPrevios.otrosSintomas || '',
        habitos: datosPrevios.habitos || {},
        saludMental: datosPrevios.saludMental || {},
        laboratorios: datosPrevios.laboratorios || {},
        tieneLaboratorios: datosPrevios.tieneLaboratorios || false,
        edad: datosPrevios.edad || null,
        genero: datosPrevios.genero || null,
        peso: datosPrevios.peso || null,
        altura: datosPrevios.altura || null,
        alergias: datosPrevios.alergias || null,
        medicamentos: datosPrevios.medicamentos || null,
      };

      console.log('📤 Generando recomendación con datos:', datosParaBackend);

      const resultado = await iaService.generarRecomendacion(datosParaBackend);
      
      if (resultado.success && resultado.data) {
        setRecomendacion(resultado.data);
        console.log('✅ Recomendación generada exitosamente');
      } else {
        throw new Error(resultado.message || 'Error al generar recomendación');
      }

    } catch (error: any) {
      console.error('❌ Error al generar recomendación:', error);
      
      // Usar recomendación de fallback
      setRecomendacion({
        alimentacion: {
          manana: 'Té de jengibre y cúrcuma. Avena con canela y frutas',
          tarde: 'Infusión de manzanilla. Frutas frescas de temporada',
          noche: 'Magnesio suplemento natural. Cena ligera y temprana',
          consejos: [
            'Mantener una dieta balanceada rica en vegetales',
            'Beber al menos 2 litros de agua al día',
            'Evitar alimentos procesados y azúcares refinados'
          ]
        },
        ejercicios: {
          tipo: 'CARDIO',
          duracion: '30 minutos',
          frecuencia: '5 veces por semana',
          descripcion: 'Caminata diaria al aire libre o ejercicio moderado'
        },
        remedios: {
          nombre: 'Té de jengibre y canela',
          ingredientes: ['Jengibre fresco', 'Canela en rama', 'Agua', 'Miel'],
          preparacion: 'Hervir el agua con jengibre y canela por 10 minutos. Colar y endulzar con miel.',
          dosis: '1 taza al día, preferiblemente en la mañana',
          contraindicaciones: 'Consultar con su médico si está embarazada o toma anticoagulantes'
        },
        descanso: {
          horas: '7-8 horas',
          horario: '22:30 - 06:30',
          consejos: [
            'Evitar pantallas (teléfono, TV) 1 hora antes de dormir',
            'Mantener la habitación oscura y fresca',
            'Establecer una rutina de sueño regular'
          ],
          posicion: 'Boca arriba con una almohada pequeña bajo las rodillas'
        },
        notas: 'Recomendación general basada en los datos proporcionados. Consulte siempre a su médico.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 📤 Enviar duda al chat
  const enviarDuda = async () => {
    if (!doubtText.trim()) {
      Alert.alert('Aviso', 'Por favor, escribe tu duda.');
      return;
    }

    setIsLoading(true);

    try {
      const respuesta = await iaService.enviarDuda(
        doubtText.trim(),
        {
          diagnostico: datosPrevios.diagnosticos || [],
          sintomas: datosPrevios.sintomas || [],
          recomendacion: recomendacion
        }
      );

      Alert.alert(
        '💬 Respuesta',
        respuesta.data?.respuesta || 'Gracias por tu consulta. Un especialista te responderá pronto.',
        [{ text: 'OK' }]
      );
      
      setDoubtText('');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar tu duda.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📥 Compartir recomendación
  const compartirRecomendacion = async () => {
    if (!recomendacion) return;

    const mensaje = `
🌿 **Recomendación Natural - NaturMD** 🌿

🍎 **ALIMENTACIÓN**
Mañana: ${recomendacion.alimentacion.manana}
${recomendacion.alimentacion.tarde ? `Tarde: ${recomendacion.alimentacion.tarde}\n` : ''}Noche: ${recomendacion.alimentacion.noche}
Consejos: ${recomendacion.alimentacion.consejos.join(', ')}

🏃 **EJERCICIOS**
${recomendacion.ejercicios.descripcion}
Duración: ${recomendacion.ejercicios.duracion}
Frecuencia: ${recomendacion.ejercicios.frecuencia}

🌿 **REMEDIOS**
${recomendacion.remedios.nombre}
Dosis: ${recomendacion.remedios.dosis}
Preparación: ${recomendacion.remedios.preparacion}

💤 **DESCANSO**
${recomendacion.descanso.horas} - ${recomendacion.descanso.horario}
Consejos: ${recomendacion.descanso.consejos.join(', ')}

📝 ${recomendacion.notas}
    `;

    try {
      await Share.share({
        message: mensaje,
        title: 'Mi Recomendación Natural',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  // 🔄 Regenerar recomendación
  const regenerarRecomendacion = () => {
    Alert.alert(
      'Regenerar Recomendación',
      '¿Deseas generar una nueva recomendación con los mismos datos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Regenerar', onPress: generarRecomendacion }
      ]
    );
  };

  // 🏠 Ir a Home
  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  // 📊 Renderizar contenido según pestaña activa
  const renderTabContent = () => {
    if (!recomendacion) return null;

    switch (activeTab) {
      case 'Alimentación':
        return (
          <View>
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🌅 MAÑANA</Text>
              <Text style={styles.recipeText}>{recomendacion.alimentacion.manana}</Text>
            </View>
            
            {recomendacion.alimentacion.tarde && (
              <>
                <View style={styles.divider} />
                <View style={styles.timeSection}>
                  <Text style={styles.timeTitle}>☀️ TARDE</Text>
                  <Text style={styles.recipeText}>{recomendacion.alimentacion.tarde}</Text>
                </View>
              </>
            )}
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🌙 NOCHE</Text>
              <Text style={styles.recipeText}>{recomendacion.alimentacion.noche}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>💡 CONSEJOS</Text>
              {recomendacion.alimentacion.consejos.map((consejo, idx) => (
                <Text key={idx} style={styles.recipeText}>• {consejo}</Text>
              ))}
            </View>
          </View>
        );

      case 'Ejercicios':
        return (
          <View>
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🏃 TIPO DE EJERCICIO</Text>
              <Text style={styles.recipeText}>{recomendacion.ejercicios.tipo}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>📝 DESCRIPCIÓN</Text>
              <Text style={styles.recipeText}>{recomendacion.ejercicios.descripcion}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>⏱️ DURACIÓN</Text>
              <Text style={styles.recipeText}>{recomendacion.ejercicios.duracion}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>📅 FRECUENCIA</Text>
              <Text style={styles.recipeText}>{recomendacion.ejercicios.frecuencia}</Text>
            </View>
          </View>
        );

      case 'Remedios':
        return (
          <View>
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🌿 NOMBRE</Text>
              <Text style={styles.recipeText}>{recomendacion.remedios.nombre}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🧪 INGREDIENTES</Text>
              {recomendacion.remedios.ingredientes.map((ing, idx) => (
                <Text key={idx} style={styles.recipeText}>• {ing}</Text>
              ))}
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>👨‍🍳 PREPARACIÓN</Text>
              <Text style={styles.recipeText}>{recomendacion.remedios.preparacion}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>💊 DOSIS</Text>
              <Text style={styles.recipeText}>{recomendacion.remedios.dosis}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>⚠️ CONTRAINDICACIONES</Text>
              <Text style={[styles.recipeText, styles.warningText]}>{recomendacion.remedios.contraindicaciones}</Text>
            </View>
          </View>
        );

      case 'Descanso':
        return (
          <View>
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>⏰ HORAS RECOMENDADAS</Text>
              <Text style={styles.recipeText}>{recomendacion.descanso.horas}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>🕐 HORARIO</Text>
              <Text style={styles.recipeText}>{recomendacion.descanso.horario}</Text>
            </View>
            
            <View style={styles.divider} />
            <View style={styles.timeSection}>
              <Text style={styles.timeTitle}>💤 CONSEJOS</Text>
              {recomendacion.descanso.consejos.map((consejo, idx) => (
                <Text key={idx} style={styles.recipeText}>• {consejo}</Text>
              ))}
            </View>
            
            {recomendacion.descanso.posicion && (
              <>
                <View style={styles.divider} />
                <View style={styles.timeSection}>
                  <Text style={styles.timeTitle}>🛌 POSICIÓN</Text>
                  <Text style={styles.recipeText}>{recomendacion.descanso.posicion}</Text>
                </View>
              </>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#7EBAE4" />
          <Text style={styles.loadingText}>Generando tu recomendación personalizada...</Text>
          <Text style={styles.loadingSubtext}>Esto puede tomar unos segundos</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topDecoration} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.homeButton} onPress={goHome}>
          <Ionicons name="home-outline" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.topRightButtons}>
          <TouchableOpacity style={styles.topActionButton} onPress={regenerarRecomendacion}>
            <Ionicons name="refresh-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topActionButton} onPress={compartirRecomendacion}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>
            SU RECOMENDACIÓN NATURAL{'\n'}NATURMD
          </Text>

          {/* Notas adicionales */}
          {recomendacion?.notas && (
            <View style={styles.notaContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#7EBAE4" />
              <Text style={styles.notaText}>{recomendacion.notas}</Text>
            </View>
          )}

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
            {renderTabContent()}
          </View>

          {/* --- CAJA DE DUDAS (CHAT) --- */}
          <View style={styles.chatContainer}>
            <Text style={styles.chatLabel}>💬 ¿Tiene dudas sobre algo?</Text>
            <View style={styles.chatInputWrapper}>
              <TextInput 
                style={styles.chatInput}
                placeholder="Escriba su duda aquí..."
                placeholderTextColor="#999"
                value={doubtText}
                onChangeText={setDoubtText}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={[styles.sendButton, (!doubtText.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={enviarDuda}
                disabled={!doubtText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFF" />
                )}
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
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, textAlign: 'center' },
  loadingSubtext: { fontSize: 14, color: '#666', marginTop: 10, textAlign: 'center' },
  topDecoration: {
    position: 'absolute', top: -80, right: -80, width: 200, height: 200,
    borderRadius: 100, borderWidth: 35, borderColor: '#7EBAE4', opacity: 0.8,
  },
  topBar: {
    width: '100%', 
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10, 
    position: 'absolute',
  },
  homeButton: { 
    padding: 8, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    shadowOffset: { width: 0, height: 1 } 
  },
  topRightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  topActionButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    marginLeft: 8,
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1, 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 120 : 130, 
    paddingBottom: 40, 
    alignItems: 'center',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#000', 
    textAlign: 'center', 
    marginBottom: 15, 
    letterSpacing: 0.5 
  },
  notaContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginBottom: 20,
    alignItems: 'center',
  },
  notaText: {
    flex: 1,
    fontSize: 13,
    color: '#795548',
    marginLeft: 10,
    lineHeight: 18,
  },
  tabsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 20, 
  },
  tabButton: {
    width: '48%', 
    paddingVertical: 12, 
    backgroundColor: '#FFF', 
    borderWidth: 2, 
    borderColor: '#E5E7EB',
    borderRadius: 25, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1,
    marginBottom: 8,
  },
  tabButtonActive: { borderColor: '#7EBAE4', backgroundColor: '#EBF5FB' },
  tabText: { fontSize: 13, fontWeight: 'bold', color: '#666' },
  tabTextActive: { color: '#0056b3' },
  recipeCard: {
    width: '100%', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2, 
    marginBottom: 25,
  },
  timeSection: { marginBottom: 12 },
  timeTitle: { fontSize: 14, fontWeight: '900', color: '#333', marginBottom: 4 },
  recipeText: { fontSize: 14, color: '#555', lineHeight: 20, marginLeft: 5 },
  warningText: { color: '#D32F2F' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  chatContainer: { width: '100%' },
  chatLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  chatInputWrapper: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    paddingHorizontal: 15,
    paddingVertical: 5, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    elevation: 1,
  },
  chatInput: { flex: 1, height: 45, fontSize: 15, color: '#333' },
  sendButton: {
    backgroundColor: '#7EBAE4', 
    width: 35, 
    height: 35, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});