import React, { useState, useEffect } from "react"; //import useState and useEffect
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; //To use AsyncStorage to store in react.
import { useTheme } from "./ThemeContext"; //Import theme from themeContext.js
import Footer from "./Footer.js"; // Importing the Footer component for navigation

// Theme configurations for light and dark modes
const themes = {
  light: {
    backgroundColor: "#fff",
    textColor: "#333",
    borderColor: "#ccc",
    linkColor: "blue",
    placeholderColor: "#888", // Placeholder color for light theme
  },
  dark: {
    backgroundColor: "#333",
    textColor: "#fff",
    borderColor: "#888",
    linkColor: "lightblue",
    placeholderColor: "#aaa", // Placeholder color for dark theme
  },
};

// Dynamically generate styles based on the selected theme
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingBottom: 110,
      backgroundColor: themes[theme].backgroundColor,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: themes[theme].textColor,
    },
    input: {
      height: 40,
      borderColor: themes[theme].borderColor,
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      color: themes[theme].textColor,
    },
    foodItem: {
      padding: 10,
      borderBottomColor: themes[theme].borderColor,
      borderBottomWidth: 1,
    },
    foodName: {
      fontSize: 16,
      fontWeight: "bold",
      color: themes[theme].textColor,
    },
    foodDetails: {
      marginTop: 20,
    },
    macroContainer: {
      marginTop: 20,
    },
    macro: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    macroLabel: {
      fontSize: 16,
      flex: 1,
      color: themes[theme].textColor,
    },
    macroInput: {
      flex: 2,
      height: 40,
      borderColor: themes[theme].borderColor,
      borderWidth: 1,
      paddingHorizontal: 10,
      color: themes[theme].textColor,
    },
  });

//Load the food screen
const FoodScreen = ({ navigation }) => {
  console.log("Test Case 1: Food.js page loaded successfully."); // Test Case 1 to test if the food page loaded successfully

  // Access the current theme using the useTheme hook
  const { theme } = useTheme();
  console.log("Test Case 2: Current theme is:", theme); // Test Case 2

  const styles = getStyles(theme); // Dynamically apply styles based on the theme

  const [query, setQuery] = useState(""); // Store search query
  const [foods, setFoods] = useState([]); // Store fetched food items
  const [selectedFood, setSelectedFood] = useState(null); // Store the selected food item
  const [carbs, setCarbs] = useState(""); // Store carbs value
  const [fats, setFats] = useState(""); // Store fats value
  const [protein, setProtein] = useState(""); // Store protein value
  const [calories, setCalories] = useState(""); // Store calories value

  const appId = "106a2498"; // Edamam API ID
  const apiKey = "d444d58428c68ef47c2f7f97014c0027"; // Edamam API key

  // Fetch food data from the API based on the query
  const fetchFoodData = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${apiKey}&ingr=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      setFoods([{ ...data, food_name: query }]); // Store the fetched data
      console.log("Test Case 4: Food data fetched successfully!!"); // Test Case 4
    } catch (error) {
      console.log("Test Case 5: Error fetching food data:", error); // Test Case 5
    }
  };

  // Track changes in the 'foods' array using the useEffect hook
  useEffect(() => {
    if (foods.length === 0) return;
    console.log("Test Case 6: Food item selected:", foods[0].food_name); // Test Case 6
  }, [foods]);

  // Handle the selection of a food item and calculate its nutrients
  const selectFood = (food) => {
    setSelectedFood(food);
    calculateNutrients(food);
  };

  // Calculate the nutrients of the selected food
  const calculateNutrients = (food) => {
    const carbNutrient = food.totalNutrients.CHOCDF
      ? food.totalNutrients.CHOCDF.quantity
      : 0;
    const fatNutrient = food.totalNutrients.FAT
      ? food.totalNutrients.FAT.quantity
      : 0;
    const proteinNutrient = food.totalNutrients.PROCNT
      ? food.totalNutrients.PROCNT.quantity
      : 0;
    const caloriesNutrient = food.calories ? food.calories : 0;

    setCarbs(carbNutrient.toFixed(1)); // Store the carbs value with 1 decimal precision
    setFats(fatNutrient.toFixed(1)); // Store the fats value with 1 decimal precision
    setProtein(proteinNutrient.toFixed(1)); // Store the protein value with 1 decimal precision
    setCalories(caloriesNutrient.toFixed(1)); // Store the calories value with 1 decimal precision

    console.log(
      "Test Case 7: Nutrients calculated - Carbs:",
      carbNutrient,
      "Fats:",
      fatNutrient,
      "Protein:",
      proteinNutrient,
      "Calories:",
      caloriesNutrient
    ); // Test Case 7
  };

  // Save the selected food's nutrient data to AsyncStorage
  const saveFood = async () => {
    const currentNutrients = {
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      protein: parseFloat(protein),
      calories: parseFloat(calories),
    };

    console.log(
      "Test Case 8: Current nutrient values before saving:",
      currentNutrients
    ); // Test Case 8

    try {
      const savedNutrients = await AsyncStorage.getItem("totalNutrients");
      let updatedNutrients = {
        carbs: 0,
        fats: 0,
        protein: 0,
        calories: 0,
      };

      // Update stored nutrients by adding the current nutrient values
      if (savedNutrients) {
        const parsedNutrients = JSON.parse(savedNutrients);
        updatedNutrients = {
          carbs: parsedNutrients.carbs + currentNutrients.carbs,
          fats: parsedNutrients.fats + currentNutrients.fats,
          protein: parsedNutrients.protein + currentNutrients.protein,
          calories: parsedNutrients.calories + currentNutrients.calories,
        };
      } else {
        updatedNutrients = currentNutrients;
      }

      await AsyncStorage.setItem(
        "totalNutrients",
        JSON.stringify(updatedNutrients)
      );
      console.log(
        "Test Case 9: Food data saved successfully:",
        currentNutrients
      ); // Test Case 9
      Alert.alert("Success", "Food has been saved successfully!");
    } catch (error) {
      console.log("Test Case 10: Error saving food data:", error); // Test Case 10
    }
  };

  // Handle the search functionality when the 'Search' button is clicked
  const handleSearch = () => {
    console.log("Test Case 3: Search button clicked with query:", query); // Test Case 3
    if (query.length > 0) {
      fetchFoodData();
    } else {
      setFoods([]);
    }
  };

  // What will be display on the mobile screen
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.label}>Search for food</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg:100g of chicken thigh"
          placeholderTextColor={themes[theme].placeholderColor}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
          }}
        />
        <Button title="Search" onPress={handleSearch} />
        {selectedFood ? (
          <View style={styles.foodDetails}>
            <Text style={styles.foodName}>{selectedFood.food_name}</Text>
            <View style={styles.macroContainer}>
              <View style={styles.macro}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <TextInput
                  style={styles.macroInput}
                  value={carbs}
                  editable={false}
                />
              </View>
              <View style={styles.macro}>
                <Text style={styles.macroLabel}>Fats</Text>
                <TextInput
                  style={styles.macroInput}
                  value={fats}
                  editable={false}
                />
              </View>
              <View style={styles.macro}>
                <Text style={styles.macroLabel}>Protein</Text>
                <TextInput
                  style={styles.macroInput}
                  value={protein}
                  editable={false}
                />
              </View>
              <View style={styles.macro}>
                <Text style={styles.macroLabel}>Total calories</Text>
                <TextInput
                  style={styles.macroInput}
                  value={calories}
                  editable={false}
                />
              </View>
            </View>
            <Button title="Save Food" onPress={saveFood} />
          </View>
        ) : (
          <FlatList
            data={foods}
            keyExtractor={(item) => item.food_name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.foodItem}
                onPress={() => selectFood(item)}
              >
                <Text style={styles.foodName}>{item.food_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

export default FoodScreen;

//API Integration:
//One of the significant challenge during the development phase of the Food Search Page was to identify the correct and reliable API.
//Initially, I tried Nutritionix API and USDA FoodData Central API.
//However, these 2 API I experienced slow responding when I request from their API.
//As a result, i need to find another API that is more suitable to deliver the necessary nutritional details for my requirements.
//As a result I switch around with different APIs and testing different ones for performance
//and Edamam API provides a good balance between the depth of nutritional data and the speed of responses.

//Displaying Nutritional Information:
//One of the challenge that I faced is after retrieving the food data,
//parsing the JSON response to display the nutritional information is a challenge
//as some of the food does not have certain nutritional data which could led to error or blank field in the UI.
//As a result, I need to ensure data validation for missing or incomplete nutritional values before putting them into key.

//UI Responsiveness in Dark Mode.
//One of the challenge that i faced is to change the page to dark mode when the button is toggle on home page.
//Implementing dynamic theme switcher while ensuring the Food Search Page is fully responsive across the whole devices.
//
