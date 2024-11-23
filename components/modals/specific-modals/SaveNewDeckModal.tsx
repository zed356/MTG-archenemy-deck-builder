import Spacer from "@/components/style-elements/Spacer";
import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { MAX_DECK_NAME_LENGTH } from "@/constants/values";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CustomButton from "../../button/CustomButton";
import CustomModal from "../CustomModal";

interface InputProps {
  modalVisible: boolean;
  setVisible: (value: boolean) => void;
  confirmSaveDeck: (deckName: string) => void;
}

const SaveNewDeckModal: React.FC<InputProps> = ({ modalVisible, setVisible, confirmSaveDeck }) => {
  const [userInputValue, setUserInputValue] = useState("");
  const isSaveEnabled: boolean = userInputValue.trim().length > 0;

  const handleConfirmSaveDeck = () => {
    if (userInputValue.trim().length > 0) {
      confirmSaveDeck(userInputValue);
    }
  };

  return (
    <CustomModal visible={modalVisible} setVisible={setVisible}>
      <View style={styles.container}>
        <TextInput
          style={styles.modalInput}
          placeholder="Deck Name"
          placeholderTextColor={defaultColors.grey}
          multiline={true}
          numberOfLines={4}
          maxLength={MAX_DECK_NAME_LENGTH}
          autoCorrect={false}
          autoFocus={true}
          onChangeText={setUserInputValue}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            type="positive"
            text="SAVE"
            onPress={handleConfirmSaveDeck}
            disabled={!isSaveEnabled}
          />
          <Spacer width={20} />
          <CustomButton
            type="negative"
            text="CLOSE"
            onPress={() => {
              setVisible(false);
            }}
          />
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    width: "70%",
    textAlign: "center",
    padding: 5,
    fontFamily: "Beleren",
    fontSize: 20,
    color: defaultColors.gold,
    borderColor: defaultColors.grey,
    borderRadius: defaultBorderRadius,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});

export default SaveNewDeckModal;
