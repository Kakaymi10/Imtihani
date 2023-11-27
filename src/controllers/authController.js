// controllers/authController.js
import { auth, db } from './../../config/config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Save user information in the database
    const userDocRef = doc(db, 'users', user.uid);
    const userData = {
      name: user.email,
      roleId: 0, // Assigning an automatic roleId of 0
    };
    await setDoc(userDocRef, userData);

    // You can customize the response as needed
    res.status(201).json({ message: 'User created successfully. Email verification sent.', uid: user.uid });
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ error: 'Failed to sign up' });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if the email is verified
      if (!user.emailVerified) {
        return res.status(403).json({ error: 'Email not verified. Please verify your email.' });
      }
  
      // Check the user's role in the database
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
  
        if (userData.roleId === 1) {
          // Redirect the user (replace 'redirectLink' with your actual redirection link)
          return res.status(200).json({ message: 'Login successful', uid: user.uid, redirectLink: 'your_redirect_link' });
        } else if (userData.roleId === 0) {
          // User has roleId 0 (Forbidden)
          return res.status(403).json({ error: 'Forbidden. You do not have permission to access.' });
        }
      } else {
        // User document not found in the database
        return res.status(500).json({ error: 'User document not found.', uid: user.uid });
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };

export { signUp, login };
