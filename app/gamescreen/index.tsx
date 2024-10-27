import React, { useEffect, useState } from "react";
import { ImageBackground } from "expo-image";
import { router, useNavigation } from "expo-router";
import GameController from "@/components/navigation/GameController";
import ConfirmationModal from "@/components/modals/specific-modals/ConfirmationModal";

const GameScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Prevent default back behavior
      setModalVisible(true); // Show the quit confirmation modal
    });
    return unsubscribe;
  }, [navigation]);

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
      <GameController />
      <ConfirmationModal
        isVisible={isModalVisible}
        text={"Do you want to quit the game?"}
        onConfirm={handleQuitGame}
        onCancel={() => setModalVisible(false)}
      />
    </ImageBackground>
  );
};

export default GameScreen;
