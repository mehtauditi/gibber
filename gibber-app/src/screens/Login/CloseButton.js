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
                    marginTop: "15%",
                    marginRight: "5%",
                    fontSize: pressed ? 45 : 50,
                    background: "transparent",
                    zIndex: 10,
                }}
            >x</Text>
        </>
    )
}

export default CloseButton;