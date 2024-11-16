import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";

interface FilterTextInputProps {
  textInputName: string;
  textInputValue: string;
  textInputOnChange: React.Dispatch<React.SetStateAction<string>>;
}

const FilterTextInput: React.FC<FilterTextInputProps> = ({
  textInputName,
  textInputValue,
  textInputOnChange,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={textInputValue}
        onChangeText={(text) => textInputOnChange(text)}
        placeholder={textInputName}
        placeholderTextColor={defaultColors.grey}
        multiline={true}
        maxLength={85}
      />
      <Pressable style={styles.pressableWrapper}>
        <Text style={styles.clearFilterIcon} onPress={() => textInputOnChange("")}>
          ✖️
        </Text>
      </Pressable>
    </View>
  );
};

export default FilterTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: "96%",
    position: "relative",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: defaultBorderRadius,
    borderColor: defaultColors.gold,
    backgroundColor: "#590080",
    padding: 10,
    marginRight: 10,
    color: defaultColors.gold,
    marginVertical: 5,
    fontFamily: "Beleren",
  },
  clearFilterIcon: {
    color: defaultColors.grey,
    fontSize: 20,
    paddingLeft: 15,
    paddingBottom: 15,
  },
  pressableWrapper: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
