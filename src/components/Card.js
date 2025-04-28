import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwind from "tailwind-rn";

export default function Card({ lesson, currentProgress, onPress }) {
  const lessonLocked = lesson.id > currentProgress.lessonId;

  return (
    <View>
      <View
        style={styles.contentContainer}
        onPress={onPress}
        disabled={lessonLocked}
      >
        <View style={styles.card}>
          {lessonLocked && (
            <View style={styles.lockOverlay}>
              <MaterialCommunityIcons name="lock" size={30} color="#fff" />
            </View>
          )}
          <View style={styles.imageContainer}>
            <Image source={lesson.animationPath} style={styles.image} />
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
            paddingVertical: 5,
            borderRadius: 15,
          },
        ]}
      >
        <Text style={{fontSize: 15}}>다시 학습하기</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "column",
  },
  card: {
    minHeight: "fit-content",
    paddingVertical: 14,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 1,
  },
  imageContainer: {
    // width: 80,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 8,
    paddingVertical: 5,
    width: 115,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
});
