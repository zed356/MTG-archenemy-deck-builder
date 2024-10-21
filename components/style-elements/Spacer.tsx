import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SpacerProps {
  height?: number; // Optional height prop
  width?: number; // Optional width prop
  style?: StyleProp<ViewStyle>; // Additional styles
}

const Spacer: React.FC<SpacerProps> = ({ height, width, style }) => {
  return (
    <View
      style={[
        { height: height || 0, width: width || 0 }, // Default to 0 if not provided
        style,
      ]}
    />
  );
};

export default Spacer;
