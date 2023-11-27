import express from 'express';
import {
  addSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject,
} from '../controllers/quizzController.js';

import { checkUserRole } from '../middlewares/checkRoles.js';

const subjectRoutes = express.Router();

subjectRoutes.post("/subject", checkUserRole, async (req, res) => {
  // Your route logic here
  try {
    const newSubject = req.body;
    console.log("New subject", newSubject);

    // Call the addSubject function from config.js
    await addSubject(newSubject);

    res.status(201).send("Subject created successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});

subjectRoutes.put("/subject/:subjectName", checkUserRole, async (req, res) => {
  // Your route logic here
  try {
    const subjectName = req.params.subjectName;
    const newSubject = req.body;
    console.log("New subject", newSubject);

    // Call the addSubject function from config.js
    await updateSubject(subjectName, newSubject);

    res.status(201).send("Subject created successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});

subjectRoutes.delete("/subject/:subjectName", checkUserRole, async (req, res) => {
  // Your route logic here
  try {
    const newSubject = req.params.subjectName;
    console.log("New subject", newSubject);

    // Call the addSubject function from config.js
    await deleteSubject(newSubject);

    res.status(201).send("Subject created successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});

subjectRoutes.get("/subject", async (req, res) => {
  // Your route logic here
  try {
    const subjects = await getAllSubjects();
    res.send(subjects);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export {subjectRoutes};
