
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addFeedback } from './firebaseConfig';
import SubmittedFeedback from './submittedFeedback';

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<any>();

  const handleSubmit = async () => {
    if (feedback.trim()) {
      try {
        await addFeedback(feedback);
        console.log('Submitted feedback:', feedback);
        setFeedback('');
        setError('');
        setSubmitted(true);
        navigation.navigate('SubmittedFeedbackScreen'); // Ensure this matches the name in your navigator
      } catch (error) {
        console.error('Error submitting feedback:', error);
        setError('Error submitting feedback. Please try again.');
      }
    } else {
      setError('Feedback cannot be empty.');
    }
  };

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default FeedbackForm;

