import React, { useState } from "react";
import { Modal, StyleSheet, View, TextInput } from "react-native";
import CustomButton from "../components/button/CustomButton";

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
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalInput}
              placeholder="Deck Name"
              multiline={true}
              numberOfLines={4}
              maxLength={80}
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
              <CustomButton
                type="negative"
                text="CLOSE"
                onPress={() => {
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    minHeight: 200,
    maxWidth: 250,
    position: "absolute",
    top: "20%",
    left: "17%",
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    backgroundColor: "lightgray",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    width: "100%",
    textAlign: "center",
    padding: 5,
    fontFamily: "Beleren",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: "40%",
    marginTop: 20,
  },
});

export default SaveNewDeckModal;
