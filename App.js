import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Main from "./src/screens/Main";
import Login from "./src/screens/Member/Login";
import SignUp from "./src/screens/Member/SignUp";
import Menu from "./src/components/Menu";
import AppPermissions from "./src/screens/Member/AppPermissions";
import PrivacyPolicy from "./src/screens/Member/PrivacyPolicy";
import Classroom from "./src/screens/Classroom/Classroom";
import LessonDetail from "./src/screens/Classroom/LessonDetail";
import Study from "./src/screens/Study/Study";
import Review from "./src/screens/Review/Review";
import AttendanceCheck from "./src/screens/MyPage/AttendanceCheck";
import SignReview from "./src/screens/MyPage/SignReview";
import WeeklyReport from "./src/screens/MyPage/WeeklyReport";
import StudyOnly from "./src/screens/Study/StudyOnly";
import SpeedInfo from "./src/screens/Speed/SpeedInfo";
import SpeedGame from "./src/screens/Speed/SpeedGame";
import OXInfo from "./src/screens/OXGame/OXInfo";
import OXGame from "./src/screens/OXGame/OXGame";
import GameResult from "./src/components/GameResult";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={Menu} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="AppPermissions" component={AppPermissions} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Classroom" component={Classroom} />
          <Stack.Screen name="LessonDetail" component={LessonDetail} />
          <Stack.Screen name="Study" component={Study} />
          <Stack.Screen name="Review" component={Review} />
          <Stack.Screen name="AttendanceCheck" component={AttendanceCheck} />
          <Stack.Screen name="SignReview" component={SignReview} />
          <Stack.Screen name="WeeklyReport" component={WeeklyReport} />
          <Stack.Screen name="StudyOnly" component={StudyOnly} />
          <Stack.Screen name="SpeedInfo" component={SpeedInfo} />
          <Stack.Screen name="SpeedGame" component={SpeedGame} />
          <Stack.Screen name="OXInfo" component={OXInfo} />
          <Stack.Screen name="OXGame" component={OXGame} />
          <Stack.Screen name="GameResult" component={GameResult} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
