import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { API_URL } from "../../../config";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import axios from "axios";
import GameModal from "../../components/GameModal";
import { getToken } from "../../../authStorage";

export default function OXGame() {
  const [quizzes, setQuizzes] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [animation, setAnimation] = useState(null);
  const [fontsLoaded] = useFonts(customFonts);
  const [modalVisible, setModalVisible] = useState(false);
  const [hearts, setHearts] = useState(5); // 하트 상태 추가

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });

  const navigation = useNavigation();

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const accessToken = await getToken();
        if (!accessToken) {
          console.log("토큰이 없습니다");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_URL}/quiz/generate`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
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
    const currentQuiz = quizzes[currentQuestion];
    const isCorrect = currentQuiz.check_answer === answer;

    if (!isCorrect) {
      setHearts((prev) => Math.max(prev - 1, 0));
    } else {
    }

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
      setModalVisible(true); // 이미 제출했음을 GameModal로 알리기
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = await getToken();
      if (!accessToken) {
        console.log("토큰이 없습니다");
        setLoading(false);
        return;
      }
      const res = await axios.post(
        `${API_URL}/quiz/check`,
        {
          sessionId: sessionId,
          answers: userAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("res", res);
      if (res.status === 200) {
        setQuizResult({
          score: res.data.score,
          total: res.data.total,
        });
        setModalVisible(true); // 채점 후 GameModal 띄우기
      }
    } catch (err) {
      console.error("퀴즈 제출 실패:", err);
      setModalVisible(true); // 오류 발생 시에도 GameModal 띄우기
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("quizResult", quizResult);

  useEffect(() => {
    console.log("userAnswer", userAnswers);
  }, [userAnswers]);

  return (
    <View>
      <SpeedBack heightMultiplier={1.8} />
      <View>
        <TouchableOpacity
          style={styles.speedTextContainer}
          onPress={() => navigation.goBack()}
        >
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
        </TouchableOpacity>

        <View style={styles.info}>
          <View>
            {/* 하트 표시 */}
            <Text style={{ fontSize: 33, marginVertical: 15 }}>
              {"❤️".repeat(hearts)}
              {"💔".repeat(5 - hearts)}
            </Text>
          </View>

          <View style={styles.videoContainer}>
            {animation && (
              <Video
                source={{ uri: animation }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                isLooping
                shouldPlay
              />
            )}
          </View>

          <Text
            style={{
              marginTop: 45,
              marginBottom: 45,
              fontSize: 37,
              fontWeight: 800,
            }}
          >
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
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.practiceButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`${quizResult.total}문제 중에 ${quizResult.score}문제 맞췄습니다!`}
        content={
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.Image}
          />
        }
        onOxPress={() => {
          setModalVisible(false); // 모달 닫기
          navigation.navigate("Review"); // Review 페이지로 이동
        }}
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
    fontSize: 43,
    fontFamily: "RixInooAriDuriRegular",
    color: "white",
    marginLeft: 30,
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  videoContainer: {
    width: "83%", // 원하는 비디오 너비
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
    fontSize: 73,
    textAlign: "center",
  },
  Image: {
    width: 95,
    height: 160,
  },
});
