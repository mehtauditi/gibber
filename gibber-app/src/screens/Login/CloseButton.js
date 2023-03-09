import React, {useState} from "react";
import {Text} from "react-native";

function CloseButton({close}) {
    const [pressed, setPressed] = useState(false);

    const handlePress = () => {
        setPressed(true)
    }
    return (
        <>
            <Text 
                onPress={close}
                onStartShouldSetResponder={() => true}
                onResponderStart={handlePress}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    color: "white",
                    marginLeft: "85%",
                    marginTop: "25%",
                    marginRight: "5%",
                    fontSize: pressed ? 43 : 50,
                    background: "none",
                    // backgroundColor: "#378fd3",
                    zIndex: 10,
                }}
            >X</Text>
        </>
    )
}

export default CloseButton;