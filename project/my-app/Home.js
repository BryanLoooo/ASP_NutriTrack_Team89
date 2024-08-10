
//Home.js
//import libraries
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    backgroundColor: '#00a8ff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  articleList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  articleButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00a8ff',
    marginRight: 10,
  },
  selectedArticleButton: {
    backgroundColor: '#00a8ff',
    borderColor: '#fff',
  },
  articleButtonText: {
    color: '#00a8ff',
  },
  activityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00a8ff',
  },
  selectedActivityButton: {
    backgroundColor: '#00a8ff',
    borderColor: '#fff',
  },
  activityButtonText: {
    color: '#00a8ff',
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 10,
    backgroundColor: '#00a8ff',
  },
  statsContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  dailyProgressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dailyProgressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  dailyProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dailyProgressFill: {
    height: 10,
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
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
  light: {
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff'
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },
  },
  dark: {
    container: {
      flex: 1,
      backgroundColor: '#333',
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#666',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
    },
    themeButtonImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },
  },
});

const HomeScreen = ({ navigation }) => {

  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(1000);
  const [caloriesGoal, setCaloriesGoal] = useState(3000);
  const [proteinConsumed, setProteinConsumed] = useState(330);
  const [fatConsumed, setFatConsumed] = useState(30);
  const [carbohydrateConsumed, setCarbohydrateConsumed] = useState(625);

  const activities = ['Running', 'Cycling', 'Swimming'];
  const articles = ['Article 1', 'Article 2', 'Article 3', 'Article 4', 'Article 5'];

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity);
  };

  const handleIncreaseCaloriesConsumed = () => {
    setCaloriesConsumed(caloriesConsumed + 50);
  };

  const handleDecreaseCaloriesConsumed = () => {
    setCaloriesConsumed(caloriesConsumed - 50);
  };

  const handleIncreaseProteinConsumed = () => {
    setProteinConsumed(proteinConsumed + 10);
  };

  const handleDecreaseProteinConsumed = () => {
    setProteinConsumed(proteinConsumed - 10);
  };

  const handleIncreaseFatConsumed = () => {
    setFatConsumed(fatConsumed + 5);
  };

  const handleDecreaseFatConsumed = () => {
    setFatConsumed(fatConsumed - 5);
  };

  const handleIncreaseCarbohydrateConsumed = () => {
    setCarbohydrateConsumed(carbohydrateConsumed + 25);
  };

  const handleDecreaseCarbohydrateConsumed = () => {
    setCarbohydrateConsumed(carbohydrateConsumed - 25);
  };

  //user interface elements
  return (
    <ScrollView style={styles[theme].container}> 
  <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles[theme].title}>NutriTrack</Text>
          <TouchableOpacity style={styles[theme].themeButton} onPress={toggleTheme}>
            <Image
              source={theme === 'light' ? require('../../project/my-app/assets/Sun.png') : require('../../project/my-app/assets/Moon.png')}
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
          key={article}
          style={[styles.articleButton, selectedArticle === article && styles.selectedArticleButton]}
          onPress={() => navigation.navigate('Articles')}
        >
          <Text style={styles.articleButtonText}>{article}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    <View style={styles.activityButtons}>
      {activities.map((activity) => (
        <TouchableOpacity
          key={activity}
          style={[styles.activityButton, selectedActivity === activity && styles.selectedActivityButton]}
          onPress={() => navigation.navigate('Social')}
        >
          <Text style={styles.activityButtonText}>{activity}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
    <View style={styles.dailyProgressContainer}>
    <View style={styles.dailyProgressItem}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.dailyProgressFill, { width: `${(caloriesConsumed / caloriesGoal) * 100}%` }]} />
        </View>
      </View>
      <View style={styles.statsContainer}>
      <Text style={styles.dailyProgressText}>Calories: {caloriesConsumed} cals</Text>
        <Text style={styles.dailyProgressText}>Goal: {caloriesGoal} cals</Text>
        <Text style={styles.dailyProgressText}>Protein: {proteinConsumed}g</Text>
        <Text style={styles.dailyProgressText}>Fats: {fatConsumed}g</Text>
        <Text style={styles.dailyProgressText}>Carbohydrates: {carbohydrateConsumed}g</Text>
      </View>
    </View>
    </View>
      <View style={styles.dailyProgressContainer}>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Mon</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'red', width: '80%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Tue</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '50%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Wed</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '30%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Thu</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '40%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Fri</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '50%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Sat</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '60%' }]} />
        </View>
        <View style={styles.dailyProgressItem}>
          <Text style={styles.dailyProgressText}>Sun</Text>
          <View style={[styles.dailyProgressFill, { backgroundColor: 'green', width: '70%' }]} />
        </View>
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

//export HomeScreen as a external module for referencing
export default HomeScreen;