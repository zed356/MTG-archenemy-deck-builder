import SavedDecks from "@/components/decks/SavedDecks";
import { SavedDeck, useGameScreenDeckStore } from "@/store/store";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native";

const PlayScreen = () => {
  const { setGameScreenDeck } = useGameScreenDeckStore();

  const handleOnDeckSelectedForPlay = (deck: SavedDeck) => {
    setGameScreenDeck(deck);
    router.push("/gamescreen");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/Nicol-Bolas-Dragon-God-War-of-the-Spark-Art-819x1024.webp")}
      style={{ flex: 1 }}
      contentFit="cover"
    >
      <SafeAreaView style={{ flex: 1, marginBottom: 0 }}>
        <SavedDecks onDeckSelectedForPlay={handleOnDeckSelectedForPlay} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PlayScreen;
