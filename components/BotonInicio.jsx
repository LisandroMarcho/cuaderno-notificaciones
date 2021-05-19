import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import firebase from '../firebase';

const dbRef = firebase.database().ref().child('test');

function agregarObject () {
  dbRef.push({
    test: 'Hola mundo'
  })
}

export default function BotonInicio ({children}) {
    const Styles = StyleSheet.create({
      boton: {
        width:'100%',
        height: 80,
        padding: 30,
        textAlign: 'center',
        backgroundColor: '#30A4FF',
        borderRadius: 15,
        marginBottom: 25,
        borderColor: 'black',
        borderWidth: 1
      },
      text: {
        textAlign: 'center', fontSize: 16
      }
    })
    return(
    <TouchableOpacity style={Styles.boton} onPress={agregarObject}>
        <Text style={Styles.text}>{children}</Text>
    </TouchableOpacity>           
    )
}