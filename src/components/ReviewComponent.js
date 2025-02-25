import React from "react";
import { View, ScrollView } from "react-native";
import ReviewCard from "./ReviewCard";
import tailwind from "tailwind-rn";

export default function ReviewComponent() {
  return (
    <View
      style={[
        tailwind("flex-row bg-white  mt-3 p-4"),
        {
          height: 260,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
          shadowOffset: { width: 2, height: 5 },
          justifyContent: "center",
          alignSelf: "center",
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ height: "100%" }}
        contentContainerStyle={[tailwind("flex-row items-center")]}
      >
        <View
          style={[
            tailwind("flex justify-center items-center"),
            {
              height: "100%",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 4,
              shadowOffset: { width: 1, height: 6 },
            },
          ]}
        >
          <ReviewCard />
        </View>
      </ScrollView>
    </View>
  );
}
