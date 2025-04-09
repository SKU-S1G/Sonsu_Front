import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Header from '../../components/Header';
import BackGround from '../../components/BackGround';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview"; // WebView import 추가
import { serverIP } from "../../../config";
import GameModal from '../../components/GameModal';

export default function SpeedGame() {
  const [fontsLoaded] = useFonts(customFonts);
  const [modalVisible, setModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  useEffect(() => {
    fetch(`${serverIP}/game2/get_question`)
      .then(response => response.json())
      .then(data => {
        setQuestion(data.question);
      })
      .catch(error => {
        console.log("Error fetching question:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${serverIP}/game2/get_game_info`)
      .then(response => response.json())
      .then(data => {
        setResult(data.question);  // 받아온 문제를 상태에 저장
      })
      .catch(error => {
        console.log("Error fetching question:", error);
      });
  }, []);

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <View>
      <Header color="#FFFFFF" />
      <BackGround heightMultiplier={1.15} />

      <View>
        <View style={styles.speedTextContainer}>
          <MaskedView
            style={styles.maskedView}
            maskElement={
              <View>
                <Text style={styles.speedText}>스피드 게임</Text>
              </View>
            }
          >
            <LinearGradient
              colors={['#F26851', '#FFC0B6']}
              start={{ x: 0, y: 0.8 }} 
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </MaskedView>
        </View>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.signView}>
        <Text style={styles.signText1}>단어</Text>
        <Text style={styles.signText2}>{question}</Text>
      </TouchableOpacity>

      <View style={styles.showContainer}>
        <View style={styles.timeView}>
          <Icon name="clock-time-four-outline" size={35} color="#000" />
          <Text style={styles.timeText}>10</Text>
        </View>

        <View style={styles.indexView}>
          <Text style={styles.indexText1}>{result}</Text>
          <Text style={styles.indexText2}>/5</Text>
        </View>
      </View>

      <View>
        <Text style={styles.correctText}>정확도 n%</Text>
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

      <GameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="모든 문제를 다 풀었습니다."
        content={<Image source={require("../../../assets/images/sonsuModel.png")} style={styles.Image} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  speedTextContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  maskedView: {
    height: 30,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  speedText: {
    fontSize: 30,
    fontFamily: 'RixInooAriDuriRegular',
    color: 'white',
    marginLeft: 30,
  },
  signView: {
    alignSelf: 'center',
    marginTop: 25
  },
  signText1: {
    fontSize: 17,
  },
  signText2: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  showContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center', 
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'RixInooAriDuriRegular',
    fontSize: 25,
    marginLeft: 10,
  },
  indexView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#39B360',
  },
  indexText2: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  correctText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 5,
  },
  cameraFeedWrapper: {
    alignSelf: 'center',
    width: "100%",
    height: 450,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 50,
    aspectRatio: 12 / 16,
  },
  cameraFeed: {
    flex: 1,
    backgroundColor: "transparent",
  },
  Image: {
    width: 95,
    height: 160,
  },
});
