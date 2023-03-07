import React from 'react';
import languages from '../../utils/languages';
import {Alert,
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View,
    } from 'react-native';
import {LanguageModal} from './styles';

function LangModal({ visible, close, animationType }) {
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <LanguageModal></LanguageModal>
        </Modal>
    )
}

export default LangModal;