import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function UserTypeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select User Type</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/screens/CitizenDashboard")}
      >
        <Text style={styles.buttonText}>Citizen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/screens/InstituteDashboard")}
      >
        <Text style={styles.buttonText}>Institute</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 30 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, width: "60%", alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18 },
});
