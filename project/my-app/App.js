
//App.js
//import libraries
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import external module for navigation
import HomeScreen from './Home';
import FeedbackScreen from './Feedback';
import ArticlesScreen from './Articles';
import Social from './Social';
import FoodScreen from './Food';
import LoginScreen from './Login';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} initialParams={{ theme: 'light' }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Articles" component={ArticlesScreen} />
        <Stack.Screen name="Social" component={Social} />
        <Stack.Screen name="Food" component={FoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//export App as an external module for referencing
export default App;