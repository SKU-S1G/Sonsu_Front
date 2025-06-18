import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LogoBg from "../../components/LogoBg";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState, useEffect } from "react";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicy = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [notificationsChecked, setNotificationsChecked] = useState(false);
  const [benefitsChecked, setBenefitsChecked] = useState(false);
  const [isSignUpEnabled, setIsSignUpEnabled] = useState(false); // 회원가입 버튼 활성화 상태

  const navigation = useNavigation(); // 네비게이션 훅 사용

  // 모든 체크박스를 한 번에 선택 / 해제
  const toggleAll = (value) => {
    setAllChecked(value);
    setTermsChecked(value);
    setPrivacyChecked(value);
    setNotificationsChecked(value);
    setBenefitsChecked(value);
  };

  // 개별 체크박스 업데이트
  const updateCheckbox = (setter, value) => {
    setter(value);
  };

  // 모든 개별 체크박스가 선택되면 "모두 동의하기" 체크
  useEffect(() => {
    if (
      termsChecked &&
      privacyChecked &&
      notificationsChecked &&
      benefitsChecked
    ) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [termsChecked, privacyChecked, notificationsChecked, benefitsChecked]);

  // (필수) 항목들이 모두 체크되었는지 확인
  useEffect(() => {
    if (termsChecked && privacyChecked && notificationsChecked) {
      setIsSignUpEnabled(true); // 모든 필수 항목이 체크되면 회원가입 버튼 활성화
    } else {
      setIsSignUpEnabled(false); // 하나라도 체크되지 않으면 비활성화
    }
  }, [termsChecked, privacyChecked, notificationsChecked]);

  // 회원가입 버튼 클릭 시
  const handleSignUp = () => {
    navigation.navigate("SignUp"); // 'SignUp' 페이지로 이동
  };

  const BacktoLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <LogoBg />
      <View style={styles.contentContainer}>
        <FontAwesome6
          name="xmark"
          size={24}
          color="black"
          style={styles.cancel}
          onPress={BacktoLogin}
        />
        <View style={styles.textWrap}>
          <Text style={styles.text}>보다 재미있는</Text>
          <Text style={styles.text}>수어 학습,</Text>
          <Text style={styles.text}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>손手잇다</Text>를
            시작해보세요 :)
          </Text>
        </View>
      </View>

      {/* 체크박스 리스트 */}
      <View style={styles.bottomContainer}>
        {/* 모두 동의하기 */}
        <View style={styles.checkAll}>
          <Checkbox
            value={allChecked}
            onValueChange={toggleAll}
            style={[styles.checkbox, allChecked && styles.checkedCheckbox]} // 체크 시 스타일 추가
            color={allChecked ? "#000000" : "#ccc"} // 체크된 상태는 흰색, 그렇지 않으면 회색
          />
          <Text style={styles.checkText}>모두 동의하기</Text>
        </View>

        {/* 개별 체크박스 */}

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={termsChecked}
            onValueChange={(value) => updateCheckbox(setTermsChecked, value)}
            style={[styles.checkbox, termsChecked && styles.checkedCheckbox]}
            color={termsChecked ? "#000000" : "#ccc"}
          />
          <Text style={styles.checkText}>서비스 이용약관 (필수)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={privacyChecked}
            onValueChange={(value) => updateCheckbox(setPrivacyChecked, value)}
            style={[styles.checkbox, privacyChecked && styles.checkedCheckbox]}
            color={privacyChecked ? "#000000" : "#ccc"}
          />
          <Text style={styles.checkText}>개인정보처리방침 (필수)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={notificationsChecked}
            onValueChange={(value) =>
              updateCheckbox(setNotificationsChecked, value)
            }
            style={[
              styles.checkbox,
              notificationsChecked && styles.checkedCheckbox,
            ]}
            color={notificationsChecked ? "#000000" : "#ccc"}
          />
          <Text style={styles.checkText}>서비스 알림 수신 (필수)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={benefitsChecked}
            onValueChange={(value) => updateCheckbox(setBenefitsChecked, value)}
            style={[styles.checkbox, benefitsChecked && styles.checkedCheckbox]}
            color={benefitsChecked ? "#000000" : "#ccc"}
          />
          <Text style={styles.checkText}>서비스 혜택 정보 수신</Text>
        </View>
      </View>

      {/* 회원가입 버튼 (활성화/비활성화 상태 적용) */}
      <View style={styles.startBtn}>
        <TouchableOpacity
          style={[
            styles.SignUpButton,
            isSignUpEnabled ? {} : styles.disabledButton,
          ]} // 비활성화 스타일 추가
          onPress={handleSignUp}
          disabled={!isSignUpEnabled} // 버튼이 비활성화 상태면 클릭 불가
        >
          <Text style={styles.SignUpButtonText}>회원가입</Text>
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
  },
  text: {
    fontSize: 25,
    marginTop: 5,
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: "20%",
    paddingHorizontal: "10%",
  },
  checkAll: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkText: {
    fontSize: 16,
  },
  startBtn: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
  SignUpButton: {
    width: "70%",
    height: 50,
    backgroundColor: "#FFE694",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  SignUpButtonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc", // 비활성화 시 배경 색 변경
  },
});

export default PrivacyPolicy;
