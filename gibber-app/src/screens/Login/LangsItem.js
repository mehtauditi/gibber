import React from "react";
import {View, Text} from "react-native";

function LangsItem({languages, setSelectedLang}) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            top: "10%",
        }}>
            <Text style={{
                color: "white",
                fontWeight: "600",
                marginTop: "15%",
                textAlign: "center"
            }}
            onPress={() => 
                setSelectedLang(languages)
            }
            >{languages}</Text>
        </View>
    )
}

export default LangsItem;



