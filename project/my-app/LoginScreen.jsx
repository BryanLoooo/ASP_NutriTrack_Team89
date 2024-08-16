import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import { signIn } from "./utils/auth";
import app from "./utils/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";

const webClientId = "904819533566-bp32cqandl3bv0jbpc0cdndo4c4rl0je.apps.googleusercontent.com";
const androidClientId = "904819533566-a6s6ko55ra21pv35kfc0rtcbeg90gpj8.apps.googleusercontent.com";



const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        webClientId,
      androidClientId:
        androidClientId,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const googleSignIn = async () => {
    console.log("Pressed sign in");
  
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Sign-In Successful:", userInfo);
  
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
  
      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
  
      // Navigate to the Home2 screen
      navigation.navigate("Home2");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Navigate to the main app screen after successful login
      navigation.navigate("Home2");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      {/* form  */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntery}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity
          style={styles.googleButtonContainer}
          onPress={googleSignIn}
        >
          <Image
            source={require("./assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
