import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpeedBack from "../../components/SpeedBack";
import { WebView } from "react-native-webview"; // WebView import 추가
import { API_URL, serverIP } from "../../../config";
import axios from "axios";

export default function StudyOnly() {
  const route = useRoute();
  const { topic, lesson, index } = route.params;
  const navigation = useNavigation();

  console.log("topic", topic);

  const completeLesson = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/lessons/complete`,
        { lessonId: topic.lesson_id },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("수강 완료:", response.data.message);
      }
    } catch (error) {
      console.log("완료 요청 중 에러 발생:", error.message);
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
            >{`Step ${topic.lessonCategory_id}. ${topic.word}`}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.desContainer}>
        <Text style={{ fontSize: 23, fontWeight: "semibold" }}>혼자해보기</Text>
      </View>

      {/* 카메라 비디오 스트리밍 WebView */}
      <View style={styles.cameraFeedWrapper}>
        <WebView
          source={{ uri: `${serverIP}/game2/video_feed` }}
          style={styles.cameraFeed}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onError={(error) => console.log("WebView error:", error)}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("HTTP error: ", nativeEvent);
          }}
        />
      </View>
      
      <View style={{alignItems: "center", marginTop: 20}}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 15 }}>혼자서 학습해보세요!</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>'안녕하세요'</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            completeLesson();
            navigation.pop(2);
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={{ fontSize: 25, color: "red" }}>정확도 80%</Text>
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
    fontSize: 22,
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
    width: '100%',
    height: 400,
    borderRadius: 15,
    overflow: "hidden",
    aspectRatio: 3 / 4,
  },
});
