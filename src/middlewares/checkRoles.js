// Assuming that config.js is in the same directory
import * as config from '../../config/config.js';
import { collection, doc, getDoc } from 'firebase/firestore';

const checkUserRole = (requiredRoleId) => {
    return async (req, res, next) => {
      const userId = req.body.userId;
  
      // Check if userId is available
      if (!userId) {
        res.status(403).send('Forbidden: User ID not provided');
        return;
      }
  
      // Fetch the user's role from the users collection
      const usersCollection = collection(config.db, 'users');
      const userDocRef = doc(usersCollection, userId);
  
      try {
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userRole = userDoc.data().roleId;
  
          // Check if the user has the required role
          if (userRole == requiredRoleId) {
            next(); // User has the required role, proceed to the next middleware/route handler
          } else {
            res.status(403).send('Forbidden: Insufficient role'); // User does not have the required role
          }
        } else {
          res.status(403).send('Forbidden: User not found in the collection'); // User not found in the collection
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    };
  };
  
  export {checkUserRole};