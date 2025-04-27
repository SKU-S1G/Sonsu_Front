import { StyleSheet, View, Text } from "react-native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import { BarChart } from "react-native-gifted-charts";

const WeeklyReport = () => {
  const data = [
    { value: 2, label: "일" },
    { value: 6, label: "월" },
    { value: 4, label: "화" },
    { value: 7, label: "수" },
    { value: 7, label: "목" },
    { value: 0, label: "금" },
    { value: 2, label: "토" },
  ];

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <View>
      <Header />
      <BackGround />
      <View>
        {/* 주간 리포트, 한 주 간의 학습 상황을 분석합니다 */}
        <View>
          <Text style={{ fontSize: 30, fontWeight:"bold", textAlign: "center", marginBottom: 5 }}>
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
        <View style={styles.container}>
          <Text style={styles.title}>요일별 학습 단어 수</Text>
          <View>
            <BarChart
              data={data}
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
              maxValue={maxValue} // Y축의 최대값을 데이터의 최대값으로 설정
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
          <View style={styles.AItext}>
            <Text>어쩌구저쩌구</Text>
          </View>
        </View>
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
    height: "50%",
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
