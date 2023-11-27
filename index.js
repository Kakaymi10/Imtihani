// index.js
import express from 'express';
import { User } from './src/controllers/users.js';

import 'dotenv/config';
import { getAllUsers } from './src/controllers/users.js';
import bodyParser from 'body-parser';
import router from './src/routes/authRoutes.js';
import {checkUserRole} from './src/middlewares/checkRoles.js';
import { subjectRoutes } from './src/routes/subjectRouter.js';  
import { questionRoutes } from './src/routes/questionRouter.js';
import { pointRoutes } from './src/routes/pointRouter.js';

const app = express();
app.use(bodyParser.json());

const checkAdminRole = checkUserRole(1);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(subjectRoutes);
app.use(questionRoutes);
app.use(pointRoutes);
app.use('/auth', router);


app.post("/user", async (req, res) => {
  try {
    const userData = req.body;

    // Validate user data
    console.log("Received data:", userData);

    // Add user to the database
    const newUser = await User(userData);

    // Add points for the user
    const pointsData = { name: userData.name, point: 0 };
    await Points(pointsData);

    console.log("New user registered:", userData);

    res.send(newUser);
  } catch (err) {
    // If validation fails or any error occurs, send a 400 Bad Request response
    res.status(400).send(err.message);
    console.error(err);
  }
});
app.get("/user", async (req, res) => {  
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.use('/auth', router);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
