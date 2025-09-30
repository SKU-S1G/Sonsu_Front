import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Header from "../../components/Header";
import Feather from "@expo/vector-icons/Feather";
import StudyBack from "../../components/StudyBack";
import axios from "axios";
import { API_URL } from "../../../config";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getToken } from "../../../authStorage";

export default function LessonDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, selectedLevel: initialSelectedLevel } = route.params;
  const [bookmarkedTopics, setBookmarkedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  // 북마크 불러오기 - useFocusEffect로 변경
  useFocusEffect(
    useCallback(() => {
      const fetchBookmarkedTopics = async () => {
        try {
          const accessToken = await getToken();
          if (!accessToken) {
            console.log("토큰이 없습니다");
            return;
          }
          const response = await axios.get(`${API_URL}/review/lessons`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });
          setBookmarkedTopics(response.data.map((item) => item.lesson_id));
        } catch (error) {
          console.log("북마크 불러오기 실패:", error.message);
        }
      };

      fetchBookmarkedTopics();
    }, [])
  );

  // 진도 불러오기 - useFocusEffect로 변경하여 화면 포커스시마다 갱신
  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        try {
          const accessToken = await getToken();
          if (!accessToken) {
            console.log("토큰이 없습니다.");
            return;
          }

          const response = await axios.post(
            `${API_URL}/progress/topics`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          );
          console.log("진도 데이터 갱신:", response.data);
          setProgress(response.data || []);
        } catch (error) {
          console.error("진도 불러오기 실패:", error.message);
        }
      };

      fetchProgress();
    }, [])
  );

  // 토픽 불러오기 - useFocusEffect로 변경
  useFocusEffect(
    useCallback(() => {
      const fetchTopic = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/lessons/${lesson.id}/topics`,
            {
              withCredentials: true,
            }
          );
          console.log("토픽 데이터 갱신:", response.data);
          setTopics(response.data);
        } catch (error) {
          console.log("토픽 불러오기 실패:", error.message);
        }
      };
      fetchTopic();
    }, [lesson.id])
  );

  // 북마크 추가/삭제
  const handleBookmark = async (topicId) => {
    try {
      const accessToken = await getToken();
      if (!accessToken) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      if (bookmarkedTopics.includes(topicId)) {
        // 삭제
        const response = await axios.delete(
          `${API_URL}/review/delete/${topicId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        setBookmarkedTopics((prev) => prev.filter((id) => id !== topicId));
        Alert.alert("알림", response.data.message);
      } else {
        // 추가
        const response = await axios.post(
          `${API_URL}/review/save`,
          { lessonId: topicId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        setBookmarkedTopics((prev) => [...prev, topicId]);
        Alert.alert("알림", response.data.message);
      }
    } catch (error) {
      console.error("북마크 처리 실패:", error);
      Alert.alert("오류", error.response?.data?.message || "북마크 처리 실패");
    }
  };

  // 잠금 로직
  const isTopicLocked = useCallback(
    (topic, index) => {
      if (index === 0) return false; // 첫 번째 강의는 항상 열림

      const prevTopic = topics[index - 1];
      if (!prevTopic) return true;

      const prevCompleted = progress.some(
        (p) => p.lesson_id === prevTopic.lesson_id && p.status === "completed"
      );

      return !prevCompleted;
    },
    [topics, progress]
  );

  // 완료 여부 확인
  const isTopicCompleted = (topic) => {
    return progress.some(
      (p) => p.lesson_id === topic.lesson_id && p.status === "completed"
    );
  };

  // Step 클릭 핸들러
  const handleTopicClick = (topic, index) => {
    if (!isTopicLocked(topic, index)) {
      navigation.navigate("Study", { topic, lesson, index });
    } else {
      Alert.alert(
        "알림",
        "이 강의는 이전 강의를 완료한 후 이용할 수 있습니다."
      );
    }
  };

  const renderCategoryButtons = () => (
    <View style={styles.categoryContainer}>
      {["초급", "중급", "고급"].map(
        (level) =>
          selectedLevel === level && (
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
              </View>
              {selectedLevel === level && (
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: levelColors[level] },
                  ]}
                />
              )}
            </TouchableOpacity>
          )
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StudyBack />
      <Header color="#fff" />
      <View style={styles.backButton}>
        <Text style={styles.Title}>
          {"Part"} {lesson.partNumber}. {lesson.title}
        </Text>
      </View>

      {renderCategoryButtons()}

      <View style={styles.titleTextWrapper}>
        <Text style={styles.titleText}>학습진도</Text>
        <Text style={[styles.titleText, { marginLeft: 12 }]}>
          <Text
            style={[styles.titleText, { color: "#39B360", fontWeight: "bold" }]}
          >
            {
              topics.filter((topic) =>
                progress.some(
                  (p) =>
                    p.lesson_id === topic.lesson_id && p.status === "completed"
                )
              ).length
            }
          </Text>{" "}
          / {topics.length} 강의
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {topics.map((topic, index) => {
          const isLocked = isTopicLocked(topic, index);
          const isCompleted = isTopicCompleted(topic);

          return (
            <TouchableOpacity
              key={index}
              style={styles.contentContainer}
              disabled={isLocked}
              onPress={() => handleTopicClick(topic, index)}
            >
              <View style={styles.card}>
                {!isLocked && (
                  <TouchableOpacity
                    onPress={() => handleBookmark(topic.lesson_id)}
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      zIndex: 2,
                    }}
                  >
                    {bookmarkedTopics.includes(topic.lesson_id) ? (
                      <AntDesign name="star" size={24} color="#FFCA1A" />
                    ) : (
                      <AntDesign name="staro" size={24} color="#FFCA1A" />
                    )}
                  </TouchableOpacity>
                )}

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
                  <Image
                    source={require("../../../assets/images/Sign.png")}
                    style={styles.image}
                  />
                </View>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  Step {index + 1}. {topic.word}
                </Text>
              </View>

              <Feather
                name="check-circle"
                size={27}
                color={
                  isLocked || !isCompleted ? "gray" : levelColors[selectedLevel]
                }
                style={styles.check}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE694",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  Title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    marginRight: 20,
    paddingVertical: 8,
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
  scrollContainer: {
    flexGrow: 1,
    flexWrap: "wrap",
    padding: 18,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    padding: "5%",
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: "space-between",
    paddingBottom: 35,
    borderBottomColor: "#757575",
    borderBottomWidth: 0.3,
    borderRadius: 20,
  },
  card: {
    position: "relative",
    minHeight: "fit-content",
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
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
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  titleTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 19.3,
  },
  check: {
    alignSelf: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flexShrink: 1,
  },
});
