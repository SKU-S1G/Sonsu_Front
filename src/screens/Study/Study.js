import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpeedBack from "../../components/SpeedBack";
import { WebView } from "react-native-webview";

export default function Study() {
  const route = useRoute();
  const { topic, lesson } = route.params;
  const navigation = useNavigation();

  // const serverIP = "http://192.168.45.121:5001";
  const serverIP = "http://192.168.10.20:5001";

  return (
    <SafeAreaView style={styles.container}>
      <SpeedBack heightMultiplier={1.88} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.screenContainer}>
          <Text style={styles.title}>
            {"Step "}
            {lesson.id}. {topic}
          </Text>
        </View>
      </TouchableOpacity>

      <Image
        source={require("../../../assets/images/sonsuModel.png")}
        style={styles.image}
      />

      <View style={styles.desContainer}>
        <Text style={styles.describe}>
          1. 오른 손바닥으로 왼 팔등을 스쳐내리세요.
        </Text>
        <Text style={styles.describe}>
          2. 두 주먹을 쥐고 바닥이 아래로 향하게 하여 가슴 앞에서 아래로 내려요
        </Text>
      </View>

      {/* 카메라 비디오 스트리밍 WebView or iframe */}
      <View style={styles.cameraFeedWrapper}>
        {Platform.OS === "web" ? (
          <iframe
            src={`${serverIP}/video_feed`}
            style={styles.cameraFeed}
            width="100%"
            height="100%"
            allowFullScreen
          />
        ) : (
          <WebView
            source={{ uri: `${serverIP}/video_feed` }}
            style={styles.cameraFeed}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={["*"]}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true} // 추가된 속성
            mediaPlaybackRequiresUserAction={false} // 추가된 속성
            onError={(error) => console.log("WebView error:", error)}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log("HTTP error: ", nativeEvent);
            }}
          />
        )}
      </View>

      {/* 혼자 해보기 버튼 */}
      <TouchableOpacity
        style={styles.practiceButton}
        onPress={() => navigation.navigate("StudyOnly", { topic, lesson })}
      >
        <Text style={styles.practiceButtonText}>혼자 해보기{"  ->"}</Text>
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
  screenContainer: {
    flex: 1,
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
  image: {
    width: "40%",
    height: "35%",
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
