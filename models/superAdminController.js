import { compare } from 'bcrypt';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import sign from 'jsonwebtoken';
import db from '../config/config.js';
import Joi from 'joi';

export const superadminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Adjust the min length as needed
});

export const superAdminLogin = async (email, password) => {
  try {
    // Validate superadmin data
    const validatedData = await superadminSchema.validateAsync({ email, password });

    // Check if a superadmin with the provided email exists
    const superadminCollection = collection(db, 'superAdmin');
    const superAdminQuery = query(superadminCollection, where('email', '==', validatedData.email));
    const matchingSuperAdmins = await getDocs(superAdminQuery);

    if (matchingSuperAdmins.empty) {
      throw new Error('Superadmin not found');
    }

    // Get the superadmin data
    const superadminData = matchingSuperAdmins.docs[0].data();

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await compare(validatedData.password, superadminData.password);

    if (!passwordMatch) {
      throw new Error('Incorrect password');
    }

    // Generate a JWT token
    const token = sign({ email: superadminData.email, role: superadminData.role }, 'your-secret-key', {
      expiresIn: '1h', // Set the token expiration time as needed
    });

    // Update the superadmin's record in the database with the generated token
    const superadminDocRef = doc(superadminCollection, matchingSuperAdmins.docs[0].id);
    await updateDoc(superadminDocRef, { token });

    console.log('Superadmin login successful');
    return token;
  } catch (error) {
    throw new Error('Superadmin login error: ' + error.message);
  }
};
