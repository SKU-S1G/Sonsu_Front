import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import Main from "../screens/Main";
import Classroom from "../screens/Classroom/Classroom";
import MyPage from "../screens/MyPage/MyPage";
import { View, Image, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const Tab = createBottomTabNavigator();

const Menu = () => {
  const soundRef = useRef(null);

  const playClickSound = async () => {
    try {
      // 기존 소리 unload
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/Sounds/Click.mp3")
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("사운드 재생 오류:", error);
    }
  };
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: styles.tabBar, // 스타일 적용
          tabBarItemStyle: styles.tabItem, // 개별 아이템 스타일 적용
          tabBarLabelStyle: styles.tabLabel, // 라벨 스타일 적용
          showLabel: true, // 라벨 표시
          tabBarActiveTintColor: "#FFCA1A", // 활성화된 탭의 텍스트와 아이콘 색상 변경
          tabBarInactiveTintColor: "black", // 비활성화된 탭의 텍스트와 아이콘 색상 변경
          headerShown: false,
        }}
        screenListeners={{
          tabPress: () => {
            playClickSound(); // ✅ 탭 클릭 시 효과음 재생
          },
        }}
      >
        <Tab.Screen
          name="Classroom"
          component={Classroom}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={28} color={color} />
            ),
            tabBarLabel: "배움터",
            // 헤더 없애기
          }}
        />
        <Tab.Screen
          name="Home"
          component={Main}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../../assets/images/SonsuLogo.png")}
                style={styles.centerIcon} // 사진은 그대로 유지
              />
            ),
            tabBarLabel: "SONSU",
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={28} color={color} />
            ),
            tabBarLabel: "마이페이지",
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    position: "absolute",
    bottom: 10, // 하단 고정
    left: 0,
    right: 0,
    zIndex: 100, // 다른 요소보다 위에 위치
  },
  tabBar: {
    flex: 1,
    position: "absolute",
    bottom: 10, // 하단 고정
    left: 0,
    right: 0,
    zIndex: 100, // 다른 요소보다 위에 위치
    backgroundColor: "#fff",
    height: 80,
    borderRadius: 35,
    shadowColor: "#000", // 그림자 색상
    shadowOpacity: 0.1, // 그림자 투명도
    shadowOffset: { width: 0, height: 3 }, // 그림자 위치 조정
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  centerIcon: {
    width: 90,
    height: 90,
    position: "absolute",
    top: -45,
  },
  tabLabel: {
    marginTop: 10,
  },
  tabItem: {
    marginTop: 8,
  },
});

export default Menu;
