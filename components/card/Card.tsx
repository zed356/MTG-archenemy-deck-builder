import { View, StyleSheet, ActivityIndicator, Pressable, Text, Modal } from "react-native";
import { Image } from "expo-image";
import { Dispatch, Fragment, useState } from "react";
import { ScryfallCard } from "@scryfall/api-types";
import { NewDeckAction, NewDeckActionKind } from "@/reducers/newDeckReducer";

interface InputProps {
  card: ScryfallCard.Scheme;
  size: "small" | "normal" | "large";
  handleCardInNewDeck: Dispatch<NewDeckAction>;
  border?: boolean;
  addedToDeck?: boolean;
}

const Card: React.FC<InputProps> = ({
  card,
  size,
  handleCardInNewDeck,
  border = true,
  addedToDeck = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [isAddedToDeck, setIsAddedToDeck] = useState(addedToDeck);

  let cardSize;

  const handleImageLoadEnd = () => {
    setLoading(false);
  };

  if (size == "small") {
    cardSize = { width: 100, height: 150 };
  } else if (size == "normal") {
    cardSize = { width: 160, height: 230 };
  } else if (size == "large") {
    cardSize = { width: 350, height: 500 };
  }

  const displayPlusMinusCardButton = !isAddedToDeck ? "+" : "-";

  const handleAddRemoveCardToNewDeck = () => {
    if (isAddedToDeck) {
      handleCardInNewDeck({ type: NewDeckActionKind.REMOVE, payload: card });
      setIsSelected(false);
      setIsAddedToDeck(false);
    } else if (!isAddedToDeck) {
      handleCardInNewDeck({ type: NewDeckActionKind.ADD, payload: card });
      setIsSelected(false);
      setIsAddedToDeck(true);
    }
  };

  const styles = StyleSheet.create({
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      borderRadius: 11,
      marginBottom: 5,
      borderWidth: isAddedToDeck ? 2 : 0,
      borderColor: isAddedToDeck && border ? "green" : "",
    },
    containerIsSelected: {
      top: "25%",
      left: "25%",
      backgroundColor: "rgba(128, 0, 128, 0.5)",
    },
    cardIsSelected: {
      borderRadius: 20,

      width: 350,
      height: 500,
    },
    modalContainer: {
      flex: 1, // Make the modal take the full screen
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background
    },
    plusButton: {
      position: "absolute",
      // top: "50%", // Vertically centered
      right: 5,
      top: 5, // Pushed to the far right
      transform: [{ translateY: -42.5 }], // Half of font size (85 / 2)
    },
    plusText: {
      fontSize: 85,
      color: !isAddedToDeck ? "green" : "red",
    },
  });

  return (
    <Fragment>
      <Pressable onPress={() => setIsSelected((oldState) => !oldState)}>
        {loading && <ActivityIndicator size="large" color="#FFD700" />}
        <View>
          <Image
            style={styles.card}
            source={
              typeof card.image_uris!.normal === "string"
                ? { uri: card.image_uris!.normal }
                : card.image_uris!.normal
            }
            contentFit="contain"
            transition={500}
            onError={() => {
              console.log("Error loading image: " + card.image_uris!.normal);
            }}
            onLoadEnd={handleImageLoadEnd}
          />
          <Pressable
            style={[styles.plusButton, { top: 25 }]}
            onPress={handleAddRemoveCardToNewDeck}
          >
            <Text style={[styles.plusText, { fontSize: 50 }]}>{displayPlusMinusCardButton}</Text>
          </Pressable>
        </View>
      </Pressable>
      <Modal visible={isSelected} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <Pressable onPress={() => setIsSelected((oldState) => !oldState)}>
            {loading && <ActivityIndicator size="large" color="#FFD700" />}
            <View>
              <Image
                style={[styles.card, styles.cardIsSelected]}
                source={
                  typeof card.image_uris!.normal === "string"
                    ? { uri: card.image_uris!.normal }
                    : card.image_uris!.normal
                }
                contentFit="contain"
                onError={() => {
                  console.log("Error loading image: " + card.image_uris!.normal);
                }}
                onLoadEnd={handleImageLoadEnd}
              />
              <Pressable style={styles.plusButton} onPress={handleAddRemoveCardToNewDeck}>
                <Text style={styles.plusText}>{displayPlusMinusCardButton}</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </Fragment>
  );
};

export default Card;
