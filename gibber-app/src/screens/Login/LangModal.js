
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

function LangModal({ setLangModalVisible, visible, close, animationType }) {
    // const [langNames, setLangNames] = useState([]);
    // const renderLangs = () => {
    //     let names = []
    //     if(names.length === 0 || names.length < 20){
    //             languages.filter(e => {
    //             names.push(e.name); 
    //             setLangNames(names);  
    //         })
    //     }
    //     console.log('langNames', langNames)
    // }
    
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <LanguageModal>
            </LanguageModal>
            <CloseBtn title="Return" value="Return" onPress={close}/>
        </Modal>
    )
}

export default LangModal;