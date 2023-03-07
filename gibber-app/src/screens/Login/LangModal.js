import React from 'react';
import languages from '../../utils/languages';
import {Alert,
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View,
        Button
    } from 'react-native';
import {LanguageModal, CloseBtn} from './styles';

function LangModal({ setLangModalVisible, visible, close, animationType }) {
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <LanguageModal>
                <CloseBtn title="Return" value="Return" onPress={close}/>
            </LanguageModal>
        </Modal>
    )
}

export default LangModal;