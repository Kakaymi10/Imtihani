import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '../config/config.js';
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
    const usersCollection = collection(db, 'Points');
    const nameQuery = query(usersCollection, where('name', '==', validatedData.name));
    const matchingUsers = await getDocs(nameQuery);

    if (!matchingUsers.empty) {
      // User with the same name exists, update the points
      const existingUser = matchingUsers.docs[0].data();
      const userId = matchingUsers.docs[0].id;

      const updatedPoints = existingUser.point + validatedData.point;

      // Update the points for the existing user
      const userDocRef = doc(usersCollection, userId);
      await updateDoc(userDocRef, { point: updatedPoints });

      console.log(`Points updated successfully for user: ${validatedData.name}`);
    } else {
      // User with the same name does not exist, create a new entry
      await addDoc(usersCollection, validatedData);

      console.log(`New user added successfully: ${validatedData.name}`);
    }
  } catch (error) {
    console.error("Error in Points function:", error);
    throw new Error("Validation or database error: " + error.message);
  }
};
