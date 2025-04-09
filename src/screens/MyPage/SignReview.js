import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import classData from "../../../utils/ClassData";

const SignReview = () => {
  const [selectedLevel, setSelectedLevel] = useState("초급");

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
