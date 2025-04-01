import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import SpeedBack from "../../components/SpeedBack";
import { useNavigation } from "@react-navigation/native";

export default function OXGame() {
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
          <View>
            <Text style={{ fontSize: 32 }}>❤️❤️❤️❤️❤️</Text>
          </View>

          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.image}
          />
          <Text style={{ marginTop: 30, fontSize: 30, fontWeight: 800 }}>
            안녕하세요
          </Text>
        </View>

        <View style={styles.btnwrap}>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.practiceButtonText}>⭕️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.practiceButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 40,
    fontFamily: "RixInooAriDuriRegular",
    color: "white",
    marginLeft: 30,
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  image: {
    width: "50%",
    height: 240,
    resizeMode: "contain",
    marginTop: 20,
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
    marginTop: 150,
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
    fontSize: 70,
    textAlign: "center",
  },
});
