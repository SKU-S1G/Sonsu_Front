import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Header from "../../components/Header";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";

export default function OXInfo() {
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
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.image}
          />
          <View style={styles.infoText}>
            <Text style={{ fontSize: 16 }}>캐릭터의 수어를 보고</Text>
            <Text style={{ fontSize: 16 }}>정답을 맞춰보세요!!</Text>
          </View>
        </View>

        <View style={styles.importantView}>
          <Text style={styles.importantTitle}>🎯게임 방법🎮</Text>
          <Text style={styles.importantText}>✅ 해당 수어가 정답이라면 O,</Text>
          <Text style={styles.importantText2}>오답이라면 X를 누르세요</Text>
          <Text style={styles.importantText}>✅ 해당 수어가 정답이라면 O,</Text>
          <Text style={styles.importantText2}>오답이라면 X를 누르세요</Text>
        </View>

        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => navigation.navigate("OXGame")}
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
    // marginTop: 50,
    marginRight: 30,
  },
  infoText: {
    marginBottom: 20,
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
