import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const questions = [
  { question: "What does Article 14 of the Indian Constitution state?", options: ["Right to Freedom of Speech", "Equality before law and equal protection of laws", "Right to Life", "Right to Property"], answer: 1 },
  { question: "Article 14 applies to:", options: ["Only citizens", "All persons within the territory of India", "Only adults", "Only men"], answer: 1 },
  { question: "Which case established the doctrine of reasonable classification under Article 14?", options: ["Kesavananda Bharati v. State of Kerala", "Maneka Gandhi v. Union of India", "State of West Bengal v. Anwar Ali Sarkar", "Ram Prasad v. State of Bihar"], answer: 2 },
  { question: "What is the test for valid classification under Article 14?", options: ["Arbitrary and Capricious", "Intelligible differentia, rational nexus, and non-arbitrary", "Only intelligible differentia", "Only rational nexus"], answer: 1 },
  { question: "Article 14 prohibits:", options: ["Discrimination on grounds of religion", "Arbitrary discrimination by the State", "Discrimination on grounds of sex", "All of the above"], answer: 1 },
  { question: "Which Article deals with equality of opportunity in public employment?", options: ["Article 14", "Article 15", "Article 16", "Article 17"], answer: 2 },
  { question: "The principle of 'equal pay for equal work' is derived from:", options: ["Article 14", "Article 15", "Article 16", "Article 39(d)"], answer: 0 },
  { question: "Article 14 is applicable to:", options: ["Legislative actions only", "Executive actions only", "Both legislative and executive actions", "Judicial actions only"], answer: 2 },
  { question: "Which of the following is NOT a ground for classification under Article 14?", options: ["Residence", "Age", "Arbitrary whim", "Occupation"], answer: 2 },
  { question: "The right to equality under Article 14 is available against:", options: ["Private individuals", "The State", "Both State and private individuals", "Foreign governments"], answer: 1 }
];

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Audio objects (optional) — place sound files at ./assets/sounds/correct.mp3 and wrong.mp3
  const [correctSound, setCorrectSound] = useState(null);
  const [wrongSound, setWrongSound] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      try {
        const { sound: soundCorrect } = await Audio.Sound.createAsync(require('../assets/sounds/correct.mp3'));
        const { sound: soundWrong } = await Audio.Sound.createAsync(require('../assets/sounds/wrong.mp3'));
        if (isMounted) {
          setCorrectSound(soundCorrect);
          setWrongSound(soundWrong);
        }
      } catch (e) {
        // If sounds are not present or fail to load, we'll fallback to haptics/vibration only.
        console.log('Sound assets not found or failed to load. Falling back to vibration/haptics.', e);
      }
    };

    loadSounds();

    return () => {
      isMounted = false;
      if (correctSound) {
        correctSound.unloadAsync();
      }
      if (wrongSound) {
        wrongSound.unloadAsync();
      }
    };
  }, []);

  const provideFeedback = async (isCorrect) => {
    // Try to play sound if available
    try {
      if (isCorrect && correctSound) {
        await correctSound.replayAsync();
      } else if (!isCorrect && wrongSound) {
        await wrongSound.replayAsync();
      } else {
        // Haptic & vibration fallback
        Haptics.selectionAsync();
        Vibration.vibrate(50);
      }
    } catch (e) {
      // Final fallback
      Haptics.selectionAsync();
      Vibration.vibrate(50);
    }
  };

  const handleAnswer = async (optionIndex) => {
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);

    const isCorrect = optionIndex === questions[currentQuestion].answer;
    if (isCorrect) setScore(prev => prev + 1);

    // feedback (sound/haptic/vibration)
    provideFeedback(isCorrect);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const completeQuiz = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const getResponse = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`);
        const getData = await getResponse.json();
        const currentProgress = getData.progress || { lessonsCompleted: [], quizzesCompleted: [], quizScores: {} };

        const updatedLessons = currentProgress.lessonsCompleted.includes(parseInt(id))
          ? currentProgress.lessonsCompleted
          : [...currentProgress.lessonsCompleted, parseInt(id)];

        const updatedQuizzes = currentProgress.quizzesCompleted.includes(parseInt(id))
          ? currentProgress.quizzesCompleted
          : [...currentProgress.quizzesCompleted, parseInt(id)];

        const updatedScores = { ...currentProgress.quizScores, [id]: score };

        const response = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonsCompleted: updatedLessons, quizzesCompleted: updatedQuizzes, quizScores: updatedScores })
        });

        if (response.ok) Alert.alert('Success', 'Progress updated!');
        else Alert.alert('Error', 'Failed to update progress');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
    //router.back();
    router.push('/screens/CitizenLearning');
  };

  if (showResult) {
    return (
      <LinearGradient colors={["#FF9933", "#FFFFFF", "#138808"]} style={styles.gradient} start={[0, 0]} end={[0, 1]}>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerBox}>
            <Text style={styles.title}>Quiz Completed!</Text>
            <Text style={styles.score}>Your Score: {score}/{questions.length}</Text>
            <TouchableOpacity style={styles.completeButton} onPress={completeQuiz}>
              <Text style={styles.completeButtonText}>Complete Lesson</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FF9933", "#FFFFFF", "#138808"]} style={styles.gradient} start={[0, 0]} end={[0, 1]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.title}>Article 14 Quiz</Text>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1} of {questions.length}</Text>

          <View style={styles.card}>
            <Text style={styles.question}>{questions[currentQuestion].question}</Text>

            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.option} onPress={() => handleAnswer(index)} activeOpacity={0.85}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  centerBox: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#054187', marginBottom: 8, textAlign: 'center' },
  questionNumber: { fontSize: 14, color: '#222', marginBottom: 12 },
  card: { width: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6 },
  question: { fontSize: 18, marginBottom: 12, textAlign: 'center', color: '#222' },
  option: { backgroundColor: '#FFFFFF', padding: 14, marginVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(5,65,135,0.08)' },
  optionText: { fontSize: 16, color: '#054187', textAlign: 'center' },
  score: { fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#054187' },
  completeButton: { backgroundColor: '#138808', padding: 14, borderRadius: 10, alignItems: 'center', width: '80%' },
  completeButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
