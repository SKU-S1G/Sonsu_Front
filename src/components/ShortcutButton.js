import React, { useRef } from "react";
import { Audio } from "expo-av";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ShortcutButton = ({ destination }) => {
  const soundRef = useRef(null);

  const playClickSound = async () => {
    try {
      // 기존 소리 unload
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/Sounds/Click.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("사운드 재생 오류:", error);
    }
  };

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        playClickSound();
        navigation.navigate(destination);
      }} // destination에 따라 이동
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
