import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { ICard } from "@/types/types";
import { Image } from "expo-image";
import FastImage from "react-native-fast-image";
import { useState } from "react";
import { ScryfallCard } from "@scryfall/api-types";

interface InputProps {
  card: ScryfallCard.Scheme;
}

const Card: React.FC<InputProps> = ({ card }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoadEnd = () => {
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      opacity: 1, // 20% less opacity for unselected cards
      paddingTop: 0,
    },
    card: {
      width: 160, // 50% larger if selected
      height: 230,
      marginBottom: 10,
      borderRadius: 11,
    },
  });

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" color="#FFD700" />}
        <Image
          style={styles.card}
          source={
            typeof card.image_uris!.normal === "string"
              ? { uri: card.image_uris!.normal }
              : card.image_uris!.normal
          }
          contentFit="cover"
          transition={1000}
          onError={() => {
            console.log("nx bl" + card.image_uris!.normal);
          }}
          onLoadEnd={handleImageLoadEnd}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Card;
