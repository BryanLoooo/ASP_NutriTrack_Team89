import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

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

const getStyles = (theme) =>
  StyleSheet.create({
    footer: {
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme.backgroundColor,
      borderTopWidth: 1,
      borderColor: theme.borderColor,
      left: 0,
      right: 0,
      bottom: 0,
    },
    footerButton: {
      alignItems: "center",
    },
    footerButtonIcon: {
      width: 28,
      height: 28,
      marginBottom: 5,
    },
    footerButtonText: {
      fontSize: 12,
      color: theme.textColor,
    },
  });

const Footer = ({ theme, navigation }) => {
  const styles = getStyles(themes[theme]);

  return (
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
  );
};

export default Footer;
