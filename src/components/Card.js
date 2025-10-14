import React, { useRef } from "react";
import { Audio } from "expo-av";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwind from "tailwind-rn";
import { Video } from "expo-av";

export default function Card({ lesson, currentProgress, onPress }) {
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
  return (
    <View>
      <View style={styles.contentContainer} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Video
              style={styles.image}
              source={{ uri: lesson.animation_path }}
              resizeMode="contain"
              useNativeControls={false}
              shouldPlay={true}
              isMuted={true}
              isLooping={true}
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            Part {lesson.id}. {lesson.title}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          playClickSound(); // 클릭 소리 재생
          onPress(); // 기존 onPress 동작
        }}
        style={[
          tailwind("items-center text-center"),
          {
            backgroundColor: "#FFE694",
            paddingHorizontal: 6,
            width: 100,
            paddingVertical: 5,
            borderRadius: 15,
            alignSelf: "center",
            marginTop: 4,
          },
        ]}
      >
        <Text style={{ fontSize: 12 }}>다시 학습하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 4,
  },
  card: {
    marginBottom: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  imageContainer: {
    // width: 80,
  },
  image: {
    width: 150,
    height: 84,
    resizeMode: "contain",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 4,
    paddingVertical: 5,
    width: 115,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
    marginTop: 4,
  },
});
