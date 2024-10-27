import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import ShatterButton from "@/components/button/ShatterButton";

const PlayModeScreen = () => {
  const handlePlayPress = () => {
    router.push("/gamescreen"); // Navigate to the game screen
  };
  return (
    <ImageBackground
      source={require("../../../assets/images/Nicol-Bolas-Dragon-God-War-of-the-Spark-Art-819x1024.webp")}
      style={{ flex: 1 }}
      contentFit="cover"
    >
      <ShatterButton onPlayPress={handlePlayPress} buttonName="Battle" />
    </ImageBackground>
  );
};

export default PlayModeScreen;
