import { View, StyleSheet, ActivityIndicator, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { ScryfallCard } from "@scryfall/api-types";

interface InputProps {
  card: ScryfallCard.Scheme;
}

const Card: React.FC<InputProps> = ({ card }) => {
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const handleImageLoadEnd = () => {
    setLoading(false);
  };

  const styles = StyleSheet.create({
    card: {
      width: 160,
      height: 230,
      zIndex: 1,
      marginBottom: 10,
      borderRadius: 11,
    },
    containerIsSelected: { position: "absolute", zIndex: 1000, top: "25%", left: "25%" },
    cardIsSelected: {
      // position: "absolute",
      // top: "50%",
      // left: "50%",
      transform: [
        { translateX: -60 }, // Adjust based on half of the width
        { translateY: -90 }, // Adjust based on half of the height
      ],
      width: 300, // 50% larger
      height: 400,
      // zIndex: 1000, // High zIndex
      // backgroundColor: "rgba(128, 0, 128, 0.5)", // Optional for visibility
    },
  });

  const cardStyle = isSelected ? [styles.card, styles.cardIsSelected] : styles.card;

  // Wrap the Image component in a View with position: 'relative'
  return (
    <Pressable
      onPress={() => setIsSelected((oldState) => !oldState)}
      style={isSelected && styles.containerIsSelected}
    >
      {loading && <ActivityIndicator size="large" color="#FFD700" />}
      <View>
        <Image
          style={cardStyle}
          source={
            typeof card.image_uris!.normal === "string"
              ? { uri: card.image_uris!.normal }
              : card.image_uris!.normal
          }
          contentFit="contain"
          // transition={500}
          onError={() => {
            console.log("Error loading image: " + card.image_uris!.normal);
          }}
          onLoadEnd={handleImageLoadEnd}
        />
      </View>
    </Pressable>
  );
};

export default Card;
