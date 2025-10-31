import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const questions = [
  {
    question: "Article 14 guarantees equality before law and equal protection of laws to all persons.",
    answer: 0, // True
    explanation: "Article 14 ensures that all persons are treated equally under the law."
  },
  {
    question: "Article 14 applies only to citizens of India, not to foreigners.",
    answer: 1, // False
    explanation: "Article 14 applies to all persons within the territory of India, including foreigners."
  },
  {
    question: "The doctrine of reasonable classification allows the State to discriminate arbitrarily.",
    answer: 1, // False
    explanation: "Reasonable classification must have an intelligible differentia, rational nexus, and not be arbitrary."
  },
  {
    question: "Article 14 prohibits the State from making laws that treat people differently without valid reasons.",
    answer: 0, // True
    explanation: "Article 14 prevents arbitrary discrimination by the State."
  },
  {
    question: "Article 14 was added to the Constitution by the 42nd Amendment Act.",
    answer: 1, // False
    explanation: "Article 14 is part of the original Constitution, not added by any amendment."
  }
];

const TrueFalseScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // lesson id
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentQuestion].answer;
    const newAnswers = [...answers, selectedIndex];
    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const completeQuiz = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const updatedLessons = [1]; // Assuming lesson 1 is completed
        const updatedQuizzes = [2]; // Game id 2 completed
        const updatedScores = { 2: score }; // Score for game 2
        const response = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonsCompleted: updatedLessons,
            quizzesCompleted: updatedQuizzes,
            quizScores: updatedScores
          })
        });
        if (response.ok) {
          Alert.alert('Success', 'Progress updated!');
        } else {
          Alert.alert('Error', 'Failed to update progress');
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
    router.push('/screens/CitizenLearning');
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Challenge Completed!</Text>
        <Text style={styles.score}>Your Score: {score}/{questions.length}</Text>
        <TouchableOpacity style={styles.button} onPress={completeQuiz}>
          <Text style={styles.buttonText}>Complete Challenge</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article 14 True/False Challenge</Text>
      <Text style={styles.questionNumber}>Question {currentQuestion + 1} of {questions.length}</Text>
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      <TouchableOpacity style={styles.option} onPress={() => handleAnswer(0)}>
        <Text style={styles.optionText}>True</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleAnswer(1)}>
        <Text style={styles.optionText}>False</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  questionNumber: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  question: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  option: { backgroundColor: '#f0f0f0', padding: 15, marginVertical: 5, borderRadius: 10 },
  optionText: { fontSize: 16, textAlign: 'center' },
  score: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default TrueFalseScreen;
