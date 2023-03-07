import React from 'react';
import languages from '../../utils/languages';
import {Alert,
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View,
    } from 'react-native';

function LangModal({ visible, close, animationType }) {
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <View>
                <Text>Hi From LangModal</Text>
            </View>
        </Modal>
    
    )
}

export default LangModal;