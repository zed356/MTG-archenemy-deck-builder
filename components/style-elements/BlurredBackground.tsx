import { defaultBorderRadius } from "@/constants/styles";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface BlurredBackgroundProps {
  children: React.ReactNode;
}

const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ children }) => {
  const blurOpacity = useSharedValue(0.5);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        blurOpacity.value,
        [0, 1],
        ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, animatedStyle]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: defaultBorderRadius,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default BlurredBackground;
