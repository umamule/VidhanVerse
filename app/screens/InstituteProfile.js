import React from "react";
import { View, Text, StyleSheet } from "react-native";
const API_BASE = "http:// 10.147.21.191:5000/api"; // <-- change if needed

export default function InstituteProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏛️ Institute Profile Page</Text>
      <Text style={styles.subText}>Manage details, teachers, and activities here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 20, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 14, color: "#666", marginTop: 5 },
});
