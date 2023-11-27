import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc,  getDoc} from 'firebase/firestore'; // Add the necessary imports
import * as config from './../../config/config.js';
import Joi from 'joi';

export const subjectSchema = Joi.object({
  name: Joi.string().required(),
});

export const questionSchema = Joi.object({
  userId: Joi.string().required(),
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
  userId: Joi.string().required(),
  answer: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
});

const addSubject = async (subjectData) => {
  try {
    // Validate subject data
    const validatedData = await subjectSchema.validateAsync(subjectData);

    // Check if a subject with the same name already exists
    const subjectCollection = collection(config.db, 'subject');
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

// Function to delete a subject
const deleteSubject = async (subjectName) => {
  try {
    // Validate subject name
    const validatedSubject = await subjectSchema.validateAsync({ name: subjectName });

    // Check if the subject exists
    const subjectCollection = collection(config.db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedSubject.name));
    const subjectDoc = await getDocs(nameQuery);

    if (subjectDoc.empty) {
      throw new Error('Subject not found');
    }

    // Delete the subject
    await deleteDoc(subjectDoc.docs[0].ref);

    console.log('Subject deleted successfully');
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting subject: " + error.message);
  }
};

// Function to update a subject
const updateSubject = async (subjectName, updatedData) => {
  try {
    // Validate subject name and updated data
    const validatedSubject = await subjectSchema.validateAsync({ name: subjectName });
    const validatedUpdatedData = await subjectSchema.validateAsync(updatedData);

    // Check if the subject exists
    const subjectCollection = collection(config.db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedSubject.name));
    const subjectDoc = await getDocs(nameQuery);

    if (subjectDoc.empty) {
      throw new Error('Subject not found');
    }

    // Update the subject
    await updateDoc(subjectDoc.docs[0].ref, validatedUpdatedData);

    console.log('Subject updated successfully');
  } catch (error) {
    console.error(error);
    throw new Error("Error updating subject: " + error.message);
  }
};

const addQuestionToSubject = async (subjectName, questionData) => {
  try {
    // Validate subject name and question data
    const validatedSubject = await subjectSchema.validateAsync({ name: subjectName });
    const validatedQuestion = await questionSchema.validateAsync(questionData);

    // Check if the subject exists
    const subjectCollection = collection(config.db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedSubject.name));
    const subjectDoc = await getDocs(nameQuery);

    if (subjectDoc.empty) {
      throw new Error('Subject not found');
    }

    // Get the current count of questions for the subject
    const questionsCollection = collection(config.db, 'questions');
    const subjectId = subjectDoc.docs[0].id;
    const questionsCount = (await getDocs(questionsCollection)).size;

    // Add the question to the subject with the next available ID
    const questionToAdd = {
      ...validatedQuestion,
      subjectId: subjectId,
      questionId: questionsCount, // Use the count as the ID
    };

    const addedQuestion = await addDoc(questionsCollection, questionToAdd);

    console.log('Question added to the subject successfully');

    return addedQuestion.questionId; // Return the ID of the added question
  } catch (error) {
    console.error(error);
    throw new Error("Error adding question: " + error.message);
  }
};

const getAllSubjects = async () => {
  try {
    const subjectsCollection = collection(config.db, 'subject');
    const subjectsQuery = await getDocs(subjectsCollection);
    
    const subjects = [];
    subjectsQuery.forEach((doc) => {
      subjects.push(doc.data());
    });
    console.log("Subjects", subjects);
    return subjects;

  } catch (error) {
    throw new Error(`Error getting all subjects: ${error.message}`);
  }
}

const getSubjectQuestions = async (subjectName) => {
  try {
    // Validate subject name
    const validatedSubject = await subjectSchema.validateAsync({ name: subjectName });

    // Check if the subject exists
    const subjectCollection = collection(config.db, 'subject');
    const nameQuery = query(subjectCollection, where('name', '==', validatedSubject.name));
    const subjectDoc = await getDocs(nameQuery);

    if (subjectDoc.empty) {
      throw new Error('Subject not found');
    }

    // Get the questions for the subject
    const questionsCollection = collection(config.db, 'questions');
    const questionsQuery = query(questionsCollection, where('subjectId', '==', subjectDoc.docs[0].id));
    const questions = await getDocs(questionsQuery);

    const questionsData = [];
    questions.forEach((doc) => {
      const questionWithId = { id: doc.id, ...doc.data() };
      questionsData.push(questionWithId);
    });

    return questionsData;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting questions: " + error.message);
  }
};

const updateQuestion = async (questionId, updatedQuestionData) => {
  try {
    // Validate updated question data
    const validatedQuestion = await questionSchema.validateAsync(updatedQuestionData);

    // Check if the document exists in the questions collection
    const questionsCollection = collection(config.db, 'questions');
    const questionDocRef = doc(questionsCollection, questionId);

    const questionDoc = await getDoc(questionDocRef);
    console.log("questionDoc", questionDoc);

    if (!questionDoc.exists()) {
      throw new Error(`Document with ID ${questionId} not found in the questions collection`);
    }

    // Update the question in the database
    await updateDoc(questionDocRef, validatedQuestion);

    console.log('Question updated successfully');

    return questionId;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating question: " + error.message);
  }
};


const deleteQuestion = async (questionId) => {
  try {
    // Delete the question from the database
    console.log('Deleting question with ID:', questionId);

    const questionsCollection = collection(config.db, 'questions');
    const questionDocRef = doc(questionsCollection, questionId);
    const questionDoc = await getDoc(questionDocRef);

    if (!questionDoc.exists()) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    await deleteDoc(questionDocRef);

    console.log('Question deleted successfully');

    return questionId;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting question: " + error.message);
  }
};

const getQuestionById = async (questionId) => {
  try {
    // Retrieve the question from the database
    const questionsCollection = collection(config.db, 'questions');
    const questionDocRef = doc(questionsCollection, questionId);
    const questionDoc = await getDoc(questionDocRef);

    if (!questionDoc.exists()) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    // Return the question data
    return questionDoc.data();
  } catch (error) {
    console.error(error);
    throw new Error("Error getting question by ID: " + error.message);
  }
};




export { addSubject, 
  addQuestionToSubject, 
  getAllSubjects, 
  getSubjectQuestions,
  updateSubject,
  deleteSubject,
  updateQuestion,
  deleteQuestion,
  getQuestionById
}