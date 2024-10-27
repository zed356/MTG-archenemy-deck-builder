import { defaultColors } from "@/constants/Colors";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface InputProps {
  source: string;
  focused: boolean;
  width?: number;
  height?: number;
  top?: number;
  right?: number;
}

const TabsIcon: React.FC<InputProps> = ({
  source,
  focused,
  height = 35,
  width = 45,
  top = 0,
  right = 0,
}) => {
  const cropWidth = 0.9;
  const cropHeight = 0.85;
  const originalDimensions: { width: number; height: number } = {
    width: width,
    height: height,
  };
  const croppedDimensions: { width: number; height: number } = {
    width: originalDimensions.width * cropWidth,
    height: originalDimensions.height * cropHeight,
  };

  const styles = StyleSheet.create({
    container: {
      overflow: "hidden",
      width: croppedDimensions.width,
      height: croppedDimensions.height,
      right: right,
      top: top,
    },

    image: {
      width: originalDimensions.width,
      height: originalDimensions.height,
      tintColor: focused ? defaultColors.gold : defaultColors.grey,
      fontSize: 30,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} contentFit="contain" />
    </View>
  );
};

export default TabsIcon;
