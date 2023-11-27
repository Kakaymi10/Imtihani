import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import * as config from './../../config/config.js';

// models/users.js
import Joi from 'joi';
import bcrypt from 'bcrypt';

// Validation schema for regular users
export const userSchema = Joi.object({
  name: Joi.string().required(),
});



export const User = async (userData) => {
  try {
    // Validate user data
    const validatedData = await userSchema.validateAsync(userData);

    // Check if a user with the same name already exists
    const usersCollection = collection(config.db, 'Users');
    const nameQuery = query(usersCollection, where('name', '==', validatedData.name));
    const matchingUsers = await getDocs(nameQuery);

    if (!matchingUsers.empty) {
      throw new Error('User with the same name already exists');
    }
    
    // Add an initial roleId of 0 to the user data
    validatedData.roleId = 0;

    // Save the user data to the database
    const userDocRef = await addDoc(usersCollection, validatedData);

    console.log('User added successfully');

    // Return the user ID
    return userDocRef.id;
  } catch (error) {
    throw new Error("Validation or database error: " + error.message);
  }
};


export const getAllUsers = async () => {
  try {
    const usersCollection = collection(config.db, 'Users');
    const usersQuery = await getDocs(usersCollection);
    
    const users = [];
    usersQuery.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    throw new Error(`Error getting all users: ${error.message}`);
  }
};



  /*// Function to validate and add a superadmin

  // Validation schema for superadmins
export const superadminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Adjust the min length as needed
});
export const superAdmin = async (superadminData) => {
    try {
      // Validate superadmin data
      const validatedData = await superadminSchema.validateAsync(superadminData);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  
      // Save the superadmin data to the database
      const superadminCollection = collection(db, 'superAdmin');
      const superAdminQuery = query(superadminCollection, where('email', '==', validatedData.email));
      const matchingSuperAdmins = await getDocs(superAdminQuery);

    if (!matchingSuperAdmins.empty) {
        throw new Error('Superadmin with the same email already exists');
    }
    
    await addDoc(superadminCollection, { ...validatedData, password: hashedPassword, role: 0 });
      
      console.log('Superadmin added successfully');
    } catch (error) {
      throw new Error("Validation or database error: " + error.message);
    }
  };*/
/*const User = async (user) => {
    try {
      const usersCollection = collection(db, 'Users');
      await addDoc(usersCollection, user);
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  };
 const superAdmin = async (user) => {
    try {
      const usersCollection = collection(db, 'superAdmin');
      await addDoc(usersCollection, user);
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  };

export default { User,superAdmin}*/