import { User, getAllUsers } from "../controllers/users.js";
import { Points } from "../controllers/pointsControlller.js";
import express from "express";
const userRoutes = express.Router();

userRoutes.post("/user", async (req, res) => {
    // Your route logic here
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
    }
);

userRoutes.get("/user", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.send(users);
      } catch (error) {
        res.status(400).send(error.message);
      }
    }
);

export { userRoutes };