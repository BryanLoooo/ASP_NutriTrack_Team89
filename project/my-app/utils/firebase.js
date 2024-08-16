import { initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjhIXpokr1gumP3JMFiF6_dOdClDBdAUs",
  authDomain: "main-41191.firebaseapp.com",
  projectId: "main-41191",
  storageBucket: "main-41191.appspot.com",
  messagingSenderId: "904819533566",
  appId: "1:904819533566:android:94113398a28e0f682be7af",
};

const app = initializeApp(firebaseConfig);

export { auth };
export default app;
