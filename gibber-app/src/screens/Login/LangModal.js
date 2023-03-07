import React from 'react';
import languages from '../../utils/languages';
import {Alert,
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View,
    } from 'react-native';

function LangModal({ setModalVisible, visible, close }) {
    return (
        <Modal>
            <Text style={{color: "pink"}}>Hi From LangModal</Text>
        </Modal>
    
    )
}

export default LangModal;