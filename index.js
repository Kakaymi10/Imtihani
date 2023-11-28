// index.js
import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import router from './src/routes/authRoutes.js';
import { subjectRoutes } from './src/routes/subjectRouter.js';
import { questionRoutes } from './src/routes/questionRouter.js';
import { pointRoutes } from './src/routes/pointRouter.js';
import { userRoutes } from './src/routes/userRouter.js';
import swaggerFile from './src/swagger/swagger-output.json' assert { type: 'json' };
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(bodyParser.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/auth', router);
app.use(subjectRoutes);
app.use(questionRoutes);
app.use(pointRoutes);
app.use(userRoutes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
