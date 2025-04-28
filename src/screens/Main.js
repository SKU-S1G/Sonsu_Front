import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet from "../components/BottomSheet/BottomSheet";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../config";

const Main = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    try {
      axios
        .get(`${API_URL}/login/success`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            setUserInfo(response.data);
            console.log(response.data);
          }
        });
    } catch (error) {
      console.log("사용자 정보 가져오기 실패:", error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.Model}>
        <Text style={styles.textYellow}>
          안녕하세요, {userInfo?.username ? userInfo?.username : "undefined"}님!
        </Text>
        <Image
          source={require("../../assets/images/sonsuModel.png")}
          style={styles.sonsuModel}
        />
        <TouchableOpacity
          style={styles.LearnBtn}
          onPress={() => navigation.navigate("Classroom")}
        >
          <Text style={styles.LearnBtnText}>배움터</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE694",
  },
  Model: {
    flex: 1,
    top: "10%",
    alignItems: "center",
  },
  textYellow: {
    fontWeight: 500,
    fontSize: 40,
    paddingVertical: 6,
  },
  sonsuModel: {
    width: "40%",
    height: "40%",
    resizeMode: "contain",
  },
  LearnBtn: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 15,
    marginTop: -15,
    marginBottom: 15,
    width: "53%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  LearnBtnText: {
    color: "#000",
    fontSize: 23,
    textAlign: "center",
  },
});

export default Main;
