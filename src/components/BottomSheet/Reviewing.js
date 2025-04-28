import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import { customFonts } from "../../../src/constants/fonts";
import ShortcutButton from "../ShortcutButton";
import { useNavigation } from '@react-navigation/native';


const Reviewing = () => {
  const [fontsLoaded] = useFonts(customFonts);
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Review")}>
      <Text style={styles.title}>복습하기</Text>
      <View style={styles.btnContainer}>
        <View style={styles.learnBtn}>
          {/* 이미지 */}
          <Image
            style={styles.image}
            source={require("../../../assets/images/sonsuModel.png")}
          />
          {/* 복습하기 텍스트 */}
          <View style={styles.TextContainer}>
            <Image
              style={styles.fontImage}
              source={require("../../../assets/images/Reviewing.png")}
            />
            <Text style={styles.learnSubBtnText}>O/X 퀴즈, 스피드 게임</Text>
            {/* 바로가기 아이콘 */}
          </View>
          <ShortcutButton style={styles.shortcutButton} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  learnBtn: {
    backgroundColor: "#F7D4D4",
    padding: 10,
    borderRadius: 10,
    width: "100%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "space-around",

    flexDirection: "row", // 가로 배치
  },
  image: {
    width: 45,
    height: 71,
    resizeMode: "contain",
  },
  TextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  fontImage: {
    resizeMode: "contain",
    marginBottom: 3,
  },
  learnSubBtnText: {
    color: "#6F6C6C",
    fontSize: 10,
    fontWeight: "600",
  },
  shortcutButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Reviewing;
