//Article.js
//import libraries
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "./ThemeContext";
import Footer from "./Footer";

// Define theme settings for light and dark modes
const themes = {
  light: {
    backgroundColor: "#fff",
    textColor: "#333",
    borderColor: "#ccc",
    linkColor: "blue",
  },
  dark: {
    backgroundColor: "#333",
    textColor: "#fff",
    borderColor: "#888",
    linkColor: "lightblue",
  },
};

// Dynamic stylesheet function that adjusts styles based on the current theme
const getStyles = (theme) =>
  StyleSheet.create({
    // Styles for loading container with centered content
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    // Container for theme toggle button
    themeButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
    },
    // Button for toggling theme
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    // Text style for theme button
    themeButtonText: {
      fontSize: 30,
      fontWeight: "bold",
      paddingLeft: 10,
      color: themes[theme].textColor,
    },
    // Style for theme button image
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    // Main container style that applies theme background color
    container: {
      flex: 1,
      padding: 15,
      paddingBottom: 110,
      marginBottom: 45,
      backgroundColor: themes[theme].backgroundColor,
    },
    // Style for individual article containers
    articleContainer: {
      marginBottom: 30,
      padding: 15,
      borderWidth: 1,
      borderColor: themes[theme].borderColor,
      borderRadius: 5,
    },
    // Style for article titles
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themes[theme].textColor,
    },
    // Style for article descriptions
    description: {
      fontSize: 14,
      color: themes[theme].textColor,
      marginVertical: 5,
    },
    // Style for article images
    image: {
      width: "100%",
      height: 200,
      borderRadius: 5,
      marginVertical: 5,
    },
    // Style for links within articles
    linkText: {
      color: themes[theme].linkColor,
      textDecorationLine: "underline",
      padding: 3,
    },

    likeButtonImage: {
      width: 25,
      height: 25,
      marginTop: 8,
      margin: 5,
    },
    likeButtonText: {
      color: themes[theme].textColor,
    },
  });

// Main component for displaying articles
const ArticlesScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const styles = getStyles(theme); // Get styles based on the current theme
  const [articles, setArticles] = useState([]); // State for storing articles
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  const handleLike = async (articleUuid) => {
    // To test function works correctly
    // TC001: The like count of the article with the specified UUID should increase by 1.
    console.log("Handling like for article:", articleUuid);
    const updatedArticles = articles.map((article) => {
      if (article.uuid === articleUuid) {
        return { ...article, likes: article.likes + 1 };
      }
      return article;
    });

    // error handling
    try {
      await AsyncStorage.setItem("articles", JSON.stringify(updatedArticles));
      setArticles(updatedArticles);
      // To test function works correctly
      // TC002: Verify that the articles are updated in the local storage without any errors.
      console.log("Updated articles with new likes:", updatedArticles);
    } catch (error) {
      console.error("Error saving articles to local storage: ", error);
    }
  };

  // URL endpoints for fetching articles
  const URL1 =
    "https://api.thenewsapi.com/v1/news/all?api_token=D4XLcRT7aQVnR41gRqClICAQQGRQyGvje7x5KVnD&search=calories+count";

  const URL2 =
    "https://api.thenewsapi.com/v1/news/all?api_token=D4XLcRT7aQVnR41gRqClICAQQGRQyGvje7x5KVnD&search=healthy+lifestyle";

  // Effect hook for fetching data from APIs
  useEffect(() => {
    // To test function works correctly
    // TC003: Check that the component initializes and starts the article fetching process correctly.
    console.log("Component mounted, starting to fetch articles...");
    const loadArticles = async () => {
      setIsLoading(true);
      // error handling
      try {
        const savedArticles = await AsyncStorage.getItem("articles");
        if (savedArticles) {
          setArticles(JSON.parse(savedArticles));
          // To test function works correctly
          // TC004: Verify that articles load correctly from local storage.
          console.log("Loaded articles from local storage.");
        } else {
          // Fetch from API if no data in local storage
          // To test function works correctly
          // TC005: Verify the behavior when no articles are in local storage, ensuring API fetch occurs.
          console.log("No articles in local storage, fetching from API.");
          await fetchDataFromAPI();
        }
      } catch (error) {
        console.error("Error loading articles from local storage: ", error);
        // Optionally try fetching from API if local storage fails
        await fetchDataFromAPI();
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const fetchDataFromAPI = async () => {
    // To test function works correctly
    // TC006: Ensure that data fetching from the API executes correctly and that results are parsed and stored without errors.
    console.log("Fetching data from API...");
    // error handling
    try {
      const responses = await Promise.all([fetch(URL1), fetch(URL2)]);
      const jsonResponses = await Promise.all(
        responses.map((response) => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
      );
      const fetchedArticles = jsonResponses.flatMap((json) =>
        json.data.map((article) => ({ ...article, likes: 0 }))
      );
      setArticles(fetchedArticles);
      // Save fetched articles to local storage
      await AsyncStorage.setItem("articles", JSON.stringify(fetchedArticles));
      // To test function works correctly
      // TC007: Verify that new articles fetched from the API are correctly added to local storage.
      console.log("Fetched and stored new articles:", fetchedArticles);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Render loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Main component rendering
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.themeButtonContainer}>
          <Text style={styles.themeButtonText}>Top Articles</Text>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Image
              style={styles.themeButtonImage}
              source={
                theme === "light"
                  ? require("../../project/my-app/assets/Sun.png")
                  : require("../../project/my-app/assets/Moon.png")
              }
            />
          </TouchableOpacity>
        </View>
        {articles.map((article) => (
          <View key={article.uuid} style={styles.articleContainer}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description}>{article.description}</Text>
            <Image source={{ uri: article.image_url }} style={styles.image} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("WebView", { url: article.url })
              }
            >
              <Text style={styles.linkText}>Read More</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLike(article.uuid)}>
              <Image
                source={
                  theme === "light"
                    ? require("../../project/my-app/assets/like.png")
                    : require("../../project/my-app/assets/LikeDarkMode.png")
                }
                style={styles.likeButtonImage}
              />
            </TouchableOpacity>
            <Text style={styles.likeButtonText}>{article.likes} likes</Text>
          </View>
        ))}
      </ScrollView>
      <Text>Articles</Text>
      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

//export ArticleScreen as an external module for referencing in other parts of the app
export default ArticlesScreen;


// Asynchronous Data Handling

// Challenge: Managing asynchronous operations such as fetching data from an API or 
// local storage can lead to race conditions or inconsistencies in state.

// Solution: Use async/await consistently and handle all promises properly to ensure that 
// operations complete in the expected order. Utilizing try/catch blocks within async functions 
// helps manage errors effectively. The use of useEffect with an empty dependency array ensures 
// operations are performed right after the component mounts, reducing timing issues.

// Dynamic Theme Handling

// Challenge: Ensuring data like article likes and fetched articles persist across app restarts.

// Solution: Using a context (useTheme) to handle theme changes ensures that the theme data flows through the component 
// tree without unnecessary re-renders. The context provider at the app level can manage theme states and propagate 
// changes efficiently.

// Data Persistence

// Challenge: Ensuring data like article likes and fetched articles persist across app restarts.

// Solution: Utilizing AsyncStorage to save and retrieve articles ensures that user data like article 
// likes persists even when the app is closed and reopened. Handling JSON data serialization and parsing 
// carefully prevents data corruption.

// Managing Navigation and User Interactions

// Challenge: Handling navigation and interactions like liking an article or reading more about it 
// without introducing bugs in the navigation flow or state management.

// Solution: Using React Navigation effectively, ensuring that navigation props are passed correctly 
// and that routes are defined clearly. Additionally, updating the articles state immediately when a like button 
// is pressed ensures the UI is responsive and reflects changes instantly.