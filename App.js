import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';

import NavBar from './components/NavBar';
import Horarios from './components/Horarios';
import BotonInicio from './components/BotonInicio';

export default function App() {
  const Styles = StyleSheet.create({
    contenedor: {
      marginTop: Platform.OS === 'android' ? 20 : 0,
      paddingTop: 5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    },
    buttonGroup: {
      padding: 10
    }
  });

  return (
    <View style={Styles.contenedor}>
      <NavBar />
      <Horarios />
      <View style={Styles.buttonGroup}>
        <BotonInicio>Avisos</BotonInicio>
        <BotonInicio>Noticias</BotonInicio>
        <BotonInicio>Consultas</BotonInicio>
        <BotonInicio>Calificaciones</BotonInicio>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
