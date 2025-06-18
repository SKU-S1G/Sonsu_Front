import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ShortcutButton = ({ destination }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(destination)} // destination에 따라 이동
    >
      <Image
        source={require("../../assets/images/ShortcutButton.png")}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 8,
    resizeMode: "contain",
    flex: 1,
  },
});

export default ShortcutButton;
