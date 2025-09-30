import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import BackGround from "../../components/BackGround";
import Notice from "../../components/Notice";
import Menu from "../../components/Menu";
import { ScrollView } from "react-native-gesture-handler";
import Pie from "../../components/Pie";
import { API_URL } from "../../../config";
import { getToken } from "../../../authStorage";

const AttendanceCheck = () => {
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 출석 데이터 Fetch
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

          const response = await fetch(`${API_URL}/attend`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("출석 데이터 응답:", data);

          // 데이터 형태 확인 및 안전한 처리
          if (Array.isArray(data)) {
            setAttendanceData(data);
          } else if (data && Array.isArray(data.data)) {
            setAttendanceData(data.data);
          } else if (data && Array.isArray(data.attendance)) {
            setAttendanceData(data.attendance);
          } else {
            console.warn("예상치 못한 데이터 형태:", data);
            setAttendanceData([]);
          }
        } catch (error) {
          console.error("출석 데이터 가져오기 실패:", error.message);
          setAttendanceData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    }, [])
  );

  // 현재 달의 출석한 날 수 계산
  const getAttendanceCount = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const attendedDays = attendanceData.filter((attendance) => {
      const dateObj = new Date(attendance.attend_date);
      // KST 기준 날짜 추출 (DailyCheckIn.js와 동일한 방식)
      const kstOffset = 9 * 60 * 60 * 1000;
      const localDate = new Date(dateObj.getTime() + kstOffset);

      return (
        localDate.getMonth() === currentMonth &&
        localDate.getFullYear() === currentYear &&
        attendance.status === 1
      );
    });

    return attendedDays.length;
  };

  // 현재 달의 일 수 계산
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.getDate();
  };

  // 출석률 계산
  const attendanceCount = getAttendanceCount();
  const totalDays = getDaysInMonth();
  const attendancePercentage =
    totalDays > 0 ? (attendanceCount / totalDays) * 100 : 0;

  // 현재 날짜에 맞는 달력 데이터 생성
  useEffect(() => {
    const now = currentDate;
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    const startDay = firstDayOfMonth.getDay();
    const lastDate = lastDayOfMonth.getDate();

    // 이전 달의 날짜 추가
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDate = prevMonth.getDate();
    const prevMonthDays = [];
    for (let i = startDay; i > 0; i--) {
      prevMonthDays.push({
        date: prevMonthLastDate - i + 1,
        isCurrentMonth: false,
      });
    }

    // 현재 월의 날짜들 추가
    const currentMonthDays = [];
    for (let i = 1; i <= lastDate; i++) {
      currentMonthDays.push({ date: i, isCurrentMonth: true });
    }

    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    const nextMonthDays = [];
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: i,
        isCurrentMonth: false,
      });
    }

    setDaysInMonth([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  }, [currentDate]);

  // 오늘 날짜와 비교하여 강조하는 함수
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day.date &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear() &&
      day.isCurrentMonth
    );
  };

  // 출석 상태가 있는지 확인하는 함수
  // const isAttended = (date) => {
  //   const formattedDate = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth(),
  //     date
  //   );

  //   const result = attendanceData.some((attendance) => {
  //     const dateObj = new Date(attendance.attend_date);
  //     // KST 기준 날짜 추출 (DailyCheckIn.js와 동일한 방식)
  //     const kstOffset = 9 * 60 * 60 * 1000;
  //     const localDate = new Date(dateObj.getTime() + kstOffset);

  //     // 디버깅 로그
  //     if (date === 1) {
  //       console.log("10월 1일 체크:", {
  //         원본날짜: attendance.attend_date,
  //         변환후: localDate.toISOString(),
  //         날짜: localDate.getDate(),
  //         월: localDate.getMonth(),
  //         연도: localDate.getFullYear(),
  //         비교대상날짜: formattedDate.getDate(),
  //         비교대상월: formattedDate.getMonth(),
  //         비교대상연도: formattedDate.getFullYear(),
  //         status: attendance.status,
  //       });
  //     }

  //     return (
  //       localDate.getDate() === formattedDate.getDate() &&
  //       localDate.getMonth() === formattedDate.getMonth() &&
  //       localDate.getFullYear() === formattedDate.getFullYear() &&
  //       attendance.status === 1
  //     );
  //   });

  //   if (date === 1) {
  //     console.log("10월 1일 최종 결과:", result);
  //   }

  //   return result;
  // };

  // 기존 isAttended 함수 삭제 후 아래로 교체
  const isAttended = (date) => {
    const kstOffset = 9 * 60 * 60 * 1000;

    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

    // attendanceData 순회하면서 날짜 문자열 비교
    return attendanceData.some((attendance) => {
      try {
        const localDate = new Date(
          new Date(attendance.attend_date).getTime() + kstOffset
        );
        const attendanceDateString = localDate.toISOString().split("T")[0];

        return attendanceDateString === dateString && attendance.status === 1;
      } catch (error) {
        console.error("날짜 변환 오류:", error, attendance);
        return false;
      }
    });
  };

  // 요일 표시
  const renderWeekdays = () => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <View style={styles.weekdaysContainer}>
        {weekdays.map((weekday, index) => (
          <Text key={index} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>
    );
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(newDate));
  };

  // 이후 달로 이동
  const goToNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(newDate));
  };

  const renderItem = ({ item }) => {
    if (!item.date) return null;

    return (
      <View
        key={`${item.date}-${item.isCurrentMonth}`}
        style={[styles.day, !item.isCurrentMonth && styles.disabledDay]}
      >
        <TouchableOpacity>
          <Text
            style={[
              styles.dayText,
              !item.isCurrentMonth && styles.disabledDayText,
              isToday(item) && styles.todayText,
              isAttended(item.date) && styles.attendedDayText,
            ]}
          >
            {item.date}
          </Text>
        </TouchableOpacity>

        {isAttended(item.date) && item.isCurrentMonth && (
          <Image
            source={require("../../../assets/images/SonsuLogo.png")}
            style={styles.selectedImage}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View>
        <Header />
        <BackGround />
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 18, color: "#666" }}>
            출석 데이터를 불러오는 중...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Header />
      <BackGround />

      <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          출석체크
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
            color: "#333",
            marginBottom: "10%",
          }}
        >
          내 수어 학습 출석률은? 오늘도 한 걸음 더 나아가요!
        </Text>
      </View>

      <ScrollView>
        <View style={styles.calenderContainer}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.arrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.arrow}>{">"}</Text>
            </TouchableOpacity>
          </View>
          {renderWeekdays()}
          <View style={styles.calendarContent}>
            {daysInMonth.map((item, index) => renderItem({ item }))}
          </View>
        </View>

        <Notice NotText="출석은 하루에 최소 1개 이상의 학습을 완료해야만 인정됩니다." />

        <View style={{ width: "90%", alignSelf: "center", marginTop: 45 }}>
          <Text style={styles.title}>
            나의 {currentDate.getMonth() + 1}월 출석률은?
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              alignSelf: "center",
            }}
          >
            <View style={styles.PieWrap}>
              <Pie
                data={[
                  { value: attendancePercentage, color: "#FFE694" },
                  { value: 100 - attendancePercentage, color: "#e0e0e0" },
                ]}
                radius={50}
                innerRadius={25}
                backgroundColor="#f5f5f5"
                donut={true}
              />
            </View>
            <View style={{ marginLeft: 20, justifyContent: "center" }}>
              <Text style={{ fontSize: 27, fontWeight: "bold" }}>
                {attendancePercentage.toFixed(1)}%
              </Text>
              <Text style={{ fontSize: 13, marginTop: 8 }}>
                100%를 향한 도전, 함께 달려보아요!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  calenderContainer: {
    alignSelf: "center",
    padding: 20,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 20.5,
    color: "#333",
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  weekday: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  day: {
    width: "12.34%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    margin: 3,
  },
  dayText: {
    fontSize: 18,
  },
  todayText: {
    color: "orange",
    fontWeight: "bold",
  },
  disabledDayText: {
    color: "#d3d3d3",
  },
  selectedDay: {},
  selectedImage: {
    backgroundColor: "#FFE694",
    position: "absolute",
    borderRadius: 30,
    width: 35,
    height: 35,
    padding: 3,
    resizeMode: "contain",
  },
  calendarContent: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 20,
    paddingLeft: 10,
  },
  PieWrap: {},
});

export default AttendanceCheck;
