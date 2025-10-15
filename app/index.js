import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { auth } from "../firebase"; // Make sure the path is correct
import { onAuthStateChanged } from "firebase/auth";


export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          // User is logged in → go to Home
          router.replace("/screens/HomeScreen");
        } else {
          // No user → go to Login
          router.replace("/screens/login");
        }
      }, 3000); // Splash screen delay
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <ActivityIndicator size="large" color="#2F80ED" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 200, height: 200, resizeMode: "contain" },
});
