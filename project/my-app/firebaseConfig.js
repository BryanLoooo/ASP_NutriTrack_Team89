
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';


// firebase configuration using the apikey
const firebaseConfig = {
  apiKey: "AIzaSyBPs8N6PeLm5WZRN06a-V69d0-JyfdfE2c",
  authDomain: "feedbackform-5e2f8.firebaseapp.com",
  projectId: "feedbackform-5e2f8",
  storageBucket: "feedbackform-5e2f8.appspot.com",
  messagingSenderId: "133322353639",
  appId: "1:133322353639:web:60fb3c45919b468f582b42"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

export const addFeedback = async ({ feedback, rating }) => {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      feedback,
      rating,
      timestamp: new Date(), 
    });
  } catch (error) {
    throw new Error('Failed to submit feedback');
  }
};
export { db };

