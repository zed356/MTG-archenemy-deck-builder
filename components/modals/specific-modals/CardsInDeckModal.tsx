import CustomButton from "@/components/button/CustomButton";
import Card from "@/components/card/Card";
import { SavedDeck } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { FlatList, StyleSheet, View } from "react-native";
import CustomModal from "../CustomModal";

interface CardsInDeckModalProps {
  deck: SavedDeck;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  columns?: number;
}

const CardsInDeckModal: React.FC<CardsInDeckModalProps> = ({
  deck,
  modalVisible,
  setModalVisible,
  columns = 1,
}) => {
  const flatListRenderItem = ({ item }: { item: ScryfallCard.Scheme }) => {
    return (
      <Card
        card={item}
        existsInDeck={true}
        isOpacityControlled={false}
        showAddRemoveOperator={false}
        size="normal"
        border={false}
      />
    );
  };

  return (
    <CustomModal visible={modalVisible} setVisible={setModalVisible}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <CustomButton
            type="negative"
            text="Close"
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
        <View style={styles.flatListContainer}>
          <FlatList data={deck.cards} renderItem={flatListRenderItem} numColumns={columns} />
        </View>
      </View>
    </CustomModal>
  );
};

export default CardsInDeckModal;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  flatListContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    paddingBottom: 50, // potentially problematic? TODO: testing different devices
  },
  buttonContainer: { alignSelf: "flex-end" },
});
