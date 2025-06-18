import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const SpeedBack = ({ heightMultiplier = 1 }) => { // 기본값 1 추가

  const height = Math.min(width * heightMultiplier, 720); // 최대 높이 제한

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { height }]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: -1,
  },
  circle: {
    width: width,
    backgroundColor: "#FFE694",
    borderRadius: width / 2.5,
  },
});

export default SpeedBack;
