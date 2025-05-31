import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import Card from "./Card";
import classData from "../../utils/ClassData";
import axios from "axios";
import { API_URL } from "../../config";
import { getToken } from "../../authStorage";

export default function ReviewCard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWrongAnswers = async () => {
      try {
        const response = await axios.get(`${API_URL}/quiz/wrong`);
        const data = response.data.data;

        // recorded_at 기준 내림차순 정렬
        const sortedData = data.sort(
          (a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)
        );

        const limitedData = sortedData.slice(0, 10);

        setCards(limitedData);
      } catch (error) {
        console.error("오답 수어 데이터를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWrongAnswers();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        {cards.map((lesson, index) => (
          <Card
            key={index}
            lesson={{
              id: lesson.lesson_id,
              title: lesson.word,
              animation_path: lesson.animation_path,
            }}
            currentProgress={{ lessonId: 10 }}
            onPress={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
    width: "100%",
  },
});
