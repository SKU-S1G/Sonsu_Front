import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpeedBack from "../../components/SpeedBack";
import { WebView } from "react-native-webview";
import { API_URL, serverIP } from "../../../config";
import axios from "axios";
import { getToken } from "../../../authStorage";

export default function StudyOnly() {
  const route = useRoute();
  const { topic, lesson, index } = route.params;
  const navigation = useNavigation();

  console.log("topic", topic);
  console.log("lesson_id to complete:", topic.lesson_id);

  const completeLesson = async () => {
    try {
      const accessToken = await getToken();
      if (!accessToken) {
        console.log("토큰이 없습니다");
        Alert.alert("알림", "로그인이 필요합니다.");
        return;
      }

      console.log("완료 요청 URL:", `${API_URL}/lessons/complete`);
      console.log("요청 데이터:", { lessonId: topic.lesson_id });

      const response = await axios.put(
        `${API_URL}/lessons/complete`,
        { lessonId: topic.lesson_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("수강 완료:", response.data.message);
        Alert.alert("완료", "학습을 완료했습니다!", [
          {
            text: "확인",
            onPress: () => {
              // 두 단계 뒤로 가기 (Study -> LessonDetail로)
              // navigate 대신 goBack 사용하여 화면 스택 정리
              navigation.goBack(); // StudyOnly -> Study
              setTimeout(() => {
                navigation.goBack(); // Study -> LessonDetail
              }, 100);
            },
          },
        ]);
      }
    } catch (error) {
      console.log("완료 요청 중 에러 발생:", error.message);

      if (error.response) {
        console.log("에러 상태:", error.response.status);
        console.log("에러 데이터:", error.response.data);
        console.log("에러 헤더:", error.response.headers);

        if (error.response.status === 404) {
          Alert.alert(
            "오류",
            "학습 완료 처리에 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        } else if (error.response.status === 401) {
          Alert.alert("알림", "로그인이 만료되었습니다. 다시 로그인해주세요.");
        }
      } else if (error.request) {
        console.log("요청 에러:", error.request);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      } else {
        console.log("기타 에러:", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.screenContainer}>
          <Image
            source={require("../../../assets/images/SonsuLogo.png")}
            style={{ width: 30, height: 30 }}
          />
          <View>
            <Text
              style={styles.title}
            >{`Step ${topic.step_number}. ${topic.word}`}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.desContainer}>
        <Text style={{ fontSize: 25, fontWeight: "semibold" }}>혼자해보기</Text>
      </View>

      {/* 카메라 비디오 스트리밍 WebView */}
      <View style={styles.cameraFeedWrapper}>
        <WebView
          source={{ uri: `${serverIP}/game1/video_feed` }}
          style={styles.cameraFeed}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("HTTP error: ", nativeEvent);
          }}
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18 }}>혼자서 학습해보세요!</Text>
        </View>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={completeLesson}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            '{topic.word}'
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBE7A6",
  },
  screenContainer: {
    flexDirection: "row",
    marginLeft: 30,
    marginTop: 20,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 27,
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 5,
  },
  desContainer: {
    alignItems: "flex-start",
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 15,
    width: 350,
  },
  backButton: {
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  cameraFeedWrapper: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
  },
  cameraFeed: {
    backgroundColor: "transparent",
    width: "100%",
    height: 400,
    borderRadius: 0,
    overflow: "hidden",
    aspectRatio: 3 / 4,
  },
});
