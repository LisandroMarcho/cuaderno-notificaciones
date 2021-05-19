import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function NavBar() {
  const Styles = StyleSheet.create({
    container: {
      height: 50,
      padding: 6,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userContainer: {
      borderColor: 'black',
      borderWidth: 1.5,
      borderRadius: 6,
      padding: 5,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    userText: {
      marginLeft: 10,
      marginRight: 5,
    },
  });

  return (
    <View style={Styles.container}>
      <View style={Styles.userContainer}>
        <Image
          source={require('../assets/icons/user.png')}
          style={{ width: 24, height: 24 }}
        />
        <Text style={Styles.userText}>QUINTEROS MANSILLA 7º 3ª “A”</Text>
      </View>
      <Image
        source={require('../assets/icons/config.png')}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
    </View>
  );
}
