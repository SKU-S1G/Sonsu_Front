import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Header = ({ color, showLogout, onLogout }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color={color} style={styles.icon} />
      </TouchableOpacity>

      {/* 로그아웃 버튼 */}
      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <MaterialIcons name="logout" size={28} color={color} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between", // 뒤로가기 버튼과 로그아웃 버튼을 양 끝에 배치
    alignItems: "center", // 세로로 중앙 정렬
    paddingHorizontal: 15,
    paddingTop: "15%",
  },
  button: {
    padding: 10,
  },
  logoutButton: {
    padding: 10,
  },
});

export default Header;
