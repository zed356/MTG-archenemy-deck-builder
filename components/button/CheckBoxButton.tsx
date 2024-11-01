import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

interface CheckBoxButtonInputs {
  text: string;
  onCheckChange: (checked: boolean) => void;
  inactiveColor?: string;
}

const CheckBoxButton: React.FC<CheckBoxButtonInputs> = ({ text, onCheckChange, inactiveColor }) => {
  const [checked, setChecked] = useState<boolean>(true);

  const icon = checked ? "check-square" : "square";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: checked ? defaultColors.gold : inactiveColor || defaultColors.grey,
      marginRight: 5,
    },
  });

  return (
    <Pressable
      onPress={() => {
        setChecked((prev) => {
          onCheckChange(!prev);
          return !prev;
        });
      }}
    >
      <View style={styles.container}>
        <Text style={[globalStyles.text, styles.text]}>{text}</Text>
        <FontAwesome name={icon} size={24} color={checked ? defaultColors.gold : inactiveColor} />
      </View>
    </Pressable>
  );
};

export default CheckBoxButton;
