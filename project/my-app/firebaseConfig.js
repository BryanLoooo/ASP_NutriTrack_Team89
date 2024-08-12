
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

// Function to add feedback to Firestore
export const addFeedback = async (feedbackData) => {
  try {
    // ref to feedback collection
    const feedbackCollection = collection(db, 'feedback');
    // add the feedback document to the "feedback" collection
    const docRef = await addDoc(feedbackCollection, feedbackData);
  } 
  catch (error) {
    throw error;
  }
};

export { db };


// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// // Firebase configuration using the API key
// const firebaseConfig = {
//   apiKey: "AIzaSyBPs8N6PeLm5WZRN06a-V69d0-JyfdfE2c",
//   authDomain: "feedbackform-5e2f8.firebaseapp.com",
//   projectId: "feedbackform-5e2f8",
//   storageBucket: "feedbackform-5e2f8.appspot.com",
//   messagingSenderId: "133322353639",
//   appId: "1:133322353639:web:60fb3c45919b468f582b42"
// };

// // Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// // Initialize Firestore
// const db = getFirestore(app);

// // Log the Firestore instance to check
// console.log("Firestore DB instance:", db);

// // Function to add feedback to Firestore
// export const addFeedback = async (feedbackData) => {
//   try {
//     const feedbackCollection = collection(db, 'feedback');
//     await addDoc(feedbackCollection, feedbackData);
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// };

// // Function to add image post to Firestore
// export const addImagePost = async (postData) => {
//   try {
//     const postsCollection = collection(db, 'imagePosts');
//     await addDoc(postsCollection, postData);
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// };

// // Function to fetch image posts from Firestore
// export const fetchImagePosts = async () => {
//   try {
//     // Additional logging to verify the collection reference
//     console.log("Trying to get collection reference for imagePosts");
//     const postsCollection = collection(db, 'imagePosts');
//     console.log("Collection reference obtained:", postsCollection);

//     const postSnapshot = await getDocs(postsCollection);
//     const postList = postSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     console.log("Fetched posts:", postList);  // Log fetched posts
//     return postList;
//   } catch (error) {
//     console.error("Error fetching posts: ", error);
//     throw error;
//   }
// };

// export { db };
