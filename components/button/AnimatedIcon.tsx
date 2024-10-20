import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface InputProps {
  children: React.ReactNode;
  onPress?: () => void;
  visible?: boolean;
}

const AnimatedIcon: React.FC<InputProps> = ({ children, onPress, visible = true }) => {
  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
  };

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value

  // Function to handle press in
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9, // Scale down to 95%
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

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, !visible && styles.hidden]}>
      <Pressable
        onPress={handleOnPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        disabled={!visible}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});

export default AnimatedIcon;
