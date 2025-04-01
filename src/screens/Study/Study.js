import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpeedBack from "../../components/SpeedBack";
import { WebView } from "react-native-webview";
import { API_URL, serverIP } from "../../../config";
import axios from "axios";

export default function Study() {
  const route = useRoute();
  const { topic, lesson, index } = route.params;
  const navigation = useNavigation();
  const [animation, setAnimation] = useState(null);

  // const serverIP = "http://192.168.45.144:5001";
  // const serverIP = "http://192.168.10.20:5001";
  // const serverIP = "http://192.0.0.2:5001";
  // const serverIP = "http://192.168.1.123:5001";
  const fetchTopic = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/lessons/${lesson.id}/topics`
      );
      // console.log(response.data);
      const topicData = response.data.find((t) => t.word === topic.word);
      if (topicData) {
        const animationPath = topicData.animation_path;
        console.log("서버에서 전달된 URL:", animationPath);
        setAnimation(animationPath);
        // setAnimation(topiceData.animation_path);
      }
    } catch (error) {
      console.log("애니메이션 불러오기 실패:", error.message);
    }
  };

  const startLesson = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/lessons/start`,
        { lessonId: topic.lesson_id },
        { withCredentials: true }
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
        }
      } else {
        console.log("에러 발생:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchTopic();
    startLesson();
    // console.log("강의 정보:", lesson);
  }, [topic]);

  return (
    <SafeAreaView style={styles.container}>
      <SpeedBack heightMultiplier={1.88} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.screenContainer}>
          <Text style={styles.title}>{`Step ${index + 1}. ${topic.word}`}</Text>
          {/* topic 객체라 topic => topic.word 수정 */}
        </View>
      </TouchableOpacity>

      {animation && (
        <WebView
          source={{
            uri: animation,
          }} // 비디오 URL을 WebView에서 재생
          style={styles.video}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={false}
          mediaPlaybackRequiresUserAction={false}
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
          source={{ uri: `${serverIP}/video_feed` }}
          style={styles.cameraFeed}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onError={(error) => console.log("WebView error:", error)}
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
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginTop: 20,
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
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    marginTop: 20,
  },
  desContainer: {
    marginTop: 30,
    width: 330,
  },
  describe: {
    fontSize: 15,
    paddingVertical: 2,
  },
  cameraFeedWrapper: {
    width: 350,
    height: 197,
    overflow: "hidden",
    marginTop: 40,
  },
  cameraFeed: {
    flex: 1,
    backgroundColor: "transparent",
  },
  practiceButton: {
    marginTop: 30,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
