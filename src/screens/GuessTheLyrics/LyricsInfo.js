import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Header from "../../components/Header";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";

export default function LyricsInfo() {
  const [fontsLoaded] = useFonts(customFonts);
  const navigation = useNavigation();

  const lyricsData = [
    {
      level: "초급",
      backgroundColor: "#C7DACD",
      title: "💖사랑(LOVE)",
      lyrics: [
        "안녕하세요, 사랑합니다",
        "괜찮아요, 너와 나",
        "우리 함께, 사랑해요",
      ],
    },
    {
      level: "중급",
      backgroundColor: "#CBD3DF",
      title: "👪가족(FAMILY)",
      lyrics: ["엄마 아빠 동생과", "우리 집은 웃음꽃", "너와 나, 가족이야"],
    },
    {
      level: "고급",
      backgroundColor: "#E9D0CC",
      title: "⏰시간(TIME)",
      lyrics: [
        "어제, 오늘 그리고 내일",
        "모레 또 그제까지",
        "일 년, 한 달, 하루",
      ],
    },
  ];

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Header color="#FFFFFF" />
      <SpeedBack heightMultiplier={1.8} />

      <View>
        <View style={styles.speedTextContainer}>
          <MaskedView
            style={styles.maskedView}
            maskElement={
              <View>
                <Text style={styles.speedText}>가사 맞추기</Text>
              </View>
            }
          >
            <LinearGradient
              colors={["#FF8001", "#FEBF7B"]}
              start={{ x: 0, y: 0.8 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </MaskedView>
        </View>

        <ScrollView>
          {lyricsData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.box1,
                {
                  backgroundColor: item.backgroundColor,
                  marginBottom: index === lyricsData.length - 1 ? 30 : 0, // 마지막만 marginBottom
                },
              ]}
            >
              <Text style={styles.TitleText}>{item.title}</Text>
              <View style={{ alignSelf: "center", marginVertical: 20 }}>
                {item.lyrics.map((line, i) => (
                  <Text key={i}>{line}</Text>
                ))}
              </View>
              <TouchableOpacity style={styles.practiceButton}>
                <Text style={styles.practiceButtonText}>시작하기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speedTextContainer: {
    marginTop: 10,
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
  box1: {
    marginTop: "8%",
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#C7DACD",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  practiceButton: {
    width: "63%",
    alignSelf: "center",
    backgroundColor: "#F1F1F1",
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  practiceButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  TitleText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
