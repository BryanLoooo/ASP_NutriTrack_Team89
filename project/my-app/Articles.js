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
    // Style for footer navigation bar
    footer: {
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      backgroundColor: themes[theme].backgroundColor,
      borderTopWidth: 1,
      borderColor: themes[theme].borderColor,
      left: 0,
      right: 0,
      bottom: 0,
    },
    // Style for buttons within the footer
    footerButton: {
      alignItems: "center",
    },
    // Style for icons within footer buttons
    footerButtonIcon: {
      width: 28,
      height: 28,
      marginBottom: 5,
    },
    // Text style for footer buttons
    footerButtonText: {
      fontSize: 12,
      color: themes[theme].textColor,
    },
  });

// Main component for displaying articles
const ArticlesScreen = ({ navigation }) => {
  const [theme, setTheme] = useState("light"); // State for managing theme
  const styles = getStyles(theme); // Get styles based on the current theme
  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const [articles, setArticles] = useState([]); // State for storing articles
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  const handleLike = async (articleUuid) => {
    const updatedArticles = articles.map((article) => {
      if (article.uuid === articleUuid) {
        return { ...article, likes: article.likes + 1 };
      }
      return article;
    });

    try {
      await AsyncStorage.setItem("articles", JSON.stringify(updatedArticles));
      setArticles(updatedArticles);
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
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const savedArticles = await AsyncStorage.getItem("articles");
        if (savedArticles) {
          setArticles(JSON.parse(savedArticles));
        } else {
          // Fetch from API if no data in local storage
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

      <Text>Article</Text>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Feedback")}
        >
          <Image
            source={
              theme === "light"
                ? require("../../project/my-app/assets/Feedback.png")
                : require("../../project/my-app/assets/FeedbackDark.png")
            }
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Articles")}
        >
          <Image
            source={
              theme === "light"
                ? require("../../project/my-app/assets/Articles.png")
                : require("../../project/my-app/assets/ArticlesDark.png")
            }
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Article</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={
              theme === "light"
                ? require("../../project/my-app/assets/Home.png")
                : require("../../project/my-app/assets/HomeDark.png")
            }
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Social")}
        >
          <Image
            source={
              theme === "light"
                ? require("../../project/my-app/assets/Social.png")
                : require("../../project/my-app/assets/SocialDark.png")
            }
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Food")}
        >
          <Image
            source={
              theme === "light"
                ? require("../../project/my-app/assets/Food.png")
                : require("../../project/my-app/assets/FoodDark.png")
            }
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//export ArticleScreen as an external module for referencing in other parts of the app
export default ArticlesScreen;
