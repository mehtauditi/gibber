import React, {useState} from "react";
import {View, Text} from "react-native";

function LangsItem({languages, setLang}) {
    const [langSelected, setLangSelected] = useState(false);
    return (
            <View style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                bottom: "1%",
            }}>
                <Text style={{
                    color: langSelected ? "#66b6d2" :  "white",
                    fontWeight: "600",
                    marginTop: "15%",
                    textAlign: "center",
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



