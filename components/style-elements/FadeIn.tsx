import { useState, useEffect } from "react";
import { Animated } from "react-native";

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, duration = 300, delay = 0 }) => {
  const [opacity] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{ opacity, width: "100%", height: "100%" }}>{children}</Animated.View>
  );
};

export default FadeIn;
