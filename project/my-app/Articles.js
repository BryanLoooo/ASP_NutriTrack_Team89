//Article.js
//import libraries
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";

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

//Stylesheet
const getStyles = (theme) =>
  StyleSheet.create({
    themeButtonContainer: {
      flexDirection: "row", // Horizontal layout
      justifyContent: "space-between", // Align children to the right
      alignItems: "center",
      paddingBottom: 10, // Padding to ensure the button does not touch the edges
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    themeButtonText: {
      fontSize: 30,
      fontWeight: "bold",
      paddingLeft: 10,
      color: themes[theme].textColor, // Adjust color based on your theme
    },
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    container: {
      flex: 1,
      padding: 15,
      paddingBottom: 100,
      marginBottom: 50,
      backgroundColor: themes[theme].backgroundColor,
    },
    articleContainer: {
      marginBottom: 30,
      padding: 20,
      borderWidth: 1,
      borderColor: themes[theme].borderColor,
      borderRadius: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themes[theme].textColor,
    },
    description: {
      fontSize: 14,
      color: themes[theme].textColor,
      marginVertical: 5,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 5,
      marginVertical: 5,
    },
    linkText: {
      color: themes[theme].linkColor,
      textDecorationLine: "underline",
    },
    footer: {
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      backgroundColor: themes.light.backgroundColor,
      borderTopWidth: 1,
      borderColor: themes.light.borderColor,
      left: 0,
      right: 0,
      bottom: 0,
    },
    footerButton: {
      alignItems: "center",
    },
    footerButtonIcon: {
      width: 24,
      height: 24,
      marginBottom: 5,
    },
    footerButtonText: {
      fontSize: 12,
      color: themes.light.textColor,
    },
  });

const ArticlesScreen = ({ navigation }) => {
  const [theme, setTheme] = useState("light");
  const styles = getStyles(theme); // Get styles based on the current theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const [articles, setArticles] = useState([]);

  const URL1 =
    "https://api.thenewsapi.com/v1/news/all?api_token=D4XLcRT7aQVnR41gRqClICAQQGRQyGvje7x5KVnD&search=calories+count";

  const URL2 =
    "https://api.thenewsapi.com/v1/news/all?api_token=D4XLcRT7aQVnR41gRqClICAQQGRQyGvje7x5KVnD&search=healthy+lifestyle";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([fetch(URL1), fetch(URL2)]);
        // Convert both responses to JSON concurrently
        const jsonResponses = await Promise.all(
          responses.map((response) => response.json())
        );
        const fetchedArticles = jsonResponses.flatMap((json) => json.data);

        // Set the combined articles into state
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

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
            source={require("../../project/my-app/assets/Feedback.png")}
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Articles")}
        >
          <Image
            source={require("../../project/my-app/assets/Articles.png")}
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Article</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../../project/my-app/assets/Home.png")}
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Social")}
        >
          <Image
            source={require("../../project/my-app/assets/Social.png")}
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Food")}
        >
          <Image
            source={require("../../project/my-app/assets/Food.png")}
            style={styles.footerButtonIcon}
          />
          <Text style={styles.footerButtonText}>Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
//export ArticleScreen as an external module for referencing
export default ArticlesScreen;
