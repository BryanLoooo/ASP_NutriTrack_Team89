// Food.js
//import libraries
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

//Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  foodItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
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
  },
  macroInput: {
    flex: 2,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

const FoodScreen = () => {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");

  const appId = "106a2498"; // Replace with your Edamam App ID
  const apiKey = "d444d58428c68ef47c2f7f97014c0027"; // Replace with your Edamam API Key

  const fetchFoodData = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${apiKey}&ingr=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      setFoods([{ ...data, food_name: query }]);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    calculateNutrients(food);
  };

  const calculateNutrients = (food) => {
    const carbNutrient = food.totalNutrients.CHOCDF ? food.totalNutrients.CHOCDF.quantity : 0;
    const fatNutrient = food.totalNutrients.FAT ? food.totalNutrients.FAT.quantity : 0;
    const proteinNutrient = food.totalNutrients.PROCNT ? food.totalNutrients.PROCNT.quantity : 0;
    const caloriesNutrient = food.calories ? food.calories : 0;

    setCarbs(carbNutrient.toFixed(1));
    setFats(fatNutrient.toFixed(1));
    setProtein(proteinNutrient.toFixed(1));
    setCalories(caloriesNutrient.toFixed(1));
  };

  const handleSearch = () => {
    if (query.length > 0) {
      fetchFoodData();
    } else {
      setFoods([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search for food</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg:100g of chicken thigh"
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
            title="Back to Search"
            onPress={() => setSelectedFood(null)}
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
  );
};

//export FoodScreen as an external module for referencing
export default FoodScreen;
