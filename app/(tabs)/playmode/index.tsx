import { ImageBackground } from "expo-image";

import GameController from "@/components/navigation/GameController";

const PlayModeScreen = () => {
  return (
    <ImageBackground
      source={require("../../../assets/images/Nicol-Bolas-Dragon-God-War-of-the-Spark-Art-819x1024.webp")}
      style={{ width: "100%", height: "100%" }}
      contentFit="fill"
    >
      <GameController />
    </ImageBackground>
  );
};

export default PlayModeScreen;
