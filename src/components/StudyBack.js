import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const StudyBack = () => {
  const { width, height } = Dimensions.get("window");

  return (
    <View style={[styles.container, { width, height }]}>
      <LinearGradient
        colors={["#FFE694", "#f5f5f5"]}
        style={[styles.gradient, { width, height }]}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 0.4 }}
      />
      <Image
        source={require("../../assets/images/SonsuLogo.png")}
        style={[styles.LogoBg, { width: width * 0.5, height: height * 0.5 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  LogoBg: {
    resizeMode: "contain",
    opacity: 0.15,
  },
});

export default StudyBack;
