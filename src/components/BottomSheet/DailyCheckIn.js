import { View, Text, StyleSheet, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../../../config";
import ShortcutButton from "../ShortcutButton";
import axios from "axios";
import { getToken } from "../../../authStorage";

const DailyCheckIn = () => {
  const [attendedDates, setAttendedDates] = useState({});
  const [loading, setLoading] = useState(true);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date: date.getDate(),
        day: weekDays[date.getDay()],
        fullDate: date.toISOString().split("T")[0],
      };
    });
  };

  const [week] = useState(getCurrentWeek);

  // useFocusEffect로 변경하여 화면 포커스시마다 갱신
  useFocusEffect(
    useCallback(() => {
      const fetchAttendanceData = async () => {
        try {
          setLoading(true);

          const accessToken = await getToken();
          if (!accessToken) {
            console.log("토큰이 없습니다");
            setLoading(false);
            return;
          }

          console.log("출석 데이터 요청 시작");

          const response = await axios.get(`${API_URL}/attend`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          console.log("출석 API 응답:", response.data);

          const data = response.data;
          const attendedMap = {};

          // 데이터 형태 확인 및 안전한 처리
          let attendanceArray = [];

          if (Array.isArray(data)) {
            attendanceArray = data;
          } else if (data && Array.isArray(data.data)) {
            attendanceArray = data.data;
          } else if (data && Array.isArray(data.attendance)) {
            attendanceArray = data.attendance;
          } else {
            console.warn("예상치 못한 데이터 형태:", data);
            setAttendedDates({});
            setLoading(false);
            return;
          }

          attendanceArray.forEach((item) => {
            try {
              const dateObj = new Date(item.attend_date);
              // KST 기준 날짜 추출
              const kstOffset = 9 * 60 * 60 * 1000;
              const localDate = new Date(dateObj.getTime() + kstOffset);
              const dateString = localDate.toISOString().split("T")[0];
              attendedMap[dateString] = true;
            } catch (dateError) {
              console.error("날짜 처리 오류:", dateError, item);
            }
          });

          setAttendedDates(attendedMap);
        } catch (error) {
          console.error("출석 데이터를 불러오는 중 오류 발생:", error.message);
          if (error.response) {
            console.error("에러 상태:", error.response.status);
            console.error("에러 데이터:", error.response.data);
          }
          setAttendedDates({});
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>오늘의 출석</Text>
          <ShortcutButton
            style={styles.ShortcutButton}
            destination="AttendanceCheck"
          />
        </View>
        <View style={[styles.CalendarContainer, { justifyContent: "center" }]}>
          <Text style={{ color: "#666" }}>출석 데이터를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>오늘의 출석</Text>
        <ShortcutButton
          style={styles.ShortcutButton}
          destination="AttendanceCheck"
        />
      </View>
      <View style={styles.CalendarContainer}>
        {week.map(({ date, day, fullDate }, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayText}>{day}</Text>
            <View
              style={[styles.day, attendedDates[fullDate] && styles.attended]}
            >
              {attendedDates[fullDate] ? (
                <Image
                  style={styles.image}
                  source={require("../../../assets/images/SonsuLogo.png")}
                />
              ) : (
                <Text style={styles.dateText}>{date}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  titleWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  CalendarContainer: {
    flexDirection: "row",
    height: 100,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  dayContainer: {
    alignItems: "center",
  },

  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },

  day: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  attended: {
    backgroundColor: "#FFEB99",
  },

  image: {
    resizeMode: "contain",
    width: 30,
    height: 30,
  },

  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DailyCheckIn;
