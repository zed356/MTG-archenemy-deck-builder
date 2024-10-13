import { View, StyleSheet } from "react-native";
import { ICard } from "@/types/types";
import { Image } from "expo-image";

interface InputProps {
  card: ICard;
}

const Card: React.FC<InputProps> = ({ card }) => {
  const styles = StyleSheet.create({
    container: {
      paddingTop: 0,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    card: {
      width: 150,
      height: 215,
      margin: 5,
      borderRadius: 11,
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.card}
        source={typeof card.img === "string" ? { uri: card.img } : card.img} // Dynamic image source
        contentFit="cover"
        transition={1000}
        onError={() => {
          console.log("nx bl" + card.img);
        }}
      />
    </View>
  );
};

export default Card;
