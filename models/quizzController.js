import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Add the necessary imports
import db from '../config/config.js';
import Joi from 'joi';

export const subjectSchema = Joi.object({
  name: Joi.string().required(),
});

export const questionSchema = Joi.object({
  question: Joi.string().required(),
  answers: Joi.object()
    .length(4)
    .pattern(Joi.string(), Joi.boolean())
    .custom((value, helpers) => {
      // Your custom logic here
      const trueCount = Object.values(value).filter((v) => v === true).length;

      if (trueCount !== 1) {
        return helpers.error('object.singleTrue');
      }

      return value;
    }, 'custom single true validation')
    .required(),
})
  .messages({
    'object.singleTrue': '{{#label}} must have exactly one key with the value true',
  });



export const answerSchema = Joi.object({
  answer: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
});

export const addSubject = async (subjectData) => {
  try {
    // Validate subject data
    const validatedData = await subjectSchema.validateAsync(subjectData);

    // Check if a subject with the same name already exists
    const subjectCollection = collection(db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedData.name));
    const matchingSubjects = await getDocs(nameQuery);

    if (!matchingSubjects.empty) {
      throw new Error('Subject with the same name already exists');
    }

    // Save the subject data to the database
    await addDoc(subjectCollection, validatedData);

    console.log('Subject added successfully');
  } catch (error) {
    throw new Error("Validation or database error: " + error.message);
  }
}

export const addQuestionToSubject = async (subjectName, questionData) => {
  try {
    // Validate subject name and question data
    const validatedSubject = await subjectSchema.validateAsync({ name: subjectName });
    const validatedQuestion = await questionSchema.validateAsync(questionData);

    // Check if the subject exists
    const subjectCollection = collection(db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedSubject.name));
    const subjectDoc = await getDocs(nameQuery);

    if (subjectDoc.empty) {
      throw new Error('Subject not found');
    }

    // Add the question to the subject
    const questionsCollection = collection(db, 'questions');
    const questionToAdd = {
      ...validatedQuestion,
      subjectId: subjectDoc.docs[0].id, // Assuming you have an ID field in your subject document
    };

    const addedQuestion = await addDoc(questionsCollection, questionToAdd);

    console.log('Question added to the subject successfully');

    return addedQuestion.id; // Return the ID of the added question
  } catch (error) {
    console.error(error);
    throw new Error("Error adding question: " + error.message);
  }
};
