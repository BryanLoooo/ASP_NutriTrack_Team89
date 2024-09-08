import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { addFeedback } from "./firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import Footer from "./Footer.js";

const getStyles = (theme) =>
  StyleSheet.create({
    // themes styling
    themeButtonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: 10,
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
    // style for the star rating container
    starContainer: {
      flexDirection: "row",
      marginBottom: 10,
    },
    // individual start
    star: {
      marginRight: 5,
    },
    container: {
      flex: 1,
    },
    containerInner: {
      flex: 1,
      padding: 20,
    },
    formContainer: {
      width: "100%",
    },
    // title style for form description
    title: {
      fontSize: 16,
      marginBottom: 10,
      color: theme === "light" ? "#000" : "#fff",
    },
    placeholder: {
      color: theme === "light" ? "#000" : "#fff",
    },
    // input field for feedback
    input: {
      height: 100,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      width: "90%",
      paddingHorizontal: 10,
      color: theme === "light" ? "#000" : "#fff",
    },
    error: {
      color: "red",
      marginBottom: 10,
    },
    // submitted feedback message
    submittedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    submittedText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
    },
  });

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

const FeedbackForm = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);

  // handle submission of feedback
  const handleSubmit = async () => {
    // if feedback is not empty and there is a rating from the user
    if (feedback.trim() && rating > 0) {
      // error handling
      try {
        await addFeedback({ feedback, rating });
        // test case 2: prints the submitted feedback and rating
        console.log("Submitted feedback:", feedback, "Rating:", rating);
        // after submitted the feedback, it should reset the feedback input field, rating and any error messages displayed
        setFeedback("");
        setRating(0);
        setError("");
        setSubmitted(true);
      } catch (error) {
        // if any error in submitted the feedback
        setError("Error submitting feedback. Please try again.");
      }
    }
    // ensure the feedback field is not empty before submitting
    else {
      // test case 4&5: prints the error message if either feedback or rating is left empty before submissions
      setError("Feedback and rating cannot be empty.");
    }
  };

  // set the rating given by user
  const handleRatingPress = (newRating) => {
    setRating(newRating);
  };

  const currentTheme = themes[theme];
  return (
    // apply the theme selected -- light or dark
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <View style={styles.themeButtonContainer}>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => {
            // test case 1: if the theme changes
            console.log(
              "Theme changed to",
              theme === "light" ? "dark" : "light",
              "mode while on feedback page"
            );
            toggleTheme();
          }}
        >
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
      <ScrollView>
        <View style={styles.containerInner}>
          {submitted ? (
            // if feedback is submitted, it should display the submittedFeedback function
            <SubmittedFeedback styles={styles} />
          ) : (
            // feedback form
            <View style={styles.formContainer}>
              <Text style={styles.title}>
                Please rate your experience and drop your honest review of the
                app to let us know how we can improve!
              </Text>
              <TextInput
                placeholder="Enter your feedback"
                style={styles.input}
                value={feedback}
                onChangeText={setFeedback}
                placeholderTextColor={styles.placeholder.color}
              />
              {/* star container using stars*/}
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    // when stars is clicked, it will set the rating accordingly
                    onPress={() => handleRatingPress(star)}
                    style={styles.star}
                  >
                    {/* star outline if star not clicked, filled star if pressed */}
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={20}
                      color="#e4d415"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {/* if any error, display the error */}
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {/* button to submite the feedback */}
              <Button title="Submit Feedback" onPress={handleSubmit} />
            </View>
          )}
        </View>
      </ScrollView>
      <Footer theme={theme} navigation={navigation} />
    </View>
  );
};

// after the feedback is submitted, it should display the thank you message
const SubmittedFeedback = ({ styles }) => (
  // test case 3: if thank message is displayed after submission of feedback
  console.log("Thank you message displayed after submitting feedback"),
  (
    <View style={styles.submittedContainer}>
      <Text style={styles.submittedText}>Thank you for your feedback!</Text>
    </View>
  )
);

export default FeedbackForm;

// technical difficulties I face while creating the application

/* The page is of low complexity since it contains only 2 elements - feedback input and star rating system. The feedback is stored using 
firebase so it can be updated and viewed. Creating the firebase was the only issue in the beginning because of the configuration while creating 
the database. As it was my first time utilizing firebase, applying the correct settings such as adding the application, creating the collection
was new but nevertheless it was easily manageable using youtube videos and once that was done, creating the page was simple */
