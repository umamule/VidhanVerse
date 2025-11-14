import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";


export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setTimeout(() => {
          if (token) {
            // User is logged in → go to Home
            router.replace("/screens/HomeScreen");
          } else {
            // No user → go to Login
            router.replace("/screens/login");
          }
        }, 3000); // Splash screen delay
      } catch (error) {
        console.error('Error checking login status:', error);
        router.replace("/screens/login");
      }
    };

    checkLoginStatus();
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
