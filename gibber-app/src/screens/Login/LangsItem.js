import React from "react";
import {View, Text} from "react-native";

function LangsItem({languages, setLang}) {
    return (
            <View style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                bottom: "1%",
                overflow: "scroll"
            }}>
                <Text style={{
                    color: "white",
                    fontWeight: "600",
                    marginTop: "15%",
                    textAlign: "center"
                }}
                onPress={() => 
                    setLang(languages)
                }
                >{languages}</Text>
            </View>
    )
}

export default LangsItem;



