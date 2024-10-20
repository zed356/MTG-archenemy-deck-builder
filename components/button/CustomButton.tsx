import { defaultColors } from "@/constants/Colors";
import { globalStyles, defaultBorderRadius } from "@/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

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
  const handleOnPress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value

  // Function to handle press in
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95, // Scale down to 95%
      duration: 150, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  // Function to handle press out
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale back to 100%
      duration: 150,
      useNativeDriver: true,
    }).start();
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handleOnPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        style={styles.container}
      >
        <LinearGradient colors={getButtonColors()} style={styles.gradientBackground}>
          <Text
            style={[
              globalStyles.text,
              type == "positive" && !disabled && { color: defaultColors.gold },
            ]}
          >
            {text || children}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
  },
  gradientBackground: {
    padding: 10,
    margin: 5,
    borderRadius: defaultBorderRadius,
  },
});

export default CustomButton;
