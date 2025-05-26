import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import Feather from "@expo/vector-icons/Feather";
import StudyBack from "../../components/StudyBack";
import axios from "axios";
import { API_URL } from "../../../config";
import { io } from "socket.io-client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Alert } from "react-native";

export default function LessonDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, selectedLevel: initialSelectedLevel } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]); // 북마크된 lesson id 목록
  const [bookmarkedTopics, setBookmarkedTopics] = useState([]);

  const handleBookmark = async (topicId) => {
    try {
      const response = await axios.post(
        `${API_URL}/review/save`,
        { topicId },
        { withCredentials: true }
      );
      console.log(response.data.message);
      Alert.alert("알림", response.data.message);

      // 북마크 상태 업데이트 (토글 기능)
      setBookmarkedTopics((prev) => {
        if (prev.includes(topicId)) {
          return prev.filter((id) => id !== topicId);
        } else {
          return [...prev, topicId];
        }
      });
    } catch (error) {
      console.log(error.message);
      Alert.alert("오류", "즐겨찾기 추가에 실패했습니다.");
    }
  };

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel); // 파람으로 받은 selectedLevel을 초기값으로 설정
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const socketInstance = io(`${API_URL}`, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      const fetchUserProgress = async () => {
        try {
          const response = await axios.post(`${API_URL}/progress/topics`, {
            withCredentials: true,
          });
          if (response.status === 200) {
            // console.log("학습 진행 데이터:", response.data);
            setProgress(response.data);
          }
        } catch (error) {
          console.error(
            "학습 진행 데이터를 불러오는 데 실패했습니다:",
            error.message
          );
        }
      };

      fetchUserProgress();
    });

    socketInstance.on("progressUpdated", (data) => {
      if (data) {
        setProgress(data);
        // console.log("Socket Progress:", data);
      } else {
        console.error("수신된 데이터가 없습니다");
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/lessons/${lesson.id}/topics`
        );
        // console.log("받은 주제 데이터:", response.data);
        setTopics(response.data);
      } catch (error) {
        console.log("불러오기 실패:", error.message);
      }
    };
    fetchTopic();
  }, [lesson.id]);

  const isTopicLocked = useCallback(
    (categoryId, index) => {
      const categoryLessons = topics.filter(
        (topic) => topic.lessonCategory_id === categoryId
      );

      if (categoryLessons.length === 0) return true;

      let completedLessons = progress.filter((p) =>
        categoryLessons.some(
          (lesson) =>
            lesson.lesson_id === p.lesson_id && p.status === "completed"
        )
      );

      let count = completedLessons.length;

      if (
        categoryLessons[0] &&
        !progress.some(
          (p) =>
            p.lesson_id === categoryLessons[0].lesson_id &&
            p.status === "completed"
        )
      ) {
        count = 0;
      }

      return index > count;
    },
    [topics, progress]
  );

  const renderCategoryButtons = () => (
    <View style={styles.categoryContainer}>
      {["초급", "중급", "고급"].map(
        (level) =>
          selectedLevel === level && (
            <TouchableOpacity
              key={level}
              style={[
                styles.categoryButton,
                selectedLevel === level && styles.selectedCategory, // 활성화된 카테고리 스타일
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedLevel === level && styles.selectedCategoryText, // 활성화된 카테고리 텍스트 스타일
                  ]}
                >
                  {level}
                </Text>
              </View>
              {selectedLevel === level && (
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: levelColors[level] }, // 카테고리별 색상
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
          {"Part"} {lesson.id}. {lesson.title}
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
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contentContainer}
            disabled={
              index !== 0 && isTopicLocked(topic.lessonCategory_id, index)
            }
            onPress={() =>
              navigation.navigate("Study", { topic, lesson, index })
            }
          >
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => handleBookmark(topic.id)}
                style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
              >
                {bookmarkedTopics.includes(topic.id) ? (
                  <FontAwesome name="bookmark" size={24} color="black" />
                ) : (
                  <FontAwesome name="bookmark-o" size={24} color="black" />
                )}
              </TouchableOpacity>

              {index !== 0 && isTopicLocked(topic.lessonCategory_id, index) && (
                <View style={styles.lockOverlay}>
                  <MaterialCommunityIcons name="lock" size={30} color="#fff" />
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
                isTopicLocked(topic.lessonCategory_id, index) ||
                !progress.some(
                  (p) =>
                    p.lesson_id === topic.lesson_id && p.status === "completed"
                )
                  ? "gray"
                  : levelColors[selectedLevel]
              }
              style={styles.check}
            />
          </TouchableOpacity>
        ))}
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
    position: "relative", // 아이콘 절대 위치 기준
    minHeight: "fit-content",
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },

  // bookmarkIcon: {
  //   position: "absolute",
  //   top: 8,
  //   left: 8,
  //   zIndex: 2,
  // },

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
    // alignItems: "center",
    marginLeft: 10,
    // marginBottom: 15,
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
  NowContainer: {
    paddingHorizontal: 18,
  },

  contentContainer_: {
    flexDirection: "row",
    backgroundColor: "white",
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
  card_: {
    // width: 100,
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
  image_: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  check: {
    alignSelf: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    // textAlign: "center",
    flexShrink: 1, // 텍스트가 넘치면 잘리도록 합니다.
  },
  sub: {
    fontSize: 15,
    marginTop: 3,
  },
});
