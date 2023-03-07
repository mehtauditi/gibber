import React from "react";
import {View, Text} from "react-native";

function LangsItem({languages}) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "scroll"
        }}>
            <Text style={{
            color: "white",
            fontWeight: "600",
            marginTop: "15%",
            textAlign: "center"
            }}>{languages}</Text>
        </View>
    )
}

export default LangsItem;