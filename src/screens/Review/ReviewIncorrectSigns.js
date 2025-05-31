import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { getToken } from "../../../authStorage";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";

const ReviewIncorrectSigns = () => {
  const [groupedByWeek, setGroupedByWeek] = useState({});
  const navigation = useNavigation();

  const renderPreviewWords = (week) => {
    const signs = groupedByWeek[week] || [];
    if (signs.length === 0) {
      return "오답 수어가 없습니다.";
    }

    const uniqueWords = [...new Set(signs.map((s) => s.word))];
    const preview = uniqueWords.slice(0, 3).join(", ");
    return preview + (uniqueWords.length > 3 ? "..." : "");
  };

  const getPreviewVideos = (week) => {
    const signs = groupedByWeek[week] || [];
    const seen = new Set();
    const uniqueVideos = [];

    for (let s of signs) {
      if (!seen.has(s.word) && s.animation_path) {
        seen.add(s.word);
        uniqueVideos.push(s.animation_path);
      }
      if (uniqueVideos.length >= 3) break;
    }

    return uniqueVideos;
  };

  useEffect(() => {
    const fetchWrongSigns = async () => {
      try {
        const accessToken = await getToken();
        const res = await fetch(`${API_URL}/quiz/wrong`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await res.json();
        console.log(json);

        if (json.success) {
          const grouped = groupByWeek(json.data);
          setGroupedByWeek(grouped);
        }
      } catch (err) {
        Alert.alert("에러", "오답 데이터를 불러오는 중 문제가 발생했습니다.");
        console.error(err);
      }
    };

    fetchWrongSigns();
  }, []);

  const groupByWeek = (data) => {
    const grouped = {};

    // 현재 날짜 기준으로 해당 월 가져오기
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0부터 시작

    // 해당 월 1일 요일 확인
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayWeekday = firstDay.getDay(); // 일:0, 월:1, ... 토:6

    // 주차 범위 계산
    const weeks = []; // 각 주의 [startDate, endDate]
    let start = 1;
    let end = 7 - firstDayWeekday;

    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate(); // 해당 월의 마지막 날짜

    while (start <= lastDate) {
      weeks.push([start, Math.min(end, lastDate)]);
      start = end + 1;
      end += 7;
    }

    // 주차별 초기화
    weeks.forEach((_, idx) => {
      grouped[idx + 1] = [];
    });

    // 데이터 주차별로 분류
    data.forEach((item) => {
      const recordedDate = new Date(item.recorded_at);
      if (
        recordedDate.getFullYear() === currentYear &&
        recordedDate.getMonth() === currentMonth
      ) {
        const date = recordedDate.getDate();
        for (let i = 0; i < weeks.length; i++) {
          const [start, end] = weeks[i];
          if (date >= start && date <= end) {
            grouped[i + 1].push(item);
            break;
          }
        }
      }
    });

    return grouped;
  };

  const goToWeekDetail = (week) => {
    const weekData = groupedByWeek[week] || [];
    navigation.navigate("ReviewIncorrectSignsDetail", {
      week,
      signs: weekData,
    });
  };

  return (
    <View>
      <Header />
      <BackGround />
      <Text style={styles.title}>오답 수어 다시보기</Text>
      <Text style={styles.subtitle}>주차를 선택해 틀린 수어를 확인하세요</Text>

      <ScrollView>
        <View style={styles.buttonContainer}>
          {[1, 2, 3, 4, 5].map((week) => (
            <TouchableOpacity
              key={week}
              style={styles.weekButton}
              onPress={() => goToWeekDetail(week)}
            >
              <Text style={styles.weekButtonText}>{week}주차</Text>
              <Text style={styles.previewText}>{renderPreviewWords(week)}</Text>

              <View style={styles.previewVideoContainer}>
                {getPreviewVideos(week).length > 0 ? (
                  getPreviewVideos(week).map((uri, i) => (
                    <Video
                      key={i}
                      source={{ uri }}
                      style={styles.previewVideo}
                      resizeMode="cover"
                      isMuted
                      shouldPlay
                      isLooping
                    />
                  ))
                ) : (
                  // 공간 확보용 빈 박스 2개
                  <>
                    <View style={styles.previewVideo} />
                    <View style={styles.previewVideo} />
                    <View style={styles.previewVideo} />
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginBottom: 25,
  },
  buttonContainer: {
    flexWrap: "wrap",
    alignContent: "center",
    paddingHorizontal: 20,
    marginBottom: 230,
  },
  weekButton: {
    width: "90%",
    height: 170,
    backgroundColor: "#F2F0E4",
    paddingVertical: 14,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  weekButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  previewText: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  previewVideoContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    justifyContent: "center",
  },

  previewVideo: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
});

export default ReviewIncorrectSigns;
