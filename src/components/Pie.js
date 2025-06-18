import { StyleSheet, View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const Pie = ({ data, radius, innerRadius, backgroundColor, donut }) => {
  return (
    <View style={styles.chartContainer}>
      <View style={styles.PieWrap}>
        <PieChart
          data={data}
          donut={donut}
          radius={radius} // 반지름 크기 조정
          innerRadius={innerRadius} // 내부 반지름 크기
          backgroundColor={backgroundColor}
          shadow={true}
          shadowColor="lightgray"
          shadowWidth={(radius * 4) / 3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Pie;
