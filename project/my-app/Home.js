//Home.js
//import libraries and dependencies
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import Footer from "./Footer";

//stylesheet for different user interface elements, it accomodates for both light and dark themes
const styles = StyleSheet.create({
  // Common styles for all themes
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    marginBottom: -20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  titleImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
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
    height: "100%",
    backgroundColor: "green",
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

  // Light mode for specific styles
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
      marginTop: -20,
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
      justifyContent: "flex-end",
    },
    limitText: {
      textAlign: "right",
    },
    postContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      marginTop: 15,
    },
    postButton: {
      width: "100%",
      padding: 8,
      backgroundColor: "green",
      alignItems: "center",
      borderRadius: 10,
    },
    postButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  },

  // Dark mode for specfic styles
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
      marginTop: -20,
    },
    activityButtonText: {
      color: "white",
      textAlign: "center",
    },
    limitContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    limitText: {
      textAlign: "right",
      color: "white",
    },
    postContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      marginTop: 15,
    },
    postButton: {
      width: "100%",
      padding: 8,
      backgroundColor: "black",
      alignItems: "center",
      borderRadius: 10,
    },
    postButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  },
});

//Main homescreen2 component
const HomeScreen2 = ({ navigation }) => {
  try {

    // Test case 1 Successfully renders homescreen2 component
    console.log("Home screen page has been executed successfully");

    //get the current page theme and theme toggler from context
    const { theme, toggleTheme } = useTheme();

    //state the variables for tracking selected article
    const [selectedArticle] = useState(null);

    //state the variables for tracking selected nutrients information
    const [caloriesGoal] = useState(3000);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFats, setTotalFats] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);

    //set the maximum calories per day
    const maxCalories = 4000;

    //function to fetch stored nutrients information from AsyncStorage
    const fetchTotalNutrients = async () => {
      try {

        // Test case 8 fetch total nutrients information, displays an attempt to retrieve nutrients information
        console.log("Retrieving total nutrients information");
        const savedNutrients = await AsyncStorage.getItem("totalNutrients");

        //if nutrients information found display and update the information
        if (savedNutrients) {
          const parsedNutrients = JSON.parse(savedNutrients);
          setTotalCarbs(parsedNutrients.carbs);
          setTotalFats(parsedNutrients.fats);
          setTotalProtein(parsedNutrients.protein);

          //checks if the current totalCalories is within the range
          if (totalCalories > 4000) {
            Alert.alert("Max calories for the day have been reached.");

            // Test case 6 daily calorie goal reached alert
            console.log("Max limit for the day has been reached");
          } else if (totalCalories < 4000) {
            setTotalCalories(parsedNutrients.calories);

            // Test case 7 daily calorie goal not reached
            console.log(
              "Limit for the day has not been reached. Calories added."
            );
          } else {
            console.log("No food information has been logged");
          }

          // Test case 8 fetch total nutrients information
          console.log(
            "Successfully retrieved and update total nutrients information"
          );

          //returns a failed message if there is no nutrients information
        } else {

          // Test case 9 fetch total nutrients information set to 0
          console.log(
            "Current nutrients information is all set to 0. Please add food items to see updated information"
          );
        }
      } catch (error) {

        // Test case 8 fetch total nutrients information, returns failure text if the nutrients information has not been retrieved
        console.error(
          "Failed. Error retrieving total nutrients information. Error description: ",
          error
        );
      }
    };

    //useEffect function used to set the nutrients information to 0
    useEffect(() => {
      const resetDataOnStart = async () => {
        try {

          // Test case 10 reset nutrients information, displays an attempt to reset nutrients information
          console.log("Reset nutrients information back to 0");
          await AsyncStorage.removeItem("totalNutrients");

          // Test case 10 reset nutrients information, upon successful information reset prints confirmation text
          console.log("Successfully reset nutrients information");

          //returns a failed message if the nutrients information to reset
        } catch (error) {

          // Test case 10 reset nutrients information, returns failure text when nutrients information to reset
          console.error(
            "Failed. Error resetting nutrients information. Error description: ",
            error
          );
        }
      };

      //function call to reset the nutrients information set to 0
      resetDataOnStart();

      //function call to fetch nutrients information and display it
      fetchTotalNutrients();
    }, []);

    //useFocusEffect function is used to fetch information when the screen comes into focus
    useFocusEffect(
      useCallback(() => {
        try {
          console.log("Fetching total nutrients information using focus");
          fetchTotalNutrients();

          console.log("Successfully fetched total nutrients information");

          //returns and error of the function did not work as expected
        } catch (error) {
          console.error(
            "Failed. Error during focus effect. Error description:",
            error
          );
        }
      }, [])
    );

    // Check if calories exceed the maximum allowed
    if (totalCalories > 3000) {
      //returns an alert on the user interface when the user has consumed more than the daily set goal
      Alert.alert(
        "Reminder, calories for the day have been reached. Don't give up!"
      );
      console.log("Calories set for the day has been reached.");

      //if the total daily set calories are within range, no alert is generated and the user can continue insertion
    } else {
      console.log(
        "Calories for the day are still within range. User can continue consuming calories."
      );
    }

    //dataset for the list of articles for the user to explore
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

    //dataset for the list of caloriesData for the past week
    const calorieData = {
      Monday: 1800,
      Tuesday: 2500,
      Wednesday: 3200,
      Thursday: 2900,
      Friday: 1500,
      Saturday: 3700,
      Sunday: 2200,
    };

    // return the JSX elements that make up the user interface
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles[theme].container}>
          <View style={styles[theme].header}>
            <View style={styles.headerInner}>
              <Image
                source={require("../my-app/assets/logoHome.png")}
                style={styles.titleImage}
              />
              <TouchableOpacity
                style={styles[theme].themeButton}
                onPress={() => {
                  try {

                    // Test case 2 theme toggle functionality dark theme
                    // Test case 3 theme toggle functionality light theme
                    console.log("Theme button has been triggered");
                    toggleTheme();
                  } catch (error) {
                    console.error(

                      //Test case 2 theme toggle functionality dark theme, returns failure text if the toggle theme function does not work
                      //Test case 3 theme toggle functionality light theme, returns failure text if the toggle theme function does not work
                      "Failed. Error toggling theme. Error description:",
                      error
                    );
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
                    selectedArticle === article.title &&
                      styles.selectedArticleButton,
                  ]}
                  onPress={() => {
                    try {
                      // Displays a console text to show an attempt to navigate to article screen
                      console.log(`Navigating to ${article.title} article`);
                      navigation.navigate("Articles");

                      // Test case 4 navigate to articles screen
                      console.log(
                        "Successfully navigation to selected article"
                      );
                    } catch (error) {

                      // Test case 4 navigate to articles screen, returns failure text if navigation to articles screen does not work 
                      console.error(
                        "Failed. Error navigating to articles. Error description: ",
                        error
                      );
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

                  // Displays a console text to show an attempt to navigate to social screen
                  console.log("Navigating to social page");
                  navigation.navigate("Social");

                  // Test case 5 navigate to social screen
                  console.log("Successful navigation to social page");
                } catch (error) {

                  //Test case 5 navigate to social screen, returns failure text if navigation to social screen does not work 
                  console.error(
                    "Failed. Error navigating to social page. Error description: ",
                    error
                  );
                }
              }}
            >
              <Text style={styles[theme].postButtonText}>+ Add post</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles[theme].dailyTitle}>Today's progress: </Text>
          <View style={styles[theme].dailyProgressContainer}>
            <View style={styles.dailyProgressBar}>
              <View
                style={[
                  styles.dailyProgressFill,
                  {
                    width: `${(totalCalories / maxCalories) * 100}%`,
                    backgroundColor: totalCalories > 3000 ? "red" : "green",
                    maxWidth: "100%",
                  },
                ]}
              />
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
              <Text style={styles[theme].dailyProgressText}>
                Protein: {totalProtein}g
              </Text>
              <Text style={styles[theme].dailyProgressText}>
                Fats: {totalFats}g
              </Text>
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
                    {
                      backgroundColor: calories > 3000 ? "red" : "green",
                      width: `${(calories / 5000) * 100}%`,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <Footer theme={theme} navigation={navigation} />
      </SafeAreaView>
    );
  } catch {
    // Test case 1 Successfully renders homescreen 2 component, returns failure text in console if homescreen2 component is not able to render
    console.log("Failed to load home screen page. Please try again");
  }
};
// export HomeScreen as a external module for referencing
export default HomeScreen2;
