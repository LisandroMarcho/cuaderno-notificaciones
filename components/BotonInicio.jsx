import React from 'react';
import {TouchableOpacity, Text} from 'react-native'

export default function BotonInicio ({children}) {
    return(
    <TouchableOpacity style={{
            width:'100%',
            height: 80,
            padding: 30,
            textAlign: 'center',
            backgroundColor: '#30A4FF',
            borderRadius: 15,
            marginBottom: 25,
            borderColor: 'black',
            borderWidth: 1
        }}>
        <Text style={{textAlign: 'center', fontSize: 16}}>{children}</Text>
    </TouchableOpacity>           
    )
}