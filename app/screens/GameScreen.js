import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { lawSituations } from "../data/lawSituations";

export default function GameScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const situation = lawSituations[current];

  const handleOptionPress = (option) => {
    setSelected(option);
    setShowExplanation(true);
    if (option === situation.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    if (current < lawSituations.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(`🎉 Game Over! Your Score: ${score}/${lawSituations.length}`);
      router.back(); // Go back to CitizenLearning
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧩 Situation-Based Law Game</Text>

      <View style={styles.card}>
        <Text style={styles.situation}>{situation.situation}</Text>

        {situation.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selected === option && {
                backgroundColor:
                  option === situation.correctAnswer ? "#4caf50" : "#e53935"
              }
            ]}
            onPress={() => !showExplanation && handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanation}>{situation.explanation}</Text>
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    elevation: 4
  },
  situation: { fontSize: 16, color: "#fff", marginBottom: 20 },
  option: {
    backgroundColor: "#263238",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8
  },
  optionText: { color: "#fff", fontSize: 16 },
  explanationTitle: { fontWeight: "bold", color: "#4caf50", marginTop: 20 },
  explanation: { color: "#bbb", marginVertical: 10 },
  nextButton: {
    backgroundColor: "#2979ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  nextButtonText: { color: "#fff", fontWeight: "bold" }
});
