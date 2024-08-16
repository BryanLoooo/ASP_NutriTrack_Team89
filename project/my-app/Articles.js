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

//Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    marginBottom: 80,
  },
  articleContainer: {
    marginBottom: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginVertical: 5,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
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
  },
});

const ArticlesScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  const URL =
    "https://api.thenewsapi.com/v1/news/all?api_token=pP8Y5NTCGT4yRW0p9ka3uUa12yvmA0H79U8aC7Iz&search=calories+count";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const json = await response.json();
        setArticles(json.data); // Assuming the data is in the 'data' field of the JSON
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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
