// Food.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  foodItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodDetails: {
    marginTop: 20,
  },
  macroContainer: {
    marginTop: 20,
  },
  macro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 16,
    flex: 1,
  },
  macroInput: {
    flex: 2,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  footerButtonText: {
    fontSize: 12,
  },
};

const FoodScreen = ({ navigation }) => {

  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState('100');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');

  const apiKey = '0z0jNkOe70ugdCHlz55RlQgxjTK3S8NxefRmcx3j';  // Replace with your actual API key

  useEffect(() => {
    if (query.length > 0) {
      fetchFoodData();
    } else {
      setFoods([]);
    }
  }, [query]);

  const fetchFoodData = async () => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      setFoods(data.foods);
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    setGrams('100');
    calculateNutrients(food, '100');
  };

  const calculateNutrients = (food, gramsValue) => {
    const gramsNum = parseInt(gramsValue, 10) || 100;
    const carbNutrient = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference');
    const fatNutrient = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)');
    const proteinNutrient = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein');
    const caloriesNutrient = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy');

    setCarbs(carbNutrient ? ((carbNutrient.value / 100) * gramsNum).toFixed(1) : '0');
    setFats(fatNutrient ? ((fatNutrient.value / 100) * gramsNum).toFixed(1) : '0');
    setProtein(proteinNutrient ? ((proteinNutrient.value / 100) * gramsNum).toFixed(1) : '0');
    setCalories(caloriesNutrient ? ((caloriesNutrient.value / 100) * gramsNum).toFixed(1) : '0');
  };

  useEffect(() => {
    if (selectedFood) {
      calculateNutrients(selectedFood, grams);
    }
  }, [grams]);

  return (
     <View style={styles.container}>
      <Text style={styles.label}>Search for food</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter food name"
        value={query}
        onChangeText={setQuery}
      />
      {selectedFood ? (
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{selectedFood.description}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter grams"
            value={grams}
            onChangeText={setGrams}
            keyboardType="numeric"
          />
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
          <Button title="Back to Search" onPress={() => setSelectedFood(null)} />
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.fdcId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.foodItem} onPress={() => selectFood(item)}>
              <Text style={styles.foodName}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Feedback')}>
          <Image source={require('../../project/my-app/assets/Feedback.png')} style={styles.footerButtonIcon} />
          <Text style={styles.footerButtonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Articles')}>
          <Image source={require('../../project/my-app/assets/Articles.png')} style={styles.footerButtonIcon} />
          <Text style={styles.footerButtonText}>Article</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../project/my-app/assets/Home.png')} style={styles.footerButtonIcon} />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Social')}>
          <Image source={require('../../project/my-app/assets/Social.png')} style={styles.footerButtonIcon} />
          <Text style={styles.footerButtonText}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Food')}>
          <Image source={require('../../project/my-app/assets/Food.png')} style={styles.footerButtonIcon} />
          <Text style={styles.footerButtonText}>Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FoodScreen;