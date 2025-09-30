import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import StudyBack from "../../components/StudyBack";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { API_URL } from "../../../config";
import { getToken } from "../../../authStorage";

export default function Classroom() {
  const [selectedLevel, setSelectedLevel] = useState("초급");
  const [progress, setProgress] = useState([]);
  const [topics, setTopics] = useState([]);
  const [nextLesson, setNextLesson] = useState("");
  const [lessons, setLessons] = useState([]);

  const navigation = useNavigation();

  const levels = { 초급: 1, 중급: 2, 고급: 3 };

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  // 단어 배열을 문자열로 변환하는 함수
  const formatWords = (words) => {
    if (!words || !Array.isArray(words)) return "";

    return words
      .map((wordItem) => {
        return typeof wordItem === "object" ? wordItem.word : wordItem;
      })
      .join(", ");
  };

  // 다음 레슨 불러오기 - 화면 포커스시마다 갱신
  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        try {
          const accessToken = await getToken();
          if (!accessToken) {
            console.log("토큰이 없습니다");
            return;
          }

          const response = await axios.get(`${API_URL}/progress/continue`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });
          console.log("다음레슨 갱신:", response.data.nextLesson);
          setNextLesson(response.data.nextLesson[0]);
        } catch (error) {
          console.error("Progress 불러오기 실패:", error.message);
        }
      };

      fetchProgress();
    }, [])
  );

  // 완료된 카테고리 불러오기 - 화면 포커스시마다 갱신
  useFocusEffect(
    useCallback(() => {
      const fetchCompletedCategories = async () => {
        try {
          const accessToken = await getToken();
          if (!accessToken) {
            console.log("토큰이 없습니다");
            return;
          }

          const response = await axios.post(
            `${API_URL}/progress/categories`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          );

          console.log("완료된 카테고리 갱신:", response.data);
          setProgress(response.data);
        } catch (error) {
          console.error("완료된 카테고리 불러오기 실패:", error.message);
        }
      };

      fetchCompletedCategories();
    }, [])
  );

  // 카테고리 불러오기
  const fetchCategories = async (level) => {
    try {
      const accessToken = await getToken();
      if (!accessToken) {
        console.log("토큰이 없습니다");
        return;
      }

      const levelId = levels[level];
      const response = await axios.get(
        `${API_URL}/lessons/${levelId}/categories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      const totalCategories = response.data.categoriesWithWord.map(
        (lesson) => ({
          id: lesson.lessonCategory_id,
          partNumber: lesson.part_number,
          title: lesson.category,
          word: lesson.words,
          categoryImage: require("../../../assets/images/Sign.png"),
        })
      );
      setLessons(totalCategories);
      console.log("카테고리 데이터:", totalCategories);
    } catch (error) {
      console.log("카테고리 불러오기 실패:", error.message);
      Alert.alert("오류", "강의 데이터를 불러오는 데 실패했습니다.");
    }
  };

  // selectedLevel 변경시와 화면 포커스시마다 카테고리 갱신
  useFocusEffect(
    useCallback(() => {
      fetchCategories(selectedLevel);
    }, [selectedLevel])
  );

  const currentProgress = Array.isArray(progress)
    ? progress.filter((id) => lessons.some((lesson) => lesson.id === id)).length
    : 0;

  const renderCategoryButtons = () => {
    const levelsList = ["초급", "중급", "고급"];
    const levelOrder = {
      초급: 0,
      중급: 1,
      고급: 2,
    };

    const nextLevelIndex = nextLesson?.level ? levelOrder[nextLesson.level] : 0;

    return (
      <View style={styles.categoryContainer}>
        {levelsList.map((level) => {
          const isButtonLocked = levelOrder[level] > nextLevelIndex;

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.categoryButton,
                selectedLevel === level && styles.selectedCategory,
                isButtonLocked && { opacity: 0.4 },
              ]}
              onPress={() => {
                if (!isButtonLocked) {
                  setSelectedLevel(level);
                  fetchCategories(level);
                } else {
                  Alert.alert("알림", "이 레벨은 아직 잠겨있습니다.");
                }
              }}
              disabled={isButtonLocked}
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
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StudyBack />
      <Text style={styles.Title}>배움터</Text>

      {renderCategoryButtons()}

      <View style={styles.titleTextWrapper}>
        <Text style={styles.titleText}>학습진도</Text>
        <Text style={[styles.titleText, { marginLeft: 12 }]}>
          <Text
            style={[
              styles.titleText,
              { color: levelColors[selectedLevel], fontWeight: "bold" },
            ]}
          >
            {
              Array.from(progress).filter((id) =>
                lessons.some((lesson) => lesson.id === id)
              ).length
            }
          </Text>{" "}
          / {lessons.length} 강의
        </Text>
      </View>

      <View style={styles.NowContainer}>
        <TouchableOpacity
          style={[
            styles.contentContainer_,
            {
              backgroundColor:
                nextLesson?.level === "초급"
                  ? "#C7DACD"
                  : nextLesson?.level === "중급"
                    ? "#CBD3DF"
                    : nextLesson?.level === "고급"
                      ? "#E9D0CC"
                      : "#fff",
            },
          ]}
          onPress={() =>
            navigation.navigate("Study", {
              topic: nextLesson,
              lesson: nextLesson,
            })
          }
        >
          <View style={styles.card_}>
            <View style={styles.imageContainer_}>
              <Image
                source={require("../../../assets/images/Sign.png")}
                style={styles.image_}
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {nextLesson
                ? `Step ${nextLesson.step_number}. ${nextLesson.word}`
                : "다음 강의 정보를 불러오는 중..."}
            </Text>
            <Text style={styles.sub}>이어서 학습하러 가기</Text>
          </View>
          <Feather
            name="check-circle"
            size={25}
            color="black"
            style={styles.check}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {lessons.map((lesson) => {
          const isLocked = lesson.partNumber > currentProgress + 1;
          return (
            <TouchableOpacity
              key={lesson.id}
              style={styles.contentContainer}
              onPress={() =>
                navigation.navigate("LessonDetail", {
                  lesson,
                  selectedLevel: selectedLevel,
                })
              }
              disabled={isLocked}
            >
              <View
                style={[
                  styles.card,
                  {
                    shadowColor: levelColors[selectedLevel],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 5,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 10,
                  }}
                ></TouchableOpacity>
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <MaterialCommunityIcons
                      name="lock"
                      size={30}
                      color="#fff"
                    />
                  </View>
                )}
                <View style={styles.imageContainer}>
                  <Image source={lesson.categoryImage} style={styles.image} />
                </View>
              </View>
              <View style={styles.textContainer2}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Part {lesson.partNumber}. {lesson.title}
                </Text>

                <Text style={styles.sub} numberOfLines={1} ellipsizeMode="tail">
                  {formatWords(lesson.word)}
                </Text>
              </View>
              <Feather
                name="check-circle"
                size={25}
                color={
                  lesson.partNumber > currentProgress
                    ? "gray"
                    : levelColors[selectedLevel]
                }
                style={styles.check}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 12,
  },
  Title: {
    fontSize: 23.5,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    marginRight: 20,
  },
  categoryText: {
    fontSize: 19,
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
  reviewButton: {
    backgroundColor: "#FF9381",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 18,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    padding: "5%",
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 35,
    borderBottomColor: "#757575",
    borderBottomWidth: 0.3,
    borderRadius: 20,
  },
  NowContainer: {
    paddingHorizontal: 18,
  },
  contentContainer_: {
    flexDirection: "row",
    width: "100%",
    padding: "5%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "space-between",
  },
  card: {
    minHeight: "fit-content",
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  card_: {
    minHeight: "fit-content",
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer_: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  image_: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  textContainer: {
    justifyContent: "center",
    marginLeft: 20,
    flex: 1,
  },
  textContainer2: {
    justifyContent: "center",
    marginLeft: 20,
    marginBottom: -15,
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flexShrink: 1,
  },
  sub: {
    fontSize: 13,
    marginTop: 3,
  },
  check: {
    alignSelf: "center",
    marginRight: 15,
  },
  titleTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 19.3,
  },
});
