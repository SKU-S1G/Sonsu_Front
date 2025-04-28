import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import InfoModal from "../../components/InfoModal";

const userRank = [
  { rank: 1, name: "김정이", nickname: "교수님", progress: 90 },
  { rank: 2, name: "이호연", nickname: "성결대", progress: 76 },
  { rank: 3, name: "최유정", nickname: "성결대", progress: 68 },
  { rank: 24, name: "사용자", nickname: "@@@", progress: 43 },
  // 다른 사용자 데이터를 추가
];

const WeeklyRanking = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.rankContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "20",
        }}
      >
        <Text style={styles.title}>주간 랭킹</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="alert-circle" size={21} color="#666666" />
        </TouchableOpacity>
      </View>
      {userRank.map((user, index) => (
        <View key={index} style={styles.rankWrap}>
          <View
            style={{
              flexDirection: "row",
              width: "50%",
              alignItems: "baseline",
            }}
          >
            <Text
              style={[
                styles.userRank,
                { color: user.rank === 1 ? "#FFCA1A" : "#000" },
              ]}
            >
              {user.rank}
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginRight: 4,
                fontWeight: 500,
              }}
            >
              {user.name}
            </Text>
            <Text style={{ fontSize: 11 }}>{user.nickname}</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.barBackground}>
              <View
                style={[styles.progress, { width: `${user.progress}%` }]}
              ></View>
              {/* 사용자의 진행도에 따라 바의 너비를 설정 */}
            </View>
          </View>
        </View>
      ))}
      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="주간랭킹"
        content={
          "사용자의 학습 점수를 통해 랭킹을 결정합니다.\n점수를 높여 더 좋은 랭킹을 달성하세요!"
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rankContainer: {
    width: "100%",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    // marginTop: "20",
    marginBottom: "10",
    marginLeft: "-5",
  },

  rankWrap: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1, // 하단 선 두께
    borderBottomColor: "#ccc", // 하단 선 색상
  },
  userRank: {
    fontSize: 25,
    marginRight: 10,
    fontWeight: 700,
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 3.5, // 그림자 반경
    elevation: 5, // 안드로이드에서 그림자 효과 적용
  },
  progressContainer: {
    marginTop: 10,
    width: "100%",
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 3.5, // 그림자 반경
    elevation: 5, // 안드로이드에서 그림자 효과 적용
  },
  barBackground: {
    width: "50%", // 바의 너비
    height: 10,
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#FFCA1A", // 진행도를 나타내는 색상
    borderRadius: 5,
  },
});

export default WeeklyRanking;
