import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import * as config from './../../config/config.js';
import Joi from 'joi';

// Validation schema for regular users
export const userSchema = Joi.object({
  name: Joi.string().required(),
  point: Joi.number().required(),
});

export const Points = async (userData) => {
  try {
    // Validate user data
    const validatedData = await userSchema.validateAsync(userData);

    // Check if a user with the same name already exists
    const usersCollection = collection(config.db, 'Users');
    const pointCollection = collection(config.db, 'Points');
    const pointQuery = query(pointCollection, where('name', '==', validatedData.name));
    const nameQuery = query(usersCollection, where('name', '==', validatedData.name));
    const matchingUsers = await getDocs(nameQuery);
    const matchingPoints = await getDocs(pointQuery);

    if (!matchingUsers.empty) {
      // User with the same name exists, update the points
      const existingUser = matchingUsers.docs[0].data();
      const userId = matchingUsers.docs[0].id;
      
      if (!matchingPoints.empty) {
        const existingPoints = matchingPoints.docs[0].data();
        const pointId = matchingPoints.docs[0].id;

        const updatedPoints = existingPoints.point + validatedData.point;

        // Update the points for the existing user
        const userDocRef = doc(pointCollection, pointId);
        await updateDoc(userDocRef, { point: updatedPoints });
        console.log(`Points updated successfully for user: ${validatedData.name}`);
      }else{
        // Save the user data to the database
        await addDoc(pointCollection, validatedData);
        console.log(`Points added successfully for user: ${validatedData.name}`);
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Error in Points function:", error);
    throw new Error("Validation or database error: " + error.message);
  }
};

const getAllPoints = async () => {
  try {
    const pointsCollection = collection(config.db, 'Points');
    const pointsQuery = await getDocs(pointsCollection);
    
    const points = [];
    pointsQuery.forEach((doc) => {
      points.push(doc.data());
    });

    return points;
  } catch (error) {
    throw new Error(`Error getting all points: ${error.message}`);
  }
};

const getPoints = async (name) => {
  try {
    const pointsCollection = collection(config.db, 'Points');
    const pointsQuery = query(pointsCollection, where('name', '==', name));
    const matchingPoints = await getDocs(pointsQuery);

    if (matchingPoints.empty) {
      throw new Error('User not found');
    }

    const points = matchingPoints.docs[0].data();
    return points;
  } catch (error) {
    throw new Error(`Error getting points: ${error.message}`);
  }
}

export { getAllPoints, getPoints };