import { defaultBorderRadius, globalStyles } from "@/styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, StyleSheet, Text } from "react-native";

interface InputProps {
  text: string;
  type: "positive" | "neutral" | "negative";
  onPress?: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<InputProps> = ({ text, type, onPress, disabled = false }) => {
  const handleOnPress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const getButtonColors = () => {
    if (disabled) return ["grey", "lightgrey"]; // Disabled gradient

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
    <Pressable onPress={handleOnPress} disabled={disabled} accessibilityRole="button">
      <LinearGradient colors={getButtonColors()} style={styles.gradientBackground}>
        <Text style={globalStyles.text}>{text}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    padding: 10,
    margin: 5,
    borderRadius: defaultBorderRadius,
  },
});

export default CustomButton;
