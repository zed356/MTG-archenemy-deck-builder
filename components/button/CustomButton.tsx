import { defaultColors } from "@/constants/Colors";
import { globalStyles, defaultBorderRadius } from "@/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface InputProps {
  text?: string;
  type: "positive" | "neutral" | "negative";
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const CustomButton: React.FC<InputProps> = ({
  text,
  type,
  onPress,
  disabled = false,
  children,
}) => {
  const scale = useSharedValue(1); // Initial scale value
  const opacity = useSharedValue(1); // Initial shadow offset value

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleOnPress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Function to handle press in
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  // Function to handle press out
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const getButtonColors = () => {
    if (disabled) return ["grey", defaultColors.grey]; // Disabled gradient

    switch (type) {
      case "positive":
        return ["#42b883", "#2a7a55"];
      case "neutral":
        return ["#FFC107", "#FFA000"];
      case "negative":
        return ["#FF5722", "#E64A19"];
      default:
        return ["#42b883", "#3aa76d"];
    }
  };

  return (
    <Animated.View style={animatedStyles}>
      <Pressable
        onPress={handleOnPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        style={styles.container}
      >
        <View>
          <LinearGradient
            colors={getButtonColors()}
            style={styles.gradientBackground}
          >
            <Text
              style={[
                globalStyles.text,
                type === "positive" &&
                  !disabled && { color: defaultColors.gold },
              ]}
            >
              {text || children}
            </Text>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    minHeight: 45,
  },
  gradientBackground: {
    padding: 10,
    margin: 5,
    borderRadius: defaultBorderRadius,
  },
});

export default CustomButton;
