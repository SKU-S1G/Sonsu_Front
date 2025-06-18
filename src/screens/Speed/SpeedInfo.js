import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Header from "../../components/Header";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";

export default function SpeedInfo() {
  const [fontsLoaded] = useFonts(customFonts);
  const navigation = useNavigation();

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
                <Text style={styles.speedText}>스피드 게임</Text>
              </View>
            }
          >
            <LinearGradient
              colors={["#F26851", "#FFC0B6"]}
              start={{ x: 0, y: 0.8 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </MaskedView>
        </View>

        <View style={styles.info}>
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.image}
          />
          <View style={styles.infoText}>
            <Text style={{ fontSize: 16 }}>스피드 퀴즈를 위해</Text>
            <Text style={{ fontSize: 16 }}>카메라를 준비해 주세요 📷</Text>
          </View>
        </View>

        <View style={styles.importantView}>
          <Text style={styles.importantTitle}>❗️주의사항❗️</Text>

          <Text style={styles.importantText}>☝🏻 정확도가 80% 이상일 때</Text>
          <Text style={styles.importantText2}>
            자동으로 다음 단어로 넘어가요
          </Text>

          <Text style={styles.importantText}>
            ✌🏻 배경이 너무 밝거나 어두우면
          </Text>
          <Text style={styles.importantText2}>인식이 잘 안 될 수 있어요</Text>
        </View>

        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => navigation.navigate("SpeedGame")}
        >
          <Text style={styles.practiceButtonText}>시작하기</Text>
        </TouchableOpacity>
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
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  image: {
    width: "30%",
    height: 170,
    resizeMode: "contain",
  },
  infoText: {
    marginLeft: 20,
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
    marginTop: 50,
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
  practiceButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
