// index.js
import express from 'express';
import { User,superAdmin} from './models/users.js';
import { addSubject, addQuestionToSubject } from './models/quizzController.js';
import { superAdminLogin } from './models/superAdminController.js';
import { Points } from './models/pointsControlller.js';
import 'dotenv/config';



const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/superadmin", async (req, res) => {
  try {
    const superadmin = req.body;
    console.log("New user", superadmin);

    // Call the addUser function from config.js
    await superAdmin(superadmin);

    res.send("superadmin registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});
app.post("/superadmin/login", async (req, res) => {
  try {
    const superadmin = req.body;
    console.log("New user", superadmin);

    // Call the addUser function from config.js
    await superAdminLogin(superadmin);

    res.send("superadmin Logged in successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});
app.post("/user", async (req, res) => {
  try {
    const user = req.body;
    console.log("New user", user);

    // Call the addUser function from config.js
    await User(user);

    res.send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err);
  }
});

// Route to add a new subject
app.post("/subject", async (req, res) => {
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

// Route to add a new question to a subject
app.post('/subject/:subjectName/questions', async (req, res) => {
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
app.post('/points', async (req, res) => {
  try {
   
    const pointsData = req.body;

    // Call the addQuestionToSubject function
    await Points(pointsData);

    res.status(201).send("Point added to the subject successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
