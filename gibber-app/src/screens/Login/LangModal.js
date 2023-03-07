
import React, {useState} from 'react';
import {languages} from '../../utils/languages';
import {Alert,
        Modal, 
        StyleSheet, 
        Text, 
        Pressable, 
        View,
        Button
    } from 'react-native';
import {LanguageModal, CloseBtn} from './styles';
import LangsItem from './LangsItem';

function LangModal({ visible, close, animationType }) {
    const [langNames, setLangNames] = useState([]);
    const renderLangs = () => {
        if(langNames.length === 0 || langNames.length < 20){
                languages.filter(e => {
                langNames.push(e.name); 
            })
        }
        console.log('langNames', langNames)
    }
    
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <LanguageModal>
                {renderLangs()}
            </LanguageModal>
            <CloseBtn title="Return" value="Return" onPress={close}/>
        </Modal>
    )
}

export default LangModal;