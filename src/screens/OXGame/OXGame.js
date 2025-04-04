import React, {useState, useEffect} from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { API_URL } from "../../../config";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import axios from "axios";
import GameModal from "../../components/GameModal";

export default function OXGame () {
  const [quizzes, setQuizzes] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [animation, setAnimation] = useState(null);
  const [fontsLoaded] = useFonts(customFonts);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
  
  const navigation = useNavigation();

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${API_URL}/quiz/generate`);
        setQuizzes(res.data.quizzes);
        setSessionId(res.data.sessionId);
        setUserAnswers(new Array(res.data.quizzes.length).fill(null));
        setAnimation(res.data.quizzes[0]?.animation_path || null);
      } catch (err) {
        console.error("퀴즈 불러오기 실패:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = {
      quiz_id: quizzes[currentQuestion].quiz_id,
      answer: answer,
    };
    setUserAnswers(updatedAnswers);

    // 다음 문제로 이동 (마지막 문제라면 이동 없이 대기)
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnimation(quizzes[currentQuestion + 1].animation_path);
    }
  };

  useEffect(() => {
    if (userAnswers.every((ans) => ans !== null) && quizzes.length > 0) {
      submitQuiz();
    }
  }, [userAnswers]);

  const submitQuiz = async () => {
    if (isSubmitting) {
      Alert.alert("이미 제출하셨습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/quiz/check`, {
        sessionId: sessionId,
        answers: userAnswers,
      });
      console.log(res.data);
      if (res.status === 200) {
        Alert.alert("채점 결과", `점수: ${res.data.score} / ${res.data.total}`);
        navigation.navigate("Main");
      }
    } catch (err) {
      console.error("퀴즈 제출 실패:", err);
      Alert.alert("오류", "퀴즈 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log(userAnswers);
  }, [userAnswers]);

  return (
    <View>
      <SpeedBack heightMultiplier={1.8} />
      <View>
        <View style={styles.speedTextContainer}>
          <MaskedView
            style={styles.maskedView}
            maskElement={
              <View>
                <Text style={styles.speedText}>OX 퀴즈</Text>
              </View>
            }
          >
            <LinearGradient
              colors={["#4495C0", "#F2F2F2"]}
              start={{ x: 0, y: 0.8 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </MaskedView>
        </View>

        <View style={styles.info}>
          <View>
            <Text style={{ fontSize: 32 }}>❤️❤️❤️❤️❤️</Text>
          </View>

        {animation && (
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: animation }}
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        )}

          <Text style={{ marginTop: 30, fontSize: 30, fontWeight: 800 }}>
            {quizzes[currentQuestion]?.question}
          </Text>
        </View>

        <View style={styles.btnwrap}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.practiceButtonText}>⭕️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.btn}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.practiceButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`${quizResult.total}문제 중에 ${quizResult.score}문제 맞췄습니다!`}
        content={<Image source={require("../../../assets/images/sonsuModel.png")} style={styles.Image} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  speedTextContainer: {
    marginTop: 110,
    marginLeft: 10,
  },
  maskedView: {
    height: 40,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  speedText: {
    fontSize: 40,
    fontFamily: "RixInooAriDuriRegular",
    color: "white",
    marginLeft: 30,
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  image: {
    width: "50%",
    height: 240,
    resizeMode: "contain",
    marginTop: 20,
  },
  importantView: {
    backgroundColor: "#FFFFFF",
    width: "70%",
    height: "fit-content",
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 50,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 5 },
  },
  importantTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  importantText: {
    fontSize: 15,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  importantText2: {
    fontSize: 15,
    width: "90%",
    alignSelf: "center",
    marginLeft: 50,
  },
  practiceButton: {
    width: "60%",
    marginTop: 150,
    alignSelf: "center",
    backgroundColor: "#FFE694",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  btnwrap: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
  },
  btn: {
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  practiceButtonText: {
    fontSize: 70,
    textAlign: "center",
  },
  videoContainer: {
    width: "80%", // 원하는 비디오 너비
    aspectRatio: 16 / 9, // 16:9 비율로 설정
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 30,
  },  
  video: {
    width: "100%",
    height: "100%",
  },
  Image: {
    width: 95,
    height: 160,
  },
});