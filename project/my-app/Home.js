//Home.js
//import libraries and dependencies
import React, { useState,  useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import Footer from "./Footer";

//stylesheet for user interface elements
const styles = StyleSheet.create({

  // Common styles that are used both in light and dark mode
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  titleImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  articleList: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  articleButton: {
    padding: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  selectedArticleButton: {
    backgroundColor: "#00a8ff",
  },
  articleButtonText: {
    color: "black",
    padding: 5,
  },
  articleImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 1,
  },
  activityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedActivityButton: {
    backgroundColor: "#00a8ff",
  },
  activityImage: {
    width: 70,
    height: 50,
  },
  dailyProgressBar: {
    height: 10,
    borderRadius: 20,
    backgroundColor: "grey",
  },
  dailyProgressFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 10,
  },
  historyProgressFill: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "#00a8ff",
  },
  historyProgressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 100,
  },

  // Light mode user interface elements
  light: {
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      padding: 20,
      backgroundColor: "white",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 1,
      borderColor: "black",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    historyProgressItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      backgroundColor: "#fff",
      elevation: 2,
      marginBottom: 10,
    },
    historyProgressText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
    },
    dailyProgressText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
    },
    dailyTitle: {
      fontSize: 20,
      marginLeft: 20,
      fontWeight: "bold",
      color: "black",
      marginTop: 20,
    },
    dailyProgressContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    statsContainer: {
      padding: 20,
      marginTop: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 2,
    },
    statsText: {
      fontSize: 16,
      marginBottom: 5,
    },
    activityButtonText: {
      color: "black",
      textAlign: "center",
    },
    limitContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    limitText: {
      textAlign: 'right',
    },
    postContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      marginTop: 15,
    },
    postButton: {
      width: '100%',
      padding: 8,
      backgroundColor: 'green',
      alignItems: 'center',
      borderRadius: 10,
    },
    postButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },

  // Dark mode user interface elements
  dark: {
    container: {
      flex: 1,
      backgroundColor: "#333",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    historyProgressItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      backgroundColor: "black",
      elevation: 2,
      marginBottom: 10,
    },
    historyProgressText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    dailyProgressText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    dailyTitle: {
      fontSize: 20,
      marginLeft: 20,
      fontWeight: "bold",
      color: "white",
      marginTop: 20,
    },
    dailyProgressContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    statsContainer: {
      padding: 20,
      marginTop: 20,
      backgroundColor: "black",
      borderRadius: 10,
      elevation: 2,
    },
    statsText: {
      fontSize: 16,
      marginBottom: 5,
    },
    header: {
      padding: 20,
      backgroundColor: "#FF7900",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 1,
      borderColor: "#666",
    },
    activityButtonText: {
      color: "white",
      textAlign: "center",
    },
    limitContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    limitText: {
      textAlign: 'right',
      color: 'white',
    },
    postContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      marginTop: 15,
    },
    postButton: {
      width: '100%',
      padding: 8,
      backgroundColor: 'black',
      alignItems: 'center',
      borderRadius: 10,
    },
    postButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
});

// Homescreen componenet
const HomeScreen2 = ({ navigation }) => {

  //get the current theme and theme toggler from context
  const { theme, toggleTheme } = useTheme();

  //state variables for tracking selected articles
  const [selectedArticle] = useState(null);

  //state variables for tracking nutrient data
  const [caloriesGoal] = useState(3000);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  //set the max calories for progress bar
  const maxCalories = 4000;

  //function to fetch stored nutrient data from AsyncStorage
  const fetchTotalNutrients = async () => {

    //try to retrieve nutrients information and display it on user interface
    try {
      console.log("Retrieving total nutrients information");
      const savedNutrients = await AsyncStorage.getItem("totalNutrients");

      if (savedNutrients) {
        const parsedNutrients = JSON.parse(savedNutrients);
        setTotalCarbs(parsedNutrients.carbs);
        setTotalFats(parsedNutrients.fats);
        setTotalProtein(parsedNutrients.protein);

        //check if the totalCalories display falls into any of the conditions
        if(totalCalories > 4000){
          Alert.alert("Max calories for the day have been reached.");
          console.log("Max limit for the day has been reached");

        }else if(totalCalories < 4000){
          setTotalCalories(parsedNutrients.calories);
          console.log("Limit for the day has not been reached. Calories added.");

        }else{
          console.log("No food information has been logged");
        }
        
        console.log("Successfully retrieved and update total nutrients information");

      } else {
        console.log("Failed. No nutrients information found");
      }
    } catch (error) {
      console.error("Failed. Error retrieving total nutrients information. Error description: ", error);
    }
  };

  //useEffect to reset the nutrients information
  useEffect(() => {
    const resetDataOnStart = async () => {
      try {
        console.log("Reset nutrients information back to 0");
        await AsyncStorage.removeItem("totalNutrients");
        console.log("Successfully reset nutrients information");

      } catch (error) {
        console.error("Failed. Error resetting nutrients information. Error description: ", error);
      }
    };

    //calls the function to reset the nutrients information
    resetDataOnStart();

    //calls the function to retrieve all the nutrients information
    fetchTotalNutrients();
  }, []
);

  //useFocusEffect is used to fetch information data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      try {

        console.log("Fetching total nutrients information using focus");
        fetchTotalNutrients();
        console.log("Successfully fetched total nutrients information");

      } catch (error) {
        console.error("Failed. Error during focus effect. Error description:", error);
      }
    }, [])
  );

  // Check if calories exceed the maximum allowed
  if (totalCalories > 3000) {

    Alert.alert("Reminder, calories for the day have been reached. Don't give up!");
    console.log("Calories set for the day has been reached.");

  } else {

    console.log("Calories for the day are still within range. User can continue consuming calories.");
  }

  //dataset of the list of articles to display on the screen
  const articles = [
    {
      title: "How to eat healthy",
      image: require("../my-app/assets/Article1.png"),
    },
    {
      title: "Regular exercise helps",
      image: require("../my-app/assets/Article2.png"),
    },
    {
      title: "Balanced diet",
      image: require("../my-app/assets/Article3.png"),
    },
    {
      title: "Community and unity",
      image: require("../my-app/assets/Article4.png"),
    },
    {
      title: "Importance of health",
      image: require("../my-app/assets/Article5.png"),
    },
  ];

  //dataset of the list of calories for the week
  const calorieData = {
    Monday: 1800,
    Tuesday: 2500,
    Wednesday: 3200,
    Thursday: 2900,
    Friday: 1500,
    Saturday: 3700,
    Sunday: 2200,
  };

  // return the JSX elements that make up the User Interface
  return (
    <ScrollView style={styles[theme].container}>
      <View style={styles[theme].header}>
        <View style={styles.headerInner}>
          <Image source={require("../my-app/assets/logoHome.png")} style={styles.titleImage} />
          <TouchableOpacity
            style={styles[theme].themeButton}
            onPress={() => {
              try {
                console.log("Theme button has been triggered");
                toggleTheme();
              } catch (error) {
                console.error("Failed. Error toggling theme. Error description:", error);
              }
            }}
          >
            <Image
              source={
                theme === "light"
                  ? require("../../project/my-app/assets/Sun.png")
                  : require("../../project/my-app/assets/Moon.png")
              }
              style={styles[theme].themeButtonImage}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.articleList}
        >
          {articles.map((article) => (
            <TouchableOpacity
              key={article.title}
              style={[
                styles.articleButton,
                selectedArticle === article.title && styles.selectedArticleButton,
              ]}
              onPress={() => {
                try {
                  console.log(`Navigating to ${article.title} article`);
                  navigation.navigate("Articles");
                  console.log("Successfully navigation to selected article")
                } catch (error) {
                  console.error("Failed. Error navigating to articles. Error description: ", error);
                }
              }}
            >
              <Image source={article.image} style={styles.articleImage} />
              <Text style={styles.articleButtonText}>{article.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles[theme].postContainer}>
        <TouchableOpacity 
          style={styles[theme].postButton} 
          onPress={() => {
            try {
              console.log("Navigating to social page");
              navigation.navigate("Social");
              console.log("Successful navigation to social page")
            } catch (error) {
              console.error("Failed. Error navigating to social page. Error description: ", error);
            }
          }}
        >
          <Text style={styles[theme].postButtonText}>+ Add post</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles[theme].dailyTitle}>Today's progress: </Text>
      <View style={styles[theme].dailyProgressContainer}>
        <View style={styles.dailyProgressBar}>
          <View style={[styles.dailyProgressFill, { width: `${(totalCalories / maxCalories) * 100}%`, backgroundColor: totalCalories > 3000 ? "red" : "green", maxWidth: "100%" }]} />
        </View>
        <View style={styles[theme].limitContainer}>
          <Text style={styles[theme].limitText}>
              Daily limit: {caloriesGoal} cals
          </Text>
          <Text style={styles[theme].limitText}>
              Max: {maxCalories} cals
          </Text>
      </View>
        <View style={styles[theme].statsContainer}>
          <Text style={styles[theme].dailyProgressText}>
            Calories: {totalCalories} cals
          </Text>
          <Text style={styles[theme].dailyProgressText}>
            Goal: {caloriesGoal} cals
          </Text>
          <Text style={styles[theme].dailyProgressText}>Protein: {totalProtein}g</Text>
          <Text style={styles[theme].dailyProgressText}>Fats: {totalFats}g</Text>
          <Text style={styles[theme].dailyProgressText}>
            Carbohydrates: {totalCarbs}g
          </Text>
        </View>
      </View>

      <View style={styles.historyProgressContainer}>
        {Object.entries(calorieData).map(([day, calories]) => (
          <View style={styles[theme].historyProgressItem} key={day}>
            <Text style={styles[theme].historyProgressText}>{day}</Text>
            <View
              style={[
                styles.historyProgressFill,
                { backgroundColor: calories > 3000 ? "red" : "green", width: `${(calories / 5000) * 100}%` },
              ]}
            />
          </View>
        ))}
      </View>
      <Footer theme={theme} navigation={navigation} />
    </ScrollView>
  );
};

// export HomeScreen2 as a external module for referencing
export default HomeScreen2;
