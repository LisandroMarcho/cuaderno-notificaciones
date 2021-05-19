import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Horarios() {
  const Styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    text: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 5
    },
    image: {
      width: '100%',
    },
  });
  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>HORARIOS</Text>
      <Image
        style={Styles.image}
        source={require('../assets/horarios.png')}
        resizeMode='stretch'
      ></Image>
    </View>
  );
}
