import { ScryfallCard } from "@scryfall/api-types";
import { Pressable, StyleSheet } from "react-native";
import TabsIcon from "../style-elements/TabsIcon";
import { useState } from "react";
import CardsInDeckModal from "../modals/specific-modals/CardsInDeckModal";

interface DiscardedCardPileProps {
  cards: ScryfallCard.Scheme[];
  isVisible: boolean;
}

const DiscardedCardPile: React.FC<DiscardedCardPileProps> = ({ cards, isVisible }) => {
  const [discardedCardModalVisible, setDiscardedCardModalVisible] = useState(false);
  const styles = StyleSheet.create({
    icon: {
      opacity: isVisible ? 1 : 0,
    },
  });
  return (
    <>
      <Pressable
        onPress={() => setDiscardedCardModalVisible(true)}
        style={styles.icon}
        disabled={!isVisible}
      >
        <TabsIcon
          source={require("../../assets/tab-icons/card-discard-pile.svg")}
          height={40}
          width={40}
        />
      </Pressable>
      <CardsInDeckModal
        deck={{ deckName: "discard pile", cards: cards }}
        modalVisible={discardedCardModalVisible}
        setModalVisible={setDiscardedCardModalVisible}
        columns={2}
      />
    </>
  );
};

export default DiscardedCardPile;
