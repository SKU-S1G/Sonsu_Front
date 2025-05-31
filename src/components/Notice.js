import { Image, StyleSheet, Text, View } from "react-native";

const Notice = ({ NotText }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Megaphone.png")}
        style={styles.megaphone}
      />
      <Text style={{ fontSize: 11 }}>{NotText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    height: 37,
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  megaphone: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
});

export default Notice;
