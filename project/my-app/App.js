//App.js
//import libraries
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "@react-native-firebase/app";

//import external module for navigation
import HomeScreen2 from "./Home";
import FeedbackScreen from "./Feedback";
import ArticlesScreen from "./Articles";
import Social from "./Social";
import FoodScreen from "./Food";
import app from "./utils/firebase";
// import LoginScreen from "./Login";
import ArticleWebView from "./ArticleWebView";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />
        <Stack.Screen
          name="Home2"
          component={HomeScreen2}
          initialParams={{ theme: "light" }}
        />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Articles" component={ArticlesScreen} />
        <Stack.Screen
          name="WebView"
          component={ArticleWebView}
          options={{ headerTitle: "Web View" }}
        />
        <Stack.Screen name="Social" component={Social} />
        <Stack.Screen name="Food" component={FoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//export App as an external module for referencing
export default App;
