import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const LogoBg = () => {
  const { width, height } = Dimensions.get("window");

  return (
    <View style={[styles.container, { width, height }]}>
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
    zIndex: -10,
  },
  LogoBg: {
    resizeMode: "contain",
    opacity: 0.15,
  },
});

export default LogoBg;
