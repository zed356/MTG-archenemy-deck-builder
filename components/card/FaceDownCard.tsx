import { Image } from "expo-image";
import React, { Fragment } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

interface InputProps {
  size?: "small" | "normal" | "large";
  isInPlayDeck?: boolean;
  revealCard?: () => void;
}

const FaceDownCard: React.FC<InputProps> = ({
  size = "large",
  isInPlayDeck = true,
  revealCard,
}) => {
  const { width, height } = Dimensions.get("window");

  let cardSize;
  if (size === "small") {
    cardSize = { width: 100, height: 150 };
  } else if (size === "normal") {
    cardSize = { width: 160, height: 230 };
  } else if (size === "large") {
    cardSize = { width: width * 0.9, height: height * 0.625 };
  }

  const styles = StyleSheet.create({
    imageContainer: {
      position: "absolute",
      alignItems: "flex-end",
    },
    isInPlayDeckStyle: {
      top: "50%",
      left: "50%",
      transform: [{ translateX: -cardSize!.width / 2 }, { translateY: cardSize!.height / 2 }],
    },
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      marginBottom: 5,
    },
  });

  return (
    <Fragment>
      <Pressable onPressOut={() => revealCard && revealCard()}>
        <View style={[styles.imageContainer, isInPlayDeck && styles.isInPlayDeckStyle]}>
          <Image
            style={styles.card}
            source={require("../../assets/images/card-back-archenemy.jpg")}
            contentFit="contain"
            onError={() => {
              console.log("Error loading image: ");
            }}
          />
        </View>
      </Pressable>
    </Fragment>
  );
};

export default FaceDownCard;
