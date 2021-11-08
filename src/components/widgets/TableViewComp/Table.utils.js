import React from "react";
import { View } from "react-native";
import { Colors } from "../../utils/Colors";

export function renderSeparator() {
    return (
        <View
            style={{
                height: 1,
                width: "100%",
                backgroundColor: Colors.LightGray,
                height: 5
            }}
        />
    );
};
