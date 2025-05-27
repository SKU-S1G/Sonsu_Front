import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DailyCheckIn from "./DailyCheckIn";
import ContinueLearning from "./ContinueLearning";
import Reviewing from "./Reviewing";
import AIStroy from "./AIStroy";

const BottomSheetComponent = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["43%", "90%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      style={styles.sheet}
      backgroundStyle={{ backgroundColor: "#f5f5f5" }}
      enablePanDownToClose={false}
    >
      <BottomSheetView style={styles.whiteContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 오늘의 출석 */}
          <DailyCheckIn />
          {/* 이어서 학습하기 */}
          <ContinueLearning />
          {/* 복습하기 */}
          <Reviewing />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    marginTop: 50,
    flexGrow: 1,
    borderRadius: 50,
    overflow: "hidden",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    paddingBottom: 180,
  },
});

export default BottomSheetComponent;
