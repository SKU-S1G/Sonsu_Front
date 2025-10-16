import React, { useRef } from "react";
import { Audio } from "expo-av";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ReviewComponent from "../../components/ReviewComponent";
import tailwind from "tailwind-rn";

export default function Review() {
  const soundRef = useRef(null);

  const playClickSound = async () => {
    try {
      // 기존 소리 unload
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/Sounds/Click.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("사운드 재생 오류:", error);
    }
  };
  const navigation = useNavigation();

  return (
    <ScrollView style={[tailwind("flex-1"), { backgroundColor: "#f5f5f5" }]}>
      <Header color="#FFE694" />

      {/* 복습하기 */}
      <View
        style={tailwind("flex-row justify-between items-center mt-2 mx-10")}
      >
        <Text style={tailwind("text-2xl font-semibold")}>복습하기</Text>
      </View>

      {/* 스피드 게임 */}
      <TouchableOpacity
        style={[
          tailwind("flex-row justify-center items-center bg-red-300 mt-5 mb-5"),
          styles.gameBox,
        ]}
        onPress={() => {
          playClickSound();
          navigation.navigate("SpeedInfo");
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.imageSmall}
          />
        </View>

        <View style={styles.textContainer}>
          <Image
            source={require("../../../assets/images/SpeedGame.png")}
            style={styles.imageTitle}
          />

          <Text
            style={[
              tailwind("text-center mt-2"),
              { color: "#2d3748", fontSize: 11 },
            ]}
          >
            실시간 게임으로 빠르게 수어 복습!
          </Text>
        </View>
      </TouchableOpacity>

      {/* OX 퀴즈 */}
      <TouchableOpacity
        style={[
          tailwind("flex-row justify-center items-center bg-blue-200"),
          styles.gameBox,
          styles.shadowReverse,
        ]}
        onPress={() => {
          playClickSound();
          navigation.navigate("OXInfo");
        }}
      >
        <View style={styles.textContainer}>
          <Image
            source={require("../../../assets/images/OXQuiz.png")}
            style={styles.imageTitle}
          />

          <Text
            style={[
              tailwind("text-center mt-2"),
              { color: "#2d3748", fontSize: 11 },
            ]}
          >
            간단하고 재미있게 수어 복습!
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.imageSmall}
          />
        </View>
      </TouchableOpacity>

      {/* 오답 수어 다시보기 */}
      <View
        style={tailwind(
          "flex-row justify-between items-center mt-12 mb-2 mx-10"
        )}
      >
        <Text style={tailwind("text-xl font-semibold")}>
          오답 수어 다시보기
        </Text>

        <TouchableOpacity
          onPress={() => {
            playClickSound();
            navigation.navigate("ReviewIncorrectSigns");
          }}
        >
          <FontAwesome6 name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={tailwind("text-xl font-semibold mr-6 ml-6")}>
        {/* 오답수어 컨텐츠 */}
        <ReviewComponent />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gameBox: {
    width: "85%",
    height: 160,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 5 },
    alignSelf: "center",
    // justifyContent: "space-around",
  },
  shadowReverse: {
    shadowOffset: { width: -5, height: 2 },
  },
  imageContainer: {
    width: "auto",
    marginVertical: 10,
  },
  textContainer: {
    width: "auto",
    alignItems: "center",
  },
  imageSmall: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  imageTitle: {
    width: 150,
    height: 30,
    resizeMode: "contain",
  },
});
