import { auth } from "./firebase";

export const signUp = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};
