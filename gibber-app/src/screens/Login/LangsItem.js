import React, {useState} from "react";
import {View, Text} from "react-native";

function LangsItem({languages, setLang}) {
    const [langSelected, setLangSelected] = useState(false);
    return (
            <View style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                paddingBottom: "35%",
                top: "3%",
            }}>
                <Text style={{
                    color: "white",
                    fontWeight: "600",
                    marginTop: "10%",
                    textAlign: "center",
                    fontSize: 25
                }}
                onPress={() => {
                    setLang(languages);
                    setLangSelected(true);
                }
                }
                >{languages}</Text>
            </View>
    )
}

export default LangsItem;



