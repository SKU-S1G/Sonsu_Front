import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import classData from "../../../utils/ClassData";
import axios from "axios";
import { API_URL } from "../../../config";

const SignReview = () => {
  const [selectedLevel, setSelectedLevel] = useState("초급");
  const [savedSigns, setSavedSigns] = useState([]);

  useEffect(() => {
    const fetchSavedSigns = async () => {
      try {
        const response = await axios.get(`${API_URL}/review/lessons`, {
          headers: {
            Authorization: accessToken, // 필요 시 토큰 변수 설정
          },
        });
        setSavedSigns(response.data);
      } catch (error) {
        console.error("즐겨찾기 데이터를 불러오지 못했습니다:", error);
      }
    };

    fetchSavedSigns();
  }, []);

  const filteredSigns = savedSigns.filter((item) => {
    const lesson = classData[selectedLevel]?.find(
      (lesson) => lesson.id === item.lesson_id
    );
    return !!lesson; // 현재 카테고리에 해당하는 것만 필터링
  });

  const [progress, setProgress] = useState({
    초급: { lessonId: 3, lastCompletedTopic: "감사합니다" },
    중급: { lessonId: 0, lastCompletedTopic: null },
    고급: { lessonId: 0, lastCompletedTopic: null },
  });

  const navigation = useNavigation();

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  const renderCategoryButtons = () => (
    <View style={styles.categoryContainer}>
      {["초급", "중급", "고급"].map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.categoryButton,
            selectedLevel === level && styles.selectedCategory,
          ]}
          onPress={() => setSelectedLevel(level)}
        >
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.categoryText,
                selectedLevel === level && styles.selectedCategoryText,
              ]}
            >
              {level}
            </Text>
            {selectedLevel === level && (
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: levelColors[level] },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const lessons = classData[selectedLevel] || [];
  const currentProgress = progress[selectedLevel];

  return (
    <View>
      <Header />
      <BackGround />
      <View>
        <Text style={{ fontSize: 30, textAlign: "center", marginBottom: 5 }}>
          수어 즐겨찾기
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: "#333",
            marginBottom: "10%",
          }}
        >
          저장한 수어로 언제든지 복습하고, 학습한 내용을 되돌아보세요.
        </Text>
      </View>
      {renderCategoryButtons()}
      <View style={{ paddingHorizontal: 20 }}>
        {filteredSigns.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            저장된 수어가 없습니다.
          </Text>
        ) : (
          filteredSigns.map((item) => {
            const lesson = classData[selectedLevel]?.find(
              (lesson) => lesson.id === item.lesson_id
            );

            return (
              <TouchableOpacity
                key={item.userSaved_id}
                style={{
                  marginBottom: 15,
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: "#f1f1f1",
                }}
                onPress={() =>
                  navigation.navigate("Study", { topic: item, lesson })
                }
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.word}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  레슨 ID: {item.lesson_id}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    marginRight: 20,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#666",
  },
  selectedCategoryText: {
    color: "#333",
  },
  textWrapper: {
    alignItems: "center",
  },
  indicator: {
    marginTop: 5,
    width: 40,
    height: 5,
    borderRadius: 10,
  },
});

export default SignReview;
