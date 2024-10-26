import { useState } from "react";
import { Modal, Pressable, View, StyleSheet, Text } from "react-native";
import { reloadAppAsync } from "expo";

interface InputProps {
  errorMessage: string;
}

const ErrorModal: React.FC<InputProps> = ({ errorMessage }) => {
  const [modalVisible, setModalVisible] = useState(true);

  const handleReloadApp = async () => {
    reloadAppAsync();
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={handleReloadApp}>
              <Text style={styles.textStyle}>Reload App</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#673AB7",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "gold",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "gold",
  },
});

export default ErrorModal;
