import React, {useState} from "react";
import {View, Text} from "react-native";
import {LanguageItem} from "./styles";

function LangsItem({languages, setLang, id}) {
    const [langSelected, setLangSelected] = useState(false);
    const handlePress = () => {
        setLangSelected(true);
        setLang(languages);
    }
    return (
        <LanguageItem
            onPress={handlePress}
            className={langSelected ? "selectedClass" : ""} 
            // id={langSelected ? 'selectedId' : id}
        >
            <Text style={{
                color: langSelected ? "#378fd3" : "white",
                fontWeight: "600",
                textAlign: "center",
                fontSize: 30,
            }}
            >{languages}</Text>
        </LanguageItem>
    )
}

export default LangsItem;



