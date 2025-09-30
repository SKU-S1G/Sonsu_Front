import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpeedBack from "../../components/SpeedBack";
import { Video } from "expo-av";
import { API_URL, serverIP } from "../../../config";
import { WebView } from "react-native-webview";
import axios from "axios";
import { getToken } from "../../../authStorage";

export default function Study() {
  const route = useRoute();
  const { topic, lesson, index } = route.params;
  const navigation = useNavigation();
  const [animation, setAnimation] = useState("");

  console.log("레슨아이디", lesson);
  console.log("토픽 정보", topic);

  const fetchTopic = async () => {
    try {
      // lesson이 객체인 경우 처리
      const lessonId =
        typeof lesson === "object" ? lesson.lesson_id : lesson.id;

      console.log("요청할 lessonId:", lessonId);

      const response = await axios.get(`${API_URL}/lessons/${lessonId}/topics`);
      console.log("토픽 데이터", response.data);

      const topicData = response.data.find((t) => t.word === topic.word);
      if (topicData) {
        const animationPath = topicData.animation_path;
        console.log("서버에서 전달된 URL:", animationPath);
        setAnimation(animationPath);
      }
    } catch (error) {
      console.log("애니메이션 불러오기 실패:", error.message);
      if (error.response) {
        console.log("에러 상태:", error.response.status);
        console.log("에러 데이터:", error.response.data);
      }
    }
  };

  console.log("비디오 여기", animation);

  const startLesson = async () => {
    try {
      const accessToken = await getToken();

      if (!accessToken) {
        console.log("토큰이 없습니다. 로그인이 필요합니다.");
        return;
      }

      console.log("강의 시작 요청 - lessonId:", topic.lesson_id);

      const response = await axios.post(
        `${API_URL}/lessons/start`,
        { lessonId: topic.lesson_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("강의가 시작되었습니다", response.data);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log("로그인을 해주세요.");
        } else if (error.response.status === 403) {
          console.log("접근이 거부되었습니다. 토큰이 유효하지 않습니다.");
        } else {
          console.log("에러 상태:", error.response.status);
          console.log("에러 데이터:", error.response.data);
        }
      } else {
        console.log("에러 발생:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchTopic();
    startLesson();
  }, [topic]);

  return (
    <SafeAreaView style={styles.container}>
      <SpeedBack heightMultiplier={1.55} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.screenContainer}>
          <Text
            style={styles.title}
          >{`Step ${topic.step_number}. ${topic.word}`}</Text>
        </View>
      </TouchableOpacity>

      {/* topic.animation_path를 직접 사용 (이미 URL이 있음) */}
      {topic?.animation_path && (
        <Video
          source={{ uri: topic.animation_path }}
          resizeMode="contain"
          isLooping
          style={styles.video}
          useNativeControls={true}
          shouldPlay={true}
        />
      )}

      <View style={styles.desContainer}>
        <Text style={styles.describe}>
          1. 오른 손바닥으로 왼 팔등을 스쳐내리세요.
        </Text>
        <Text style={styles.describe}>
          2. 두 주먹을 쥐고 바닥이 아래로 향하게 하여 가슴 앞에서 아래로 내려요
        </Text>
      </View>

      <View style={styles.cameraFeedWrapper}>
        <WebView
          source={{ uri: `${serverIP}/game1/video_feed` }}
          style={styles.cameraFeed}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            // console.log("HTTP error: ", nativeEvent);
          }}
        />
      </View>

      {/* 혼자 해보기 버튼 */}
      <TouchableOpacity
        style={styles.practiceButton}
        onPress={() =>
          navigation.navigate("StudyOnly", { topic, lesson, index })
        }
      >
        <Text style={styles.practiceButtonText}>혼자 해보기 →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginTop: 33,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "85%",
    height: undefined,
    borderRadius: 10,
    aspectRatio: 16 / 9,
    marginTop: 43,
  },
  desContainer: {
    marginTop: 45,
    width: 330,
  },
  describe: {
    fontSize: 18,
    paddingVertical: 3,
  },
  cameraFeedWrapper: {
    width: 350,
    height: 197,
    overflow: "hidden",
    marginTop: 45,
    borderRadius: 15,
  },
  cameraFeed: {
    flex: 1,
    backgroundColor: "transparent",
  },
  practiceButton: {
    marginTop: 35,
    backgroundColor: "#FFE694",
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  practiceButtonText: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
