//App.js
//import libraries
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./ThemeContext";

//import external module for navigation
import HomeScreen from "./Home";
import FeedbackScreen from "./Feedback";
import ArticlesScreen from "./Articles";
import Social from "./Social";
import FoodScreen from "./Food";
import LoginScreen from "./Login";
import ArticleWebView from "./ArticleWebView";

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
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
    </ThemeProvider>
  );
};

//export App as an external module for referencing
export default App;
