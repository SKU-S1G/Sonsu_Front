import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import ShortcutButton from "../ShortcutButton";
import axios from "axios";
import { API_URL } from "../../../config";

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>진도율 {progress}%</Text>
      <View style={styles.barBackground}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const ContinueLearning = () => {
  // 사용자의 현재 레벨 (예: "중급")
  const currentLevel = "중급"; // 예제 값, 실제로는 유저 데이터에서 가져와야 함

  // 각 레벨의 진도율
  const progressData = {
    초급: 65,
    중급: 30,
    고급: 0,
  };

  const [nextLesson, setNextLesson] = useState("");
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_URL}/progress/continue`, {
          withCredentials: true,
        });
        console.log(response.data.nextLesson); // 응답 데이터를 콘솔에 출력해서 확인
        setNextLesson(response.data.nextLesson[0]); // 첫 번째 'nextLesson'만 상태에 저장
      } catch (error) {
        console.error("Progress 불러오기 실패:", error);
      }
    };
    fetchProgress();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>이어서 학습하기</Text>
        <ShortcutButton style={styles.ShortcutButton} destination="Classroom" />
      </View>
      <View style={styles.content}>
        {/* 왼쪽 (이미지) */}
        <View style={styles.imageContainer}>
          <AntDesign
            name="playcircleo"
            size={38}
            color="black"
            style={styles.play}
          />
          <Image
            style={styles.image}
            source={require("../../../assets/images/sonsuModel.png")}
          />
        </View>

        {/* 오른쪽 (정보 + 진도율) */}
        <View style={styles.infoContainer}>
          {/* 제목 */}
          <View>
            <Text style={styles.partTitle}> {nextLesson.lessonCategory_id}. {nextLesson.word}</Text>
            <Text style={styles.levelText}>{currentLevel}</Text>
          </View>

          {/* 현재 레벨의 진도율만 표시 */}
          {progressData[currentLevel] > 0 && (
            <ProgressBar progress={progressData[currentLevel]} />
          )}
          <View style={styles.btnCotainer}>
            <TouchableOpacity style={styles.learnBtn}>
              <Text style={styles.learnBtnText}>배움터 바로가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
  },
  titleWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    width: 128,
    height: 174,
    backgroundColor: "#CEE9C4",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  play: {
    position: "absolute",
    zIndex: 10,
  },
  image: {
    width: 86,
    height: 135,
    resizeMode: "contain",
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  partTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  levelText: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginTop: 5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
  },
  barBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  btnCotainer: {
    alignItems: "center",
  },
  learnBtn: {
    backgroundColor: "#F7EABF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  learnBtnText: {
    color: "#000",
    fontSize: 12,
    textAlign: "center",
  },
});

export default ContinueLearning;
