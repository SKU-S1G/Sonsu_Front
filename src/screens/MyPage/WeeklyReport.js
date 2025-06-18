import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import { BarChart } from "react-native-gifted-charts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { getToken } from "../../../authStorage";
import { ScrollView } from "react-native-gesture-handler";

const WeeklyReport = () => {
  const [reportData, setReportData] = useState(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = await getToken();
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const response = await axios.get(`${API_URL}/mypage/report`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = response.data;
          setReportData(data);

          const dayMap = {
            Sunday: "일",
            Monday: "월",
            Tuesday: "화",
            Wednesday: "수",
            Thursday: "목",
            Friday: "금",
            Saturday: "토",
          };

          const fullWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          const chartData = fullWeek.map((day) => {
            const found = data.lessonCount.find((d) => d.day === day);
            return {
              label: dayMap[day],
              value: found ? found.lesson_count : 0,
            };
          });

          setBarData(chartData);
          break; // 성공했으므로 루프 종료
        } catch (error) {
          if (error.response?.status === 429) {
            const waitTime = Math.pow(2, retryCount) * 1000; // 1초, 2초, 4초
            console.warn(
              `Rate limit! 재시도 중... ${retryCount + 1}회 (대기: ${waitTime}ms)`
            );
            await new Promise((res) => setTimeout(res, waitTime));
            retryCount++;
          } else {
            console.error("리포트 데이터를 불러오는 중 오류 발생:", error);
            break; // 다른 오류는 반복하지 않음
          }
        }
      }
    };

    fetchReport();
  }, []);

  // const maxValue = Math.max(...data.map((item) => item.value));
  const maxValue = Math.max(...barData.map((item) => item.value), 0);

  return (
    <View>
      <Header />
      <BackGround />
      <View>
        {/* 주간 리포트, 한 주 간의 학습 상황을 분석합니다 */}
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            주간 리포트
          </Text>
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              color: "#333",
              marginBottom: "10%",
            }}
          >
            한 주 간의 학습 상황을 분석합니다
          </Text>
        </View>

        {/* 그래프 */}
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>요일별 학습 단어 수</Text>
            <View>
              <BarChart
                data={barData}
                barWidth={30}
                barBorderTopLeftRadius={20}
                barBorderTopRightRadius={20}
                isAnimated={true}
                height={100}
                width={300}
                frontColor="#FFE694"
                barRadius={5}
                hideRules={true}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor="#e6e6e6"
                xAxisLength="290"
                hideYAxisText={true}
                maxValue={maxValue}
                spacing={10}
                disableScroll={true}
              />
            </View>
          </View>

          <View style={styles.AlContainer}>
            <View style={styles.titleWrap}>
              <Text style={{ fontSize: 15 }}>AI가 대신 해주는</Text>
              <Text style={styles.AItitle}>이번주 학습 분석</Text>
            </View>
            <View
              style={{
                marginBottom: 460,
              }}
            >
              <Text style={styles.AItext}>
                {reportData
                  ? reportData.report
                  : "분석 데이터를 불러오는 중입니다..."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 20,
  },

  AlContainer: {
    marginTop: 40,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  titleWrap: {
    justifyContent: "space-between",
    marginLeft: 5,
    marginTop: 10,
  },
  AItitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  AItext: {
    backgroundColor: "white",
    width: "100%",
    // height: "100%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 15,
  },
});

export default WeeklyReport;
