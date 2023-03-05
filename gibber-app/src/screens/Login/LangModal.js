import languages from '../../utils/languages';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

function LangModal({ setModalVisible, modalVisible }) {
    return (
        <View style={{
            display: "flex",
            backgroundColor: "pink",
            height: "100%",
            width: "100%"
        }}>
            {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}></Modal> */}
            <Text>Hi From LangModal</Text>
        </View>
    )
}

export default LangModal;