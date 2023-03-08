import React, {useState} from "react";
import {Text} from "react-native";

function CloseButton({close}) {

    return (
        <>
            <Text 
                onPress={close}
                style={{
                    display: "flex",
                    marginRight: "1%",
                    height: "10%",
                    width: "10%"
                }}
            >X</Text>
        </>
    )
}

export default CloseButton;