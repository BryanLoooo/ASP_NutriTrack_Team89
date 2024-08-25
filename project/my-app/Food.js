import React, { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for local storage
import { useTheme } from "./ThemeContext"; // Import custom ThemeContext for theming
import Footer from './Footer.js'; // Adjust the path based on your project structure

// Define theme settings for light and dark modes
const themes = {
  light: {
    backgroundColor: "#fff",
    textColor: "#333",
    borderColor: "#ccc",
    linkColor: "blue",
    placeholderColor: "#888", // Add placeholder color for light theme
  },
  dark: {
    backgroundColor: "#333",
    textColor: "#fff",
    borderColor: "#888",
    linkColor: "lightblue",
    placeholderColor: "#aaa", // Add placeholder color for dark theme
  },
};

// Dynamic stylesheet function that adjusts styles based on the current theme
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingBottom: 110, // Leave space for the footer
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

const FoodScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Get the current theme
  const styles = getStyles(theme); // Get styles based on the current theme

  const [query, setQuery] = useState(""); // State for search query input
  const [foods, setFoods] = useState([]); // State for storing fetched food items
  const [selectedFood, setSelectedFood] = useState(null); // State for the selected food item
  const [carbs, setCarbs] = useState(""); // State for storing carbs
  const [fats, setFats] = useState(""); // State for storing fats
  const [protein, setProtein] = useState(""); // State for storing protein
  const [calories, setCalories] = useState(""); // State for storing calories

  const appId = "106a2498"; // Edamam App ID
  const apiKey = "d444d58428c68ef47c2f7f97014c0027"; // Edamam API Key

  // Fetch food data from the Edamam API based on the query
  const fetchFoodData = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${apiKey}&ingr=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      setFoods([{ ...data, food_name: query }]); // Set the fetched food data
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  // Handle food selection and calculate nutrient details
  const selectFood = (food) => {
    setSelectedFood(food);
    calculateNutrients(food);
  };

  // Calculate nutrient values for the selected food
  const calculateNutrients = (food) => {
    const carbNutrient = food.totalNutrients.CHOCDF ? food.totalNutrients.CHOCDF.quantity : 0;
    const fatNutrient = food.totalNutrients.FAT ? food.totalNutrients.FAT.quantity : 0;
    const proteinNutrient = food.totalNutrients.PROCNT ? food.totalNutrients.PROCNT.quantity : 0;
    const caloriesNutrient = food.calories ? food.calories : 0;

    setCarbs(carbNutrient.toFixed(1)); // Set carbs with one decimal precision
    setFats(fatNutrient.toFixed(1)); // Set fats with one decimal precision
    setProtein(proteinNutrient.toFixed(1)); // Set protein with one decimal precision
    setCalories(caloriesNutrient.toFixed(1)); // Set calories with one decimal precision
  };

  // Save the selected food's nutrient data to AsyncStorage
  const saveFood = async () => {
    const currentNutrients = {
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      protein: parseFloat(protein),
      calories: parseFloat(calories),
    };

    try {
      const savedNutrients = await AsyncStorage.getItem("totalNutrients");
      let updatedNutrients = {
        carbs: 0,
        fats: 0,
        protein: 0,
        calories: 0,
      };

      // Update nutrients if there are already saved nutrients
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

      await AsyncStorage.setItem("totalNutrients", JSON.stringify(updatedNutrients));

      // Show success alert
      Alert.alert("Success", "Food has been saved successfully!");

    } catch (error) {
      console.error("Error saving food data:", error);
    }
  };

  // Handle food search action
  const handleSearch = () => {
    if (query.length > 0) {
      fetchFoodData();
    } else {
      setFoods([]); // Clear food list if the query is empty
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.label}>Search for food</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg:100g of chicken thigh"
          placeholderTextColor={themes[theme].placeholderColor} // Adjust the placeholder text color based on theme
          value={query}
          onChangeText={setQuery}
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
            <Button
              title="Save Food"
              onPress={saveFood}
            />
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

//export FoodScreen as an external module for referencing
export default FoodScreen;
