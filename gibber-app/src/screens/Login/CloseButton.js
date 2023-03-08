import React, {useState} from "react";
import {Text} from "react-native";

function CloseButton({close}) {

    return (
        <>
            <Text 
                onPress={close}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    color: "white",
                    marginLeft: "85%",
                    marginTop: "25%",
                    marginRight: "5%",
                    fontSize: 50,
                    backgroundColor: "#378fd3",
                    zIndex: 10
                }}
            >X</Text>
        </>
    )
}

export default CloseButton;