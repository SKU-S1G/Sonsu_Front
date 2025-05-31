import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";

const ReviewIncorrectSignsDetail = () => {
  const route = useRoute();
  const { week, signs } = route.params;

  // 중복 수어는 한 번씩만
  const uniqueSigns = Array.from(
    new Map(signs.map((sign) => [sign.word, sign])).values()
  );

  return (
    <View>
      <Header />
      <BackGround />
      <Text style={styles.title}>{week}주차 오답 수어</Text>

      <ScrollView style={{ paddingHorizontal: 20 }}>
        {uniqueSigns.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            오답 수어가 없습니다.
          </Text>
        ) : (
          <View style={styles.listContainer}>
            {uniqueSigns.map((sign, index) => (
              <View key={`${sign.word}-${index}`} style={styles.card}>
                <Text style={styles.wordText}>{sign.word}</Text>
                {/* <Text style={styles.subText}>Step.{sign.lesson_id}</Text> */}
                <Video
                  source={{ uri: sign.animation_path }}
                  useNativeControls
                  style={styles.video}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
    color: "#333",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: "48%",
    backgroundColor: "#F9F8F3",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0DFD5",
    alignItems: "center",
  },
  wordText: {
    backgroundColor: "#EEE8D6",
    // color: "#444",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  video: {
    width: "91%",
    height: 74,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});

export default ReviewIncorrectSignsDetail;
