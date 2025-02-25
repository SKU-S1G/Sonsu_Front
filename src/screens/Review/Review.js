import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import ReviewComponent from '../../components/ReviewComponent';
import tailwind from 'tailwind-rn';

export default function Review() {
  const navigation = useNavigation();

  return (
    <ScrollView style={[tailwind('flex-1'), { backgroundColor: "#f5f5f5" }]}>
      <Header color="#FFE694" />

      {/* 복습하기 */}
      <View style={tailwind('flex-row justify-between items-center mt-2 mx-10')}>
        <Text style={tailwind('text-xl font-semibold')}>복습하기</Text>
      </View>

      {/* 스피드 게임 */}
      <TouchableOpacity onPress={() => navigation.navigate("SpeedInfo")} style={[tailwind('flex-row justify-between items-center bg-red-300 pl-4 pr-6 mt-5 mb-5'), styles.gameBox]}>
        <View style={styles.imageContainer}>
          <Image 
            source={require("../../../assets/images/sonsuModel.png")} 
            style={styles.imageSmall}
          />
        </View>
        
        <View style={styles.textContainer}>
          <Image 
            source={require("../../../assets/images/SpeedGame.png")} 
            style={styles.imageTitle}
          />
          <Text style={[tailwind('text-center text-sm mt-2'), { color: "#2d3748" }]}>
            실시간 게임으로 빠르게 수어 복습!
          </Text>
        </View>
      </TouchableOpacity>

      {/* OX 퀴즈 */}
      <View style={[tailwind('flex-row justify-between items-center bg-blue-200 pl-6 pr-4 mb-5'), styles.gameBox, styles.shadowReverse]}>
        <View style={styles.textContainer}>
          <Image 
            source={require("../../../assets/images/OXQuiz.png")} 
            style={styles.imageTitle}
          />
          <Text style={[tailwind('text-center text-sm mt-2'), { color: "#2d3748" }]}>
            간단하고 재미있게 수어 복습!
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require("../../../assets/images/sonsuModel.png")} 
            style={styles.imageSmall}
          />
        </View>
      </View>

      {/* 오답 수어 다시보기 */}
      <View style={tailwind('flex-row justify-between items-center mt-2 mb-2 mx-10')}>
        <Text style={tailwind('text-xl font-semibold')}>오답 수어 다시보기</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </View>

      {/* 오답수어 컨텐츠 */}
      <ReviewComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gameBox: {
    width: '85%', 
    height: 140,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 6 },
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  shadowReverse: {
    shadowOffset: { width: -5, height: 2 },
  },
  imageContainer: {
    width: "fit-content",
  },
  textContainer: {
    width: "auto",
    alignItems: "center",
  },
  imageSmall: {
    width: 65,
    height: 90,
    resizeMode: "contain",
  },
  imageTitle: {
    width: 150,
    height: 30,
    resizeMode: "contain",
  },
});
