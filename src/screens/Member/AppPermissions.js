import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LogoBg from "../../components/LogoBg";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
// <Entypo name="camera" size={24} color="black" />
// <Entypo name="bell" size={24} color="black" />
import { useNavigation } from "@react-navigation/native";

const AppPermissions = () => {
  const navigation = useNavigation();
  const BacktoLogin = () => {
    navigation.navigate("Login");
  };
  const handleStart = () => {
    navigation.navigate("Main");
  };
  return (
    <View style={styles.container}>
      <LogoBg />
      {/* 권한 허용 안내 */}
      <View style={styles.contentContainer}>
        <FontAwesome6
          name="xmark"
          size={24}
          color="black"
          style={styles.cancel}
          onPress={BacktoLogin}
        />
        <View style={styles.textWrap}>
          <Text style={styles.text}>권한을 허용하면</Text>
          <Text style={styles.text}>더 많은 기능을 쓸 수 있어요</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* 가운데 */}
      <View style={styles.centerContainer}>
        {/* 카메라 */}
        <View style={styles.permissionItem}>
          <Entypo name="camera" size={30} color="black" style={styles.icon} />
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>카메라</Text>
            <Text style={styles.permissionDescription}>
              수어 동작 인식을 위한 영상 촬영
            </Text>
          </View>
        </View>
        {/* 알림 */}
        <View style={styles.permissionItem}>
          <Entypo name="bell" size={30} color="black" style={styles.icon} />
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>알림</Text>
            <Text style={styles.permissionDescription}>
              원활한 학습을 위한 알림
            </Text>
          </View>
        </View>
      </View>

      {/* 시작하기 버튼 */}
      <View style={styles.startBtn}>
        <TouchableOpacity style={styles.StartButton} onPress={handleStart}>
          <Text style={styles.StartButtonText}>동의하고 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    top: "10%",
    paddingHorizontal: "10%",
  },
  cancel: {
    marginBottom: "10%",
  },
  textWrap: {
    alignSelf: "center",
    height: "auto",
    paddingBottom: 20,
  },
  text: {
    fontSize: 25,
    marginTop: 5,
  },
  divider: {
    borderBottomWidth: 1,
  },
  centerContainer: {
    flex: 1,
    top: "25%",
    paddingHorizontal: "10%",
    alignSelf: "center",
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  permissionText: {
    marginLeft: 20,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionDescription: {
    fontSize: 14,
    color: "#555",
  },
  icon: {
    backgroundColor: "#FFE694",
    padding: 10,
    borderRadius: 10,
  },
  StartButton: {
    width: "70%",
    height: 50,
    backgroundColor: "#FFE694",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  StartButtonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
  startBtn: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
});
export default AppPermissions;
