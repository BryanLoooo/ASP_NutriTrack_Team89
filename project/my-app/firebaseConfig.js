

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPs8N6PeLm5WZRN06a-V69d0-JyfdfE2c",
  authDomain: "feedbackform-5e2f8.firebaseapp.com",
  projectId: "feedbackform-5e2f8",
  storageBucket: "feedbackform-5e2f8.appspot.com",
  messagingSenderId: "133322353639",
  appId: "1:133322353639:web:60fb3c45919b468f582b42"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore
const db = getFirestore(app);

export { db };

// Function to add feedback to Firestore
export const addFeedback = async (feedback) => {
  try {
    const feedbackId = new Date().getTime().toString()
    const feedbackDoc = doc(db, 'feedback', feedbackId);
    await setDoc(feedbackDoc, { feedback });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
