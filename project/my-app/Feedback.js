
//Feedback.js
//import libraries
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { addFeedback } from './firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';

//Stylesheet
const styles = StyleSheet.create({
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
    top: 475,
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
});

//constant variable decleration
const FeedbackForm = ({ navigation }) => {

  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (feedback.trim()) {
      try {
        await addFeedback(feedback);
        // check if feedback is submitted
        console.log('Submitted feedback:', feedback);
        setFeedback('');
        setError('');
        setSubmitted(true);
      } 
      catch (error) {
        console.error('Error submitting feedback:', error);
        setError('Error submitting feedback. Please try again.');
      }
    } 
    // if empty feedback
    else {
      setError('Feedback cannot be empty.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerInner}>
        {submitted ? (
          <SubmittedFeedback />
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Feedback</Text>
            <TextInput
              placeholder="Enter your feedback"
              style={styles.input}
              value={feedback}
              onChangeText={setFeedback}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Submit Feedback" onPress={handleSubmit} />
          </View>
        )}
      </View>
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
    </ScrollView>
  );
};

const SubmittedFeedback = () => (

  <View style={styles.submittedContainer}>
    <Text style={styles.submittedText}>Thank you for your feedback!</Text>
  </View>
);

//export FeedbackForm as a external module for referencing
export default FeedbackForm;
