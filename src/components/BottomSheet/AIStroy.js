import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ShortcutButton from "../ShortcutButton";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import InfoModal from "../InfoModal";

const AIStroy = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>AI가 알려주는 재미있는 수어 이야기</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="alert-circle" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
      <View style={styles.AItext}>
        <Text>
          영국과 미국의 수어는 상당히 다르기 때문에, 한 영국 청각 장애인이
          미국을 방문했을 때 큰 혼란을 겪었어요. 그는 영국 수어에서
          '안녕하세요'를 손을 흔드는 동작으로 표현했는데, 미국에서는 그 제스처가
          다른 의미로 해석될 수 있어 당황했던 일화가 있습니다. 이 이야기는
          수어의 지역적 차이와 다양한 문화적 맥락을 배우는 데 중요한 교훈을
          줍니다.
        </Text>
      </View>
      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="AI가 알려주는 재미있는 수어 이야기"
        content={"이 정보는 AI가 제공하는 것으로,\n정확하지 않을 수 있습니다."}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
  },
  titleWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  AItext: {
    backgroundColor: "white",
    height: "50%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 15,
  },
});

export default AIStroy;
