import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const questions = [
  {
    question: "What does Article 14 of the Indian Constitution state?",
    options: ["Right to Freedom of Speech", "Equality before law and equal protection of laws", "Right to Life", "Right to Property"],
    answer: 1,
    explanation: "Article 14 guarantees equality before law and equal protection of laws to all persons."
  },
  {
    question: "Article 14 applies to:",
    options: ["Only citizens", "All persons within the territory of India", "Only adults", "Only men"],
    answer: 1,
    explanation: "Article 14 applies to all persons, citizens or non-citizens, within the territory of India."
  },
  {
    question: "Which case established the doctrine of reasonable classification under Article 14?",
    options: ["Kesavananda Bharati v. State of Kerala", "Maneka Gandhi v. Union of India", "State of West Bengal v. Anwar Ali Sarkar", "Ram Prasad v. State of Bihar"],
    answer: 2,
    explanation: "The case of State of West Bengal v. Anwar Ali Sarkar (1952) laid down the doctrine of reasonable classification."
  },
  {
    question: "What is the test for valid classification under Article 14?",
    options: ["Arbitrary and Capricious", "Intelligible differentia, rational nexus, and non-arbitrary", "Only intelligible differentia", "Only rational nexus"],
    answer: 1,
    explanation: "For classification to be valid, it must have intelligible differentia, rational nexus with the object, and not be arbitrary."
  },
  {
    question: "Article 14 prohibits:",
    options: ["Discrimination on grounds of religion", "Arbitrary discrimination by the State", "Discrimination on grounds of sex", "All of the above"],
    answer: 1,
    explanation: "Article 14 prohibits arbitrary discrimination by the State, though specific grounds are covered in Article 15."
  },
  {
    question: "Which Article deals with equality of opportunity in public employment?",
    options: ["Article 14", "Article 15", "Article 16", "Article 17"],
    answer: 2,
    explanation: "Article 16 provides for equality of opportunity in matters of public employment."
  },
  {
    question: "The principle of 'equal pay for equal work' is derived from:",
    options: ["Article 14", "Article 15", "Article 16", "Article 39(d)"],
    answer: 0,
    explanation: "The Supreme Court has held that 'equal pay for equal work' is a constitutional goal under Article 14."
  },
  {
    question: "Article 14 is applicable to:",
    options: ["Legislative actions only", "Executive actions only", "Both legislative and executive actions", "Judicial actions only"],
    answer: 2,
    explanation: "Article 14 applies to both legislative and executive actions of the State."
  },
  {
    question: "Which of the following is NOT a ground for classification under Article 14?",
    options: ["Residence", "Age", "Arbitrary whim", "Occupation"],
    answer: 2,
    explanation: "Classification cannot be based on arbitrary whim; it must be reasonable."
  },
  {
    question: "The right to equality under Article 14 is available against:",
    options: ["Private individuals", "The State", "Both State and private individuals", "Foreign governments"],
    answer: 1,
    explanation: "Article 14 is a right against the State, not private individuals."
  }
];

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);

    if (optionIndex === questions[currentQuestion].answer) {
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
        // Fetch current progress
        const getResponse = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`);
        const getData = await getResponse.json();
        const currentProgress = getData.progress || { lessonsCompleted: [], quizzesCompleted: [], quizScores: {} };

        // Update progress: add lesson and quiz if not already completed
        const updatedLessons = currentProgress.lessonsCompleted.includes(parseInt(id))
          ? currentProgress.lessonsCompleted
          : [...currentProgress.lessonsCompleted, parseInt(id)];
        const updatedQuizzes = currentProgress.quizzesCompleted.includes(parseInt(id))
          ? currentProgress.quizzesCompleted
          : [...currentProgress.quizzesCompleted, parseInt(id)];

        // Update quizScores
        const updatedScores = { ...currentProgress.quizScores, [id]: score };

        // Update progress in database
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

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Completed!</Text>
        <Text style={styles.score}>Your Score: {score}/{questions.length}</Text>
        <TouchableOpacity style={styles.button} onPress={completeQuiz}>
          <Text style={styles.buttonText}>Complete Lesson</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article 14 Quiz</Text>
      <Text style={styles.questionNumber}>Question {currentQuestion + 1} of {questions.length}</Text>
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      {questions[currentQuestion].options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => handleAnswer(index)}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  questionNumber: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  question: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  option: { backgroundColor: '#f0f0f0', padding: 15, marginVertical: 5, borderRadius: 10 },
  optionText: { fontSize: 16 },
  score: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
