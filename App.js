import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import BotonInicio from "./components/BotonInicio"


export default function App() {
  const Styles = StyleSheet.create({
    horarios: {
      height: 300,
      marginBottom:15,
    },
    contenedor: {
      marginTop: 25
    },
    boton: {
      height: 60,
    }, 
    navbar: {
      height: 60,
      backgroundColor: '#E1E1E1'
    }
  })

  return (
    <View style={Styles.contenedor}>
      <View style={Styles.navbar}>
      <View style={{borderColor:'black', borderWidth:1.5, borderRadius:6, width:'40%'}}>
        <Text>  || MANSILLA 7°3ª "B"</Text>
        </View>
        <Text>configuracion</Text>
      </View>
      <View style={Styles.horarios}>
        <Text style={{textAlign: 'center'}}>HORARIOS</Text>
        <Image style={{marginTop:15, width: '100%',  }} source={require('./assets/horarios.png')}></Image>
      </View>
      <BotonInicio>Avisos</BotonInicio>
      <BotonInicio>Noticias</BotonInicio>
      <BotonInicio>Consultas</BotonInicio>
      <BotonInicio>Calificaciones</BotonInicio>
      <StatusBar style="auto" />
    </View>
  );
}


