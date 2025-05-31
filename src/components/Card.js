import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwind from "tailwind-rn";
import { Video } from "expo-av";

export default function Card({ lesson, currentProgress, onPress }) {
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
      <View
        style={[
          tailwind("items-center text-center"),
          {
            backgroundColor: "#FFE694",
            paddingHorizontal: 6,
            width: 100,
            paddingVertical: 5,
            borderRadius: 15,
            alignSelf: "center",
          },
        ]}
      >
        <Text style={{ fontSize: 12 }}>다시 학습하기</Text>
      </View>
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
