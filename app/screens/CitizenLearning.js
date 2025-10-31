import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const CitizenLearning = () => {
  const router = useRouter();
  const [showLessons, setShowLessons] = useState(false);
  const [showGames, setShowGames] = useState(false);

  const [lessons, setLessons] = useState([
    { id: 1, title: "Right to Equality (Article 14)", desc: "Equality before law", unlocked: true, completed: false },
    { id: 2, title: "Right to Freedom (Article 19)", desc: "Freedom of speech and more", unlocked: false, completed: false },
    { id: 3, title: "Right Against Exploitation (Article 23)", desc: "Protection from exploitation", unlocked: false, completed: false },
    { id: 4, title: "Right to Constitutional Remedies (Article 32)", desc: "Enforcing fundamental rights", unlocked: false, completed: false },
  ]);

  const loadProgress = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`);
        const data = await response.json();
        if (data.progress) {
          const { lessonsCompleted, quizzesCompleted, quizScores } = data.progress;
          setLessons(prev => prev.map(lesson => ({
            ...lesson,
            completed: lessonsCompleted.includes(lesson.id),
            unlocked: lesson.id === 1 || lessonsCompleted.includes(lesson.id - 1),
            score: quizScores ? quizScores[lesson.id] : null
          })));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const games = [
    { id: 1, title: "Multiple Choice Quiz", desc: "Test your knowledge with questions", route: "QuizScreen" },
    { id: 2, title: "True/False Challenge", desc: "Quick true or false questions", route: "TrueFalseScreen" },
    { id: 3, title: "Matching Game", desc: "Match rights with descriptions", route: "MatchingScreen" },
    { id: 4, title: "Scenario Decision", desc: "Make decisions in real scenarios", route: "ScenarioScreen" },
    { id: 5, title: "Flashcard Review", desc: "Review key concepts with flashcards", route: "FlashcardScreen" },
  ];

  const completeLesson = (id) => {
    setLessons((prev) =>
      prev.map((lesson, index) =>
        lesson.id === id
          ? { ...lesson, completed: true }
          : lesson.id === id + 1
          ? { ...lesson, unlocked: true }
          : lesson
      )
    );
    router.push(`/screens/QuizScreen?id=${id}`);
  };

  const selectGame = (game) => {
    router.push(`/screens/${game.route}?id=1`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* ✅ Header with gradient */}
      <LinearGradient colors={["#4CAF50", "#81C784"]} style={styles.header}>
        <Text style={styles.headerText}>Citizen Learning</Text>
        <Text style={styles.subHeader}>Know your rights, empower yourself 🇮🇳</Text>
      </LinearGradient>

      {/* ✅ Progress card */}
      <Animated.View entering={FadeInUp} style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(lessons.filter((l) => l.completed).length / lessons.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {lessons.filter((l) => l.completed).length}/{lessons.length} Lessons Completed • XP: 1,250
        </Text>
      </Animated.View>

      {/* ✅ Start Learning Button or Lesson List */}
      {!showLessons ? (
        <Animated.View entering={FadeInUp.delay(200)} style={styles.startCard}>
          <Text style={styles.lessonTitle}>Learn Your Rights</Text>
          <Text style={styles.lessonDesc}>
            Explore fundamental rights with fun, interactive lessons and games!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={() => setShowLessons(true)}>
            <Text style={styles.startButtonText}>Start Learning</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : showGames ? (
        <View style={styles.lessonSection}>
          <Text style={styles.sectionTitle}>Choose a Game for Lesson 1</Text>
          {games.map((game, index) => (
            <Animated.View key={game.id} entering={FadeInUp.delay(index * 150)}>
              <TouchableOpacity
                style={styles.lessonItem}
                onPress={() => selectGame(game)}
              >
                <LinearGradient
                  colors={["#E8F5E9", "#C8E6C9"]}
                  style={styles.lessonGradient}
                >
                  <Text style={styles.lessonText}>🎮 {game.title}</Text>
                  <Text style={styles.lessonSub}>{game.desc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      ) : (
        <View style={styles.lessonSection}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          {lessons.map((lesson, index) => (
            <Animated.View key={lesson.id} entering={FadeInUp.delay(index * 150)}>
              <TouchableOpacity
                style={[
                  styles.lessonItem,
                  !lesson.unlocked && { opacity: 0.5 },
                  lesson.completed && { borderColor: "#4CAF50", borderWidth: 2 },
                ]}
                disabled={!lesson.unlocked}
                onPress={lesson.id === 1 ? () => setShowGames(true) : () => completeLesson(lesson.id)}
              >
                <LinearGradient
                  colors={
                    lesson.completed
                      ? ["#A5D6A7", "#81C784"]
                      : lesson.unlocked
                      ? ["#E8F5E9", "#C8E6C9"]
                      : ["#E0E0E0", "#BDBDBD"]
                  }
                  style={styles.lessonGradient}
                >
                  <Text style={styles.lessonText}>
                    {lesson.completed ? "✅ " : lesson.unlocked ? "📖 " : "🔒 "}
                    {lesson.title}
                  </Text>
                  <Text style={styles.lessonSub}>{lesson.desc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      {/* ✅ Optional extra sections */}
      {!showLessons && (
        <>
          {/* Daily Challenge */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.card}>
            <Text style={styles.sectionTitle}>Daily Challenges</Text>
            <View style={styles.challengeItem}>
              <Text style={styles.challengeText}>🏆 Complete 3 Lessons</Text>
              <Text style={styles.reward}>+100 XP</Text>
            </View>
            <View style={styles.challengeItem}>
              <Text style={styles.challengeText}>🎯 Get 100% in Quiz</Text>
              <Text style={styles.reward}>+150 XP</Text>
            </View>
          </Animated.View>

          {/* Situation-Based Game */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.card}>
            <Text style={styles.sectionTitle}>Situation-Based Game</Text>
            <Text style={styles.subDesc}>
              Test your rights in real-world inspired scenarios!
            </Text>
            <TouchableOpacity
              style={styles.gameButton}
              onPress={() => router.push("/screens/GameScreen")}
            >
              <Text style={styles.gameButtonText}>Play Now 🎮</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
};

export default CitizenLearning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingVertical: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#E8F5E9",
    fontSize: 14,
    marginTop: 5,
  },

  progressCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: { fontSize: 13, color: "#777", marginTop: 5 },

  startCard: {
    backgroundColor: "#E8F5E9",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  lessonTitle: { fontSize: 20, fontWeight: "bold", color: "#2E7D32", marginBottom: 8 },
  lessonDesc: { fontSize: 14, color: "#4CAF50", textAlign: "center", marginBottom: 15 },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  lessonSection: { marginHorizontal: 15, marginTop: 10 },
  lessonItem: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  lessonGradient: {
    padding: 15,
  },
  lessonText: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" },
  lessonSub: { fontSize: 13, color: "#555", marginTop: 5 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  challengeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  challengeText: { fontSize: 15, color: "#333" },
  reward: { color: "#4CAF50", fontWeight: "bold" },

  subDesc: { fontSize: 14, color: "#555", marginBottom: 10 },
  gameButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  gameButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
