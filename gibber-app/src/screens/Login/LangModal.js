
import React, {useState} from 'react';
import {languages} from '../../utils/languages';
import {Modal, ScrollView} from 'react-native';
import {LanguageModal, CloseBtn} from './styles';
import LangsItem from './LangsItem';
import CloseButton from './CloseButton';


function LangModal({ visible, close, animationType, setLang }) {
    const [langNames, setLangNames] = useState([]);

    const renderLangs = () => {
        if(langNames.length === 0 || langNames.length < 20){
                languages.filter(e => {
                langNames.push(e.name); 
            })
        }
    }
    renderLangs();
    
    return (
        <Modal visible={visible} close={close} animationType={animationType}>
            <ScrollView>
                <LanguageModal>
                    <CloseButton close={close} visible={visible}/>
                    {
                        langNames.map((e, i) => {return <LangsItem key={i} languages={e} setLang={setLang}/>})
                    }
                </LanguageModal>
            </ScrollView>
            {/* <CloseBtn onPress={close}/> */}
        </Modal>
    )
}

export default LangModal;