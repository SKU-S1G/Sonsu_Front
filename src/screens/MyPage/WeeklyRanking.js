import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import InfoModal from "../../components/InfoModal";
import axios from "axios";
import { API_URL } from "../../../config";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const WeeklyRanking = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userRankData, setUserRankData] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
      const fetchRanking = async () => {
        try {
          const response = await axios.get(`${API_URL}/mypage/ranking`);
          const data = response.data;

          console.log("유저데이터", data);

          // 가장 높은 포인트
          const maxPoints = Math.max(...data.map(user => user.week_points));

          const top3 = data.slice(0, 3).map((user, index) => ({
            rank: index + 1,
            name: user.username,
            nickname: "",
            progress: user.week_points,
            progressRate: (user.week_points / maxPoints) * 100, // 비율 추가
          }));

          const currentUser = data[data.length - 1];
          const user = {
            rank: data.length,
            name: currentUser.username,
            nickname: "",
            progress: currentUser.week_points,
            progressRate: (currentUser.week_points / maxPoints) * 100, // 비율 추가
            isCurrentUser: true,
          };

          const isUserInTop3 = top3.some((u) => u.name === currentUser.username);

          if (isUserInTop3) {
            const updatedTop3 = top3.map((u) =>
              u.name === currentUser.username ? { ...u, isCurrentUser: true } : u
            );
            setUserRankData(updatedTop3);
          } else {
            setUserRankData([...top3, user]);
          }
        } catch (error) {
          console.error("랭킹 데이터를 불러오는 데 실패했습니다:", error);
        }
      };

      fetchRanking();
    }, [])
  );

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
      {userRankData.map((user, index) => (
        <View
          key={index}
          style={[
            styles.rankWrap,
            user.isCurrentUser && styles.currentUserHighlight,
          ]}
        >
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
            <Text style={{ fontSize: 10 }}>{user.progress}점</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.barBackground}>
              <View
                style={[styles.progress, { width: `${user.progressRate}%` }]} // 수정된 부분
              ></View>
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
  currentUserHighlight: {
    // borderBottomColor: "#FFCF00",
    // borderBottomWidth: 1,
    // borderTopColor: "#FFCF00",
    // borderTopWidth: 1,
  },
});

export default WeeklyRanking;
