import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import StudyBack from "../../components/StudyBack";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { API_URL } from "../../../config";
import { io } from "socket.io-client";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Classroom() {
  const [selectedLevel, setSelectedLevel] = useState("초급");
  const [progress, setProgress] = useState([]);
  const [topics, setTopics] = useState([]);
  const [nextLesson, setNextLesson] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]); // 북마크된 lesson id 목록

  const handleBookmark = async (lessonId) => {
    try {
      const response = await axios.post(
        `${API_URL}/review/save`,
        { lessonId },
        { withCredentials: true }
      );
      console.log(response.data.message);
      Alert.alert("알림", response.data.message);

      // 북마크 상태 업데이트 (토글 기능)
      setBookmarkedLessons((prev) => {
        if (prev.includes(lessonId)) {
          return prev.filter((id) => id !== lessonId);
        } else {
          return [...prev, lessonId];
        }
      });
    } catch (error) {
      console.log(error.message);
      Alert.alert("오류", "즐겨찾기 추가에 실패했습니다.");
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_URL}/progress/continue`, {
          withCredentials: true,
        });
        console.log(response.data.nextLesson);
        setNextLesson(response.data.nextLesson[0]);
      } catch (error) {
        console.error("Progress 불러오기 실패:", error);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const socketInstance = io(`${API_URL}`, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      const fetchCompletedCategories = async () => {
        try {
          const response = await axios.post(
            `${API_URL}/progress/categories`,
            {},
            { withCredentials: true }
          );
          setProgress(response.data);
          // console.log("완료된 카테고리:", response.data);
        } catch (error) {
          console.error("완료된 카테고리 불러오기 실패:", error);
        }
      };
      fetchCompletedCategories();
    });

    socketInstance.on("categoryUpdated", (data) => {
      setProgress(data);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  const renderCategoryButtons = () => (
    <View style={styles.categoryContainer}>
      {["초급", "중급", "고급"].map((level, index) => {
        // index: 0 = 초급, 1 = 중급, 2 = 고급
        // currentProgress가 5라면, 초급(1단계)은 완료된 상태
        // 중급은 currentProgress >= 6 이상일 때 열리게 설정
        const levelOrder = index + 1;
        const isLocked = currentProgress < (levelOrder - 1) * 5; // 예시 기준 (레벨당 5개 있다고 가정)

        return (
          <TouchableOpacity
            key={level}
            style={[
              styles.categoryButton,
              selectedLevel === level && styles.selectedCategory,
              isLocked && { opacity: 0.4 }, // 잠겨있을 경우 흐리게 표시
            ]}
            onPress={() => {
              if (!isLocked) {
                setSelectedLevel(level);
                fetchCategories(level);
              } else {
                alert("이 레벨은 아직 잠겨있습니다.");
              }
            }}
            disabled={isLocked}
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
      {/* <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => navigation.navigate("Review")}
      >
        <Text style={styles.reviewButtonText}>Review</Text>
      </TouchableOpacity> */}
    </View>
  );

  const [lessons, setLessons] = useState([]);
  const levels = { 초급: 1, 중급: 2, 고급: 3 };

  const currentProgress = progress.length > 0 ? Math.max(...progress) : 0;

  const fetchCategories = async (level) => {
    try {
      const levelId = levels[level];
      const response = await axios.get(
        `${API_URL}/lessons/${levelId}/categories`,
        { withCredentials: true }
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
      console.log(error.message);
      Alert.alert("오류", "강의 데이터를 불러오는 데 실패했습니다.");
    }
  };
  useEffect(() => {
    fetchCategories(selectedLevel); // selectedLevel이 변경될 때마다 호출
  }, [selectedLevel]);

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

      {/* 여기야여기 */}
      <View style={styles.NowContainer}>
        <TouchableOpacity
          style={[
            styles.contentContainer_,
            {
              backgroundColor:
                selectedLevel === "초급"
                  ? "#C7DACD"
                  : selectedLevel === "중급"
                    ? "#CBD3DF"
                    : selectedLevel === "고급"
                      ? "#E9D0CC"
                      : "#fff", // 기본값 (혹은 기본 색상을 원하면 변경)
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
            <Text
              style={styles.title}
              numberOfLines={1} // 이 설정은 텍스트가 한 줄로 표시되도록 합니다.
              ellipsizeMode="tail" // 텍스트가 길어지면 끝부분을 잘라서 '...'로 표시합니다.
            >
              Part {nextLesson.lessonCategory_id}. {nextLesson.word}
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
                  // title: lesson.title,
                  // progress: currentProgress,
                  selectedLevel: selectedLevel, // 선택한 레벨도 함께 넘겨줍니다.
                  // currentProgress: currentProgress,
                })
              }
              disabled={isLocked}
            >
              <View
                style={[
                  styles.card,
                  {
                    shadowColor: levelColors[selectedLevel], // selectedLevel에 맞는 색상을 가져옵니다.
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 5, // 안드로이드에서 그림자 효과를 보려면 elevation을 추가해야 합니다.
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
                  onPress={() => handleBookmark(lesson.id)}
                >
                  {isBookmarked ? (
                    <FontAwesome name="bookmark" size={24} color="black" />
                  ) : (
                    <FontAwesome name="bookmark-o" size={24} color="black" />
                  )}
                </TouchableOpacity>
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
                  {Array.isArray(lesson.word)
                    ? lesson.word.join(", ")
                    : lesson.word}
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
    // flexDirection: "row",
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
    // width: 100,
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
    // alignItems: "center",
    marginLeft: 20,
    // marginBottom: 15,
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
    // textAlign: "center",
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
