import React, { useEffect, useState } from "react";
import { ImageBackground } from "expo-image";
import { router, useNavigation } from "expo-router";
import GameController from "@/components/navigation/GameController";
import ConfirmationModal from "@/components/modals/specific-modals/ConfirmationModal";
import { useSavedDeckStore } from "@/store/store";
import { SafeAreaView } from "react-native-safe-area-context";

const GameScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { savedDecksInState } = useSavedDeckStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Prevent default back behavior
      if (savedDecksInState.length > 0) {
        setModalVisible(true); // Show the quit confirmation modal if more than 1 deck is saved. otherwise quitting wont allow to press Play later. struggling with router.
      }
    });
    return unsubscribe;
  }, [navigation, savedDecksInState]);

  const handleQuitGame = () => {
    setModalVisible(false);
    router.push("/"); // navigates to the home screen. cant use router.replace
    // router.dismissAll();
    // router.push("/");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/Nicol-Bolas-Dragon-God-War-of-the-Spark-Art-819x1024.webp")}
      style={{ flex: 1 }}
      contentFit="cover"
    >
      <SafeAreaView style={{ flex: 1, marginBottom: 0 }}>
        <GameController />
        <ConfirmationModal
          isVisible={isModalVisible}
          text={"Do you want to quit the game?"}
          onConfirm={handleQuitGame}
          onCancel={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default GameScreen;
