import { defaultColors } from "@/constants/Colors";
import { Modal, View, ScrollView, StyleSheet, ModalProps } from "react-native";

interface CustomModalProps extends ModalProps {
  setVisible: (value: boolean) => void;
  children: React.ReactNode;
  scrollEnabled?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = (props) => {
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.2)", // Optional: adds a backdrop
    },
    modalContainer: {
      width: "97%", // Modal width
      maxHeight: "80%", // Maximum height to prevent overflow
      backgroundColor: defaultColors.grey,
      borderRadius: 20,
      // padding: 20,
      elevation: 5,
    },
    contentContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 20, // Additional padding at the bottom if needed
    },
    modalView: {
      width: "100%", // Modal width
      backgroundColor: defaultColors.grey,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
    },
  });

  const content = props.scrollEnabled ? (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.modalView}>{props.children}</View>
    </ScrollView>
  ) : (
    <View style={styles.modalView}>{props.children}</View>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        props.setVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>{content}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;
