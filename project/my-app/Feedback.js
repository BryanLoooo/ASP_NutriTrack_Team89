
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { addFeedback } from './firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "./ThemeContext";
import Footer from './Footer.js'; 

const getStyles = (theme) =>
  StyleSheet.create({
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
    starContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    star: {
      marginRight: 5,
    },
    container: {
      flex: 1
    },
    containerInner: {
      flex: 1,
      padding: 20,
    },
    formContainer: {
      width: '100%',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      width: '90%',
      paddingHorizontal: 10,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    submittedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submittedText: {
      fontSize: 18,
      fontWeight: 'bold',
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

  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (feedback.trim() && rating > 0) {
      try {
        await addFeedback({ feedback, rating });
        console.log('Submitted feedback:', feedback, 'Rating:', rating);
        setFeedback('');
        setRating(0);
        setError('');
        setSubmitted(true);
      } catch (error) {
        setError('Error submitting feedback. Please try again.');
      }
    } else {
      setError('Feedback and rating cannot be empty.');
    }
  };

  const handleRatingPress = (newRating) => {
    setRating(newRating);
  };

  const currentTheme = themes[theme];
  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View style={styles.themeButtonContainer}>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Image
            style={styles.themeButtonImage}
            source={theme === "light"
              ? require("../../project/my-app/assets/Sun.png")
              : require("../../project/my-app/assets/Moon.png")} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.containerInner}>
          {submitted ? (
            <SubmittedFeedback styles={styles} />
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Feedback</Text>
              <TextInput
                placeholder="Enter your feedback"
                style={styles.input}
                value={feedback}
                onChangeText={setFeedback}
              />
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRatingPress(star)}
                    style={styles.star}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={20}
                      color="#e4d415"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button title="Submit Feedback" onPress={handleSubmit} />
            </View>
          )}
        </View>
      </ScrollView>
      <Footer theme={theme} navigation={navigation} />
    </View>
  );
};

const SubmittedFeedback = ({ styles }) => (
  <View style={styles.submittedContainer}>
    <Text style={styles.submittedText}>Thank you for your feedback!</Text>
  </View>
);

export default FeedbackForm;
