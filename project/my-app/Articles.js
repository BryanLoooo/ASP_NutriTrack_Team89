// Articles.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

const styles = {
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
    top: 675,
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
};

const ArticlesScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Article Screen</Text>
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
    </View>
  );
};
export default ArticlesScreen;