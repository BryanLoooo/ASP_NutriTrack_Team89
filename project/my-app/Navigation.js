// Navigation.js
import { createStackNavigator } from '@react-navigation/stack';
import FeedbackForm from './Feedback';
import ArticlesScreen from './Articles';
import Social from './Social';
import FoodScreen from './Food';
import HomeScreen from './Home';
import LoginScreen from './Login';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feedback" component={FeedbackForm} />
      <Stack.Screen name="Articles" component={ArticlesScreen} />
      <Stack.Screen name="Social" component={Social} />
      <Stack.Screen name="Food" component={FoodScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;