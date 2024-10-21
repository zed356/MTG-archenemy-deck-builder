import { View } from "react-native";
import { ImageBackground } from "expo-image";

const PlayModeScreen = () => {
  return (
    <ImageBackground
      source={require("../../../assets/images/Nicol-Bolas-Dragon-God-War-of-the-Spark-Art-819x1024.webp")}
      style={{ width: "100%", height: "100%" }}
      contentFit="fill"
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Text style={{ color: defaultColors.gold, backgroundColor: defaultColors.grey }}>
          Play Mode
        </Text> */}
      </View>
    </ImageBackground>
  );
};

export default PlayModeScreen;
