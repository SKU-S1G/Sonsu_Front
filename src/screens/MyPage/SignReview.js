import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import classData from "../../../utils/ClassData";
import axios from "axios";
import { API_URL } from "../../../config";
import { getToken } from "../../../authStorage";
import { Video } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";
import { Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const SignReview = () => {
  const [selectedLevel, setSelectedLevel] = useState("초급");
  const [savedSigns, setSavedSigns] = useState([]);

  useEffect(() => {
    const fetchSavedSigns = async () => {
      try {
        const accessToken = await getToken(); // 토큰 비동기로 받아오기
        if (!accessToken) {
          console.log("토큰이 없습니다");
          return;
        }

        const response = await axios.get(`${API_URL}/review/lessons`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰 넣기
          },
        });

        setSavedSigns(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("즐겨찾기 데이터를 불러오지 못했습니다:", error);
      }
    };

    fetchSavedSigns();
  }, []);

  const filteredSigns = savedSigns.filter((item) => {
    const lesson = classData[selectedLevel]?.find((lesson) =>
      lesson.topics.includes(item.word)
    );
    return !!lesson;
  });

  const navigation = useNavigation();

  const levelColors = {
    초급: "#39B360",
    중급: "#487BCD",
    고급: "#FF9381",
  };

  const route = useRoute();
  const [bookmarkedTopics, setBookmarkedTopics] = useState([]);

  // 북마크
  useEffect(() => {
    const fetchBookmarkedTopics = async () => {
      try {
        const accessToken = await getToken();
        if (!accessToken) {
          console.log("토큰이 없습니다");
          return;
        }
        const response = await axios.get(`${API_URL}/review/lessons`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰 넣기
          },
        });

        // setBookmarkedTopics(response.data);
        setBookmarkedTopics(response.data.map((item) => item.lesson_id));
      } catch (error) {
        console.log("북마크 불러오기 실패:", error.message);
      }
    };

    fetchBookmarkedTopics();
  }, []);

  const handleBookmark = async (topicId) => {
    if (bookmarkedTopics.includes(topicId)) {
      const success = await deleteBookmark(topicId);
      if (success) {
        setBookmarkedTopics((prev) => prev.filter((id) => id !== topicId));
        setSavedSigns((prev) =>
          prev.filter((item) => item.lesson_id !== topicId)
        ); // 화면 갱신
      }
    } else {
      try {
        const accessToken = await getToken();
        if (!accessToken) {
          Alert.alert("오류", "로그인이 필요합니다.");
          return;
        }
        const response = await axios.post(
          `${API_URL}/review/save`,
          { lessonId: topicId },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Alert.alert("알림", response.data.message);

        setBookmarkedTopics((prev) => [...prev, topicId]);

        // 저장한 항목 다시 가져오기 (선택)
        const updatedResponse = await axios.get(`${API_URL}/review/lessons`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSavedSigns(updatedResponse.data);
      } catch (error) {
        console.log(error.message);
        Alert.alert("오류", "즐겨찾기 추가에 실패했습니다.");
      }
    }
  };

  // 즐찾 삭제
  const deleteBookmark = async (topicId) => {
    try {
      const accessToken = await getToken();
      if (!accessToken) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return false;
      }

      const response = await axios.delete(
        `${API_URL}/review/delete/${topicId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Alert.alert("알림", response.data.message);
      setSavedSigns((prev) =>
        prev.filter((item) => item.lesson_id !== topicId)
      ); // 화면 갱신
      return true;
    } catch (error) {
      console.log(
        "즐겨찾기 삭제 실패:",
        error.response?.data?.message || error.message
      );
      Alert.alert(
        "오류",
        error.response?.data?.message || "즐겨찾기 삭제에 실패했습니다."
      );
      return false;
    }
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

  return (
    <View style={{ fontSize: 30, textAlign: "center", paddingBottom: 260 }}>
      <Header />
      <BackGround />
      <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          수어 즐겨찾기
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            color: "#333",
            marginBottom: 25,
          }}
        >
          저장한 수어로 언제든지 복습하고, 학습한 내용을 되돌아보세요.
        </Text>
      </View>
      {renderCategoryButtons()}

      <ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          {filteredSigns.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
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
                    marginBottom: 20,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    padding: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={() =>
                    navigation.navigate("Study", { topic: item, lesson })
                  }
                >
                  {/* 북마크 아이콘 - 우측 상단 */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 25,
                      zIndex: 10,
                    }}
                    onPress={() => handleBookmark(item.lesson_id)}
                  >
                    <FontAwesome
                      name={
                        bookmarkedTopics.includes(item.lesson_id)
                          ? "bookmark"
                          : "bookmark-o"
                      }
                      size={30}
                      color="#FFCA1A"
                    />
                  </TouchableOpacity>

                  {/* 영상 */}
                  <Video
                    source={{ uri: item.animation_path }}
                    shouldPlay={true}
                    isMuted={true}
                    isLooping={true}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 10,
                      backgroundColor: "#F0F0F0",
                    }}
                  />

                  {/* 텍스트 */}
                  <View style={{ marginTop: 14, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 14, color: "#888" }}>
                      Part {item.lessonCategory_id}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginTop: 4,
                        color: "#333",
                      }}
                    >
                      {item.word}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 13,
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
