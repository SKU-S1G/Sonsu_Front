import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ScrollView } from "react-native-gesture-handler";
import WeeklyRanking from "./WeeklyRanking";
import ReviewComponent from "../../components/ReviewComponent";
import tailwind from "tailwind-rn";
import AntDesign from "@expo/vector-icons/AntDesign";

const MyPage = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("로그아웃 처리(해야댐)") },
    ]);
  };

  return (
    <View>
      <Header color="#fff" showLogout={true} onLogout={handleLogout} />
      <BackGround />
      {/* 사용자 프로필 */}
      <View style={styles.Profile}>
        {/* 프로필 이미지 */}
        <View>
          <Image
            source={require("../../../assets/images/sonsuModel.png")}
            style={styles.image}
          />
        </View>
        {/* 오른쪽 .. */}
        <View style={styles.profileContent}>
          <View style={styles.nameContent}>
            <Text style={{ fontSize: 28, fontWeight: "600" }}>OOO</Text>
            <Image
              source={require("../../../assets/images/ProfileEdit.png")}
              style={styles.ProfileEdit}
            />
          </View>
          {/* 랭킹 */}
          <View>
            <Text style={{ fontSize: 12 }}>상위 20%</Text>
          </View>
          {/* 학습 알림 설정 */}
          <TouchableOpacity style={styles.NotificationBtn}>
            <Image
              source={require("../../../assets/images/Bell.png")}
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ color: "#000", fontSize: 10, textAlign: "center" }}>
              학습 알림 설정
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 탭 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 30,
          marginTop: 25,
        }}
      >
        {/* 출석체크 */}
        <TouchableOpacity
          style={styles.tabContent}
          onPress={() => navigation.navigate("AttendanceCheck")}
        >
          <Text style={{ fontSize: 12 }}>출석체크</Text>
          <FontAwesome6
            name="calendar-check"
            size={24}
            color="black"
            style={{ marginTop: 3 }}
          />
        </TouchableOpacity>
        {/* 수어 다시보기 */}
        <TouchableOpacity
          style={styles.tabContent}
          onPress={() => navigation.navigate("SignReview")}
        >
          <Text style={{ fontSize: 12 }}>즐겨찾기</Text>
          <FontAwesome5
            name="bookmark"
            size={24}
            color="black"
            style={{ marginTop: 3 }}
          />
        </TouchableOpacity>
        {/* 주간 리포트 */}
        <TouchableOpacity
          style={styles.tabContent}
          onPress={() => navigation.navigate("WeeklyReport")}
        >
          <Text style={{ fontSize: 12 }}>주간 리포트</Text>
          <SimpleLineIcons
            name="docs"
            size={24}
            color="black"
            style={{ marginTop: 3 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentWrap}>
        <WeeklyRanking />
        <View
          style={tailwind("flex-row justify-between items-center mt-6 mb-2 ")}
        >
          <Text style={tailwind("text-lg font-semibold")}>
            오답 수어 다시보기
          </Text>
          <AntDesign name="arrowright" size={24} color="black" />
        </View>

        {/* 오답수어 컨텐츠 */}
        <ReviewComponent />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Profile: {
    flexDirection: "row",
    paddingLeft: "11%",
    paddingTop: "2%",
  },
  profileContent: {
    justifyContent: "space-evenly",
    marginLeft: 15,
  },
  nameContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100, // 크기 증가
    height: 100, // height 추가
    resizeMode: "contain",
    backgroundColor: "white",
    borderRadius: "50%",
  },
  ProfileEdit: {
    width: 11,
    height: 11,
    resizeMode: "contain",
    marginTop: 5,
    marginLeft: 8,
  },
  NotificationBtn: {
    backgroundColor: "#FFE9DC",
    borderRadius: 10,
    height: 32,
    flexDirection: "row",
    alignItems: "center",

    marginTop: 6,
    paddingHorizontal: 20,
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  contentWrap: {
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 400,
  },
  tabContent: {
    width: 72,
    height: 72,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 1 }, // 그림자 오프셋
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 3.5, // 그림자 반경
    elevation: 5, // 안드로이드에서 그림자 효과 적용
  },
  chartContainer: {
    marginTop: 20,
  },
});

export default MyPage;
