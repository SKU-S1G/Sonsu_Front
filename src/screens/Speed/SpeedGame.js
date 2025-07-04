import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Header from '../../components/Header';
import BackGround from '../../components/BackGround';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import { serverIP } from "../../../config";
import GameModal from '../../components/GameModal';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SpeedGame() {
  const [fontsLoaded] = useFonts(customFonts);
  const [modalVisible, setModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [time, setTime] = useState(20);
  const [questionIndex, setQuestionIndex] = useState(1); // 문제 번호 관리
  const navigation = useNavigation();

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (time === 0) {
      if (questionIndex >= 5) {
        setModalVisible(true); // 타임오버로도 게임 종료
      } else {
        fetchQuestion();
        setTime(20);
        setGameResult('');
        setQuestionIndex(prev => prev + 1);
      }
      return;
    }

    const timerId = setTimeout(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [time]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${serverIP}/game1/get_question`);
      setQuestion(response.data.question);
      setGameResult('');
    } catch (error) {
      console.error('단어를 불러오는 중 오류 발생:', error);
    }
  };

  const fetchGameInfo = async () => {
    try {
      const response = await axios.get(`${serverIP}/game1/get_game_info`);
      const { game_result } = response.data;

      if (game_result && game_result !== gameResult) {
        setGameResult(game_result);

        if (game_result === "정답입니다!") {
          setModalVisible(true); // 정답 팝업
        }
      }
    } catch (error) {
      console.error('게임 정보 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameResult]);

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
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <View style={styles.indexView}>
          <Text style={styles.indexText1}>{questionIndex}</Text>
          <Text style={styles.indexText2}>/5</Text>
        </View>
      </View>

      {gameResult !== '' && (
        <Text style={styles.correctText}>{gameResult}</Text>
      )}

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
        title={questionIndex >= 5 ? "게임이 종료되었습니다!" : "정답입니다!"}
        content={<Image source={require("../../../assets/images/sonsuModel.png")} style={styles.Image} />}
        onOxPress={() => {
          setModalVisible(false);

          if (questionIndex >= 5) {
            navigation.navigate('Review');
          } else {
            fetchQuestion();
            setTime(20);
            setGameResult('');
            setQuestionIndex(prev => prev + 1);
          }
        }}
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
