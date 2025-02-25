import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpeedBack from '../../components/SpeedBack';
import { WebView } from 'react-native-webview'; // WebView import 추가

export default function StudyOnly() {
  const route = useRoute();
  const { topic, lesson } = route.params;
  const navigation = useNavigation();

  // const serverIP = "http://192.168.45.121:5001";
  const serverIP = "http://192.168.10.20:5001";

  return (
    <SafeAreaView style={styles.container}>
      <SpeedBack />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.screenContainer}>
          <Image
            source={require("../../../assets/images/SonsuLogo.png")}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.title}>
            {"Step "}
            {lesson.id}. {topic}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.desContainer}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>혼자해보기</Text>
      </View>

      {/* 카메라 비디오 스트리밍 WebView */}
      <View style={styles.cameraFeedWrapper}>
        <WebView
          source={{ uri: `${serverIP}/video_feed` }}
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

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 15,  }}>
          혼자서 학습해보세요!
        </Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
          '안녕하세요'
        </Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 25, color: 'red' }}>
          정확도 80%
        </Text>
      </View>
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
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
  },
  desContainer: {
    marginTop: 30,
    width: 350,
  },
  backButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraFeedWrapper: {
    width: '100%',
    height: 430,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    aspectRatio: 16 / 9,
  },
  cameraFeed: {
    flex: 1,
    backgroundColor: "transparent",
  },
});