
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import FeedbackForm from './feedbackForm';
import SubmittedFeedback from './submittedFeedback';
import Social from './social'; // Import the Social component

// Import nav bar icons
import FeedbackIcon from './images/Feedback.png'; 
import SocialIcon from './images/Social.png'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the type for your icons
type IconName = 'feedback' | 'social';
type Icons = {
  [key in IconName]: any;
};

// Define your icons mapping with the type
const icons: Icons = {
  'feedback': FeedbackIcon,
  'social': SocialIcon
};

// Function to get the tab bar icon
const TabBarIcon = (iconName: IconName) => {
  const icon = icons[iconName];
  return icon ? <Image source={icon} style={{ width: 34, height: 38 }} /> : null;
};

// Define the Feedback stack navigator
const FeedbackStack = () => (
  <Stack.Navigator initialRouteName="FeedbackFormScreen">
    <Stack.Screen
      name="FeedbackFormScreen"
      component={FeedbackForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SubmittedFeedbackScreen"
      component={SubmittedFeedback}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Define the Social stack navigator (if you need nested navigation for Social tab)
const SocialStack = () => (
  <Stack.Navigator initialRouteName="SocialScreen">
    <Stack.Screen
      name="SocialScreen"
      component={Social}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main app component
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="NutriTrack"
          component={FeedbackStack}
          options={{
            tabBarIcon: () => TabBarIcon('feedback'), // Match the icon name
            tabBarLabel: () => null, // Hide the label
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialStack} // Navigate to SocialStack
          options={{
            tabBarIcon: () => TabBarIcon('social'), // Match the icon name
            tabBarLabel: () => null, // Hide the label
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
