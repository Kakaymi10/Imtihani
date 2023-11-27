import express from 'express';
import { Points, getAllPoints, getPoints} from '../controllers/pointsControlller.js';

const pointRoutes = express.Router(); 

pointRoutes.post('/points', async (req, res) => {
    try {
     
      const pointsData = req.body;
  
      // Call the addQuestionToSubject function
      await Points(pointsData);
  
      res.status(201).send("Point added to the subject successfully");
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
});
  
pointRoutes.get("/points", async (req, res) => {
    try {
      const points = await getAllPoints();
      res.send(points);
    } catch (error) {
      res.status(400).send(error.message);
    }
});
  
pointRoutes.get("/points/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const points = await getPoints(name);
      res.send(points);
    } catch (error) {
      res.status(400).send(error.message);
    }
});

export { pointRoutes };