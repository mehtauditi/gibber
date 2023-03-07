import React from "react";
import {View, Text} from "react-native";

function LangsItem({languages}) {
    return (
        <View>
            <Text>{languages}</Text>
            {/* <Text style={{color: "white"}}>Hi from LangsItem</Text> */}
        </View>
    )
}

export default LangsItem;