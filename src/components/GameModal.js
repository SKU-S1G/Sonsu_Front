import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const GameModal = ({ visible, onClose, title, content, onOxPress }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.TitleView}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Icon name="window-close" size={20} color="#000" onPress={onClose} />
          </View>
          <Text style={styles.modalContent}>{content}</Text>
          <TouchableOpacity onPress={onOxPress} style={styles.closeButton}>
            <Text style={styles.closeText}>결과 확인하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  TitleView: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: '#FFE694',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  modalContent: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: "#B5DAC1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  closeText: {
    fontSize: 12,
  },
});

export default GameModal;
