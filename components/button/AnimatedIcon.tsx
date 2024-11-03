import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface AnimatedIconProps {
  children: React.ReactNode;
  onPress?: () => void;
  visible?: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ children, onPress, visible = true }) => {
  const handleOnPress = () => {
    if (onPress && visible) {
      onPress();
    }
  };

  const scaleAnim = useSharedValue(1); // Initial scale value

  // Function to handle press in
  const handlePressIn = () => {
    scaleAnim.value = withTiming(0.9, { duration: 150 }); // Scale down to 90%
  };

  // Function to handle press out
  const handlePressOut = () => {
    scaleAnim.value = withTiming(1, { duration: 150 }); // Scale back to 100%
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  useEffect(() => {
    if (!visible) {
      scaleAnim.value = withTiming(0, { duration: 150 });
    } else {
      scaleAnim.value = withTiming(1, { duration: 150 });
    }
  }, [visible, scaleAnim]);

  return (
    <Animated.View style={[animatedStyle, !visible && styles.hidden]}>
      <Pressable
        onPress={handleOnPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        disabled={!visible}
      >
        <View style={styles.buttonContainer}>{children}</View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default AnimatedIcon;
