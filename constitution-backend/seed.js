import dotenv from "dotenv";
import mongoose from "mongoose";
import MockTest from "./models/MockTest.js";
import Resource from "./models/Resource.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://root:root@cluster0.zutiyhk.mongodb.net/";
await mongoose.connect(MONGO_URI);

await Resource.deleteMany({});
await MockTest.deleteMany({});

const r1 = await Resource.create({
  type: "Act",
  title: "Right to Information Act, 2005",
  summary: "Empowers citizens to access government information.",
  fullText: "Full act text goes here...",
  tags: ["RTI","transparency"]
});

const r2 = await Resource.create({
  type: "Article",
  title: "Article 21 - Right to Life",
  articleNumber: "21",
  summary: "No person shall be deprived of his life or personal liberty.",
  tags: ["fundamental-rights","life"]
});

const test = await MockTest.create({
  title: "Basic Rights Mock Test",
  description: "Test on Articles 12-35",
  durationMinutes: 10,
  questions: [
    { q: "Article 21 guarantees?", options: ["Right to Property","Right to Life","Right to Religion","Right to Equality"], answerIndex: 1, explanation: "Article 21: Life & personal liberty." },
    { q: "Which act grants access to government records?", options: ["RTI Act 2005","IPC","CrPC","None"], answerIndex: 0 }
  ]
});

const article14Quiz = await MockTest.create({
  title: "Article 14 Quiz",
  description: "Multiple Choice Quiz on Right to Equality (Article 14)",
  durationMinutes: 5,
  questions: [
    { q: "What does Article 14 of the Indian Constitution state?", options: ["Right to Freedom of Speech", "Equality before law and equal protection of laws", "Right to Life", "Right to Property"], answerIndex: 1, explanation: "Article 14 guarantees equality before law and equal protection of laws to all persons." },
    { q: "Article 14 applies to:", options: ["Only citizens", "All persons within the territory of India", "Only adults", "Only men"], answerIndex: 1, explanation: "Article 14 applies to all persons, citizens or non-citizens, within the territory of India." },
    { q: "Which case established the doctrine of reasonable classification under Article 14?", options: ["Kesavananda Bharati v. State of Kerala", "Maneka Gandhi v. Union of India", "State of West Bengal v. Anwar Ali Sarkar", "Ram Prasad v. State of Bihar"], answerIndex: 2, explanation: "The case of State of West Bengal v. Anwar Ali Sarkar (1952) laid down the doctrine of reasonable classification." },
    { q: "What is the test for valid classification under Article 14?", options: ["Arbitrary and Capricious", "Intelligible differentia, rational nexus, and non-arbitrary", "Only intelligible differentia", "Only rational nexus"], answerIndex: 1, explanation: "For classification to be valid, it must have intelligible differentia, rational nexus with the object, and not be arbitrary." },
    { q: "Article 14 prohibits:", options: ["Discrimination on grounds of religion", "Arbitrary discrimination by the State", "Discrimination on grounds of sex", "All of the above"], answerIndex: 1, explanation: "Article 14 prohibits arbitrary discrimination by the State, though specific grounds are covered in Article 15." },
    { q: "Which Article deals with equality of opportunity in public employment?", options: ["Article 14", "Article 15", "Article 16", "Article 17"], answerIndex: 2, explanation: "Article 16 provides for equality of opportunity in matters of public employment." },
    { q: "The principle of 'equal pay for equal work' is derived from:", options: ["Article 14", "Article 15", "Article 16", "Article 39(d)"], answerIndex: 0, explanation: "The Supreme Court has held that 'equal pay for equal work' is a constitutional goal under Article 14." },
    { q: "Article 14 is applicable to:", options: ["Legislative actions only", "Executive actions only", "Both legislative and executive actions", "Judicial actions only"], answerIndex: 2, explanation: "Article 14 applies to both legislative and executive actions of the State." },
    { q: "Which of the following is NOT a ground for classification under Article 14?", options: ["Residence", "Age", "Arbitrary whim", "Occupation"], answerIndex: 2, explanation: "Classification cannot be based on arbitrary whim; it must be reasonable." },
    { q: "The right to equality under Article 14 is available against:", options: ["Private individuals", "The State", "Both State and private individuals", "Foreign governments"], answerIndex: 1, explanation: "Article 14 is a right against the State, not private individuals." }
  ]
});

const article14TrueFalse = await MockTest.create({
  title: "Article 14 True/False",
  description: "True/False Challenge on Right to Equality (Article 14)",
  durationMinutes: 5,
  questions: [
    { q: "Article 14 guarantees equality before law and equal protection of laws.", options: ["True", "False"], answerIndex: 0, explanation: "Yes, Article 14 states that the State shall not deny to any person equality before the law or the equal protection of the laws." },
    { q: "Article 14 applies only to citizens of India.", options: ["True", "False"], answerIndex: 1, explanation: "False, Article 14 applies to all persons within the territory of India, including non-citizens." },
    { q: "The doctrine of reasonable classification was established in the case of State of West Bengal v. Anwar Ali Sarkar.", options: ["True", "False"], answerIndex: 0, explanation: "True, this 1952 case laid down the doctrine of reasonable classification under Article 14." },
    { q: "For classification to be valid under Article 14, it must have intelligible differentia and rational nexus with the object.", options: ["True", "False"], answerIndex: 0, explanation: "True, and it must not be arbitrary." },
    { q: "Article 14 prohibits discrimination on grounds of religion, race, caste, sex, or place of birth.", options: ["True", "False"], answerIndex: 1, explanation: "False, Article 14 prohibits arbitrary discrimination, but specific grounds are covered under Article 15." },
    { q: "Article 16 deals with equality of opportunity in matters of public employment.", options: ["True", "False"], answerIndex: 0, explanation: "True, Article 16 ensures equality in public employment." },
    { q: "The principle of 'equal pay for equal work' is derived from Article 14.", options: ["True", "False"], answerIndex: 0, explanation: "True, the Supreme Court has recognized it as a constitutional goal under Article 14." },
    { q: "Article 14 applies only to legislative actions of the State.", options: ["True", "False"], answerIndex: 1, explanation: "False, it applies to both legislative and executive actions." },
    { q: "Classification under Article 14 can be based on arbitrary whim.", options: ["True", "False"], answerIndex: 1, explanation: "False, classification must be reasonable and not arbitrary." },
    { q: "The right to equality under Article 14 is available against private individuals.", options: ["True", "False"], answerIndex: 1, explanation: "False, it is a right against the State, not private individuals." },
    { q: "Article 14 is part of the Fundamental Rights in the Indian Constitution.", options: ["True", "False"], answerIndex: 0, explanation: "True, Article 14 is the first article under Part III, Fundamental Rights." },
    { q: "Article 14 allows the State to make laws that treat people differently without any reasonable basis.", options: ["True", "False"], answerIndex: 1, explanation: "False, any classification must be reasonable and not arbitrary." },
    { q: "The term 'equal protection of laws' means identical treatment for all persons in all circumstances.", options: ["True", "False"], answerIndex: 1, explanation: "False, it allows for reasonable classification where different treatment is justified." },
    { q: "Article 14 was added to the Constitution by the 42nd Amendment Act.", options: ["True", "False"], answerIndex: 1, explanation: "False, Article 14 is an original provision of the Constitution." },
    { q: "Article 14 applies to foreigners residing in India.", options: ["True", "False"], answerIndex: 0, explanation: "True, it applies to all persons within the territory of India." }
  ]
});

console.log("Seeded:", { r1, r2, test, article14Quiz, article14TrueFalse });
process.exit(0);
