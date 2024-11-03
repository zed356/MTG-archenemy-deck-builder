import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface PulseWrapperProps {
  children: React.ReactNode;
  newDeckCardCount: number;
}

const PulseWrapper: React.FC<PulseWrapperProps> = ({
  children,
  newDeckCardCount,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (newDeckCardCount > 0) {
      scale.value = withTiming(1.1, {
        duration: 100,
        easing: Easing.out(Easing.exp),
      });

      // Reset scale back to 1 after the pulse
      const timeout = setTimeout(() => {
        scale.value = withTiming(1, { duration: 100 });
      }, 100);

      return () => clearTimeout(timeout); // Cleanup on unmount
    }
  }, [newDeckCardCount, scale]);

  return (
    <View>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  );
};

export default PulseWrapper;
