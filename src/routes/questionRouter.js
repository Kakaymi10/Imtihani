import express from 'express';
import {
    addQuestionToSubject, 
    getSubjectQuestions,
    deleteQuestion,
    updateQuestion,
    getQuestionById,
} from '../controllers/quizzController.js';
import { checkUserRole } from '../middlewares/checkRoles.js';

const questionRoutes = express.Router();

questionRoutes.post("/subject/:subjectName/", checkUserRole(1), async (req, res) => {
  // Your route logic here
  try {
    const subjectId = req.params.subjectName;
    const questionData = req.body;

    // Call the addQuestionToSubject function
    await addQuestionToSubject(subjectId, questionData);

    res.status(201).send("Question added to the subject successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

questionRoutes.put("/questions/:id", checkUserRole(1), async (req, res) => {
  // Your route logic here
  try {
    const questionId = req.params.id;
    const questionData = req.body;

    // Call the addQuestionToSubject function
    await updateQuestion(questionId, questionData);

    res.status(201).send("Question Updated to the subject successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

questionRoutes.delete("/questions/:id", checkUserRole(1), async (req, res) => {
  // Your route logic here
  try {
    const questionId = req.params.id;

    // Call the deleteQuestion function
    const result = await deleteQuestion(questionId);

    // Respond with a No Content status code (204) for a successful deletion
    res.status(201).send(result);
  } catch (error) {
    // Respond with a 400 status code and include the error message
    res.status(400).send("Error deleting question: " + error.message);
  }
});

questionRoutes.get("/questions/:id", async (req, res) => {
  // Your route logic here
  try {
    const questionId = req.params.id;

    // Call the deleteQuestion function
    const result = await getQuestionById(questionId);

    // Respond with a No Content status code (204) for a successful deletion
    res.status(200).send(result);
  } catch (error) {
    // Respond with a 400 status code and include the error message
    res.status(400).send("Error getting question: " + error.message);
  }
});

questionRoutes.get("/subject/:subjectName", async (req, res) => {
    try {
      const subjectName = req.params.subjectName;
      const questions = await getSubjectQuestions(subjectName);
      res.status(200).send(questions);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

export {questionRoutes};
