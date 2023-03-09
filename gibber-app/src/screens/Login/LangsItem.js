import React, {useState} from "react";
import {View, Text} from "react-native";

function LangsItem({languages, setLang}) {
    const [langSelected, setLangSelected] = useState(false);
    const [pressed, setPressed] = useState(false);


    const handlePressDown = () => {
        setLang(languages);
        setLangSelected(true);
        setPressed(true);
    }


    return (
            <View 
                onStartShouldSetResponder={() => true}
                onResponderStart={handlePressDown}
                // onPress={() => {
                //     setLang(languages);
                //     setLangSelected(true);
                // }
                // }
                style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                // paddingBottom: "35%",
                top: "4%",
                padding: 50,
                backgroundColor: pressed ? "white" : "#378fd3",

            }}>
                <Text style={{
                    color: pressed ? "#378fd3" : "white",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: 30,
                }}
                >{languages}</Text>
            </View>
    )
}

export default LangsItem;



