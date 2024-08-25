
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useTheme } from "./ThemeContext";
import Footer from './Footer.js'; 

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

const Social = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingPost, setAddingPost] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'socialPagePosts'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setLoading(false);
      }
    };

    fetchPosts();
    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setAddingPost(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handlePost = async () => {
    if (image && caption) {
      try {
        const docRef = await addDoc(collection(db, 'socialPagePosts'), {
          image,
          caption,
          likes: 0,
          likedBy: [],
        });

        const newPost = { id: docRef.id, image, caption, likes: 0, likedBy: [] };
        setPosts([...posts, newPost]);

        // Reset after posting
        setCaption('');
        setImage(null);
        setAddingPost(false);
      } catch (error) {
        console.error('Error saving post:', error.message);
      }
    } else {
      console.log('Please select an image and enter a caption');
    }
  };

  const handleLike = async (id, currentLikes, likedBy) => {
    if (!currentUserId) return;

    let newLikes = currentLikes;
    let newLikedBy = [...likedBy];

    if (newLikedBy.includes(currentUserId)) {
      newLikes -= 1;
      newLikedBy = newLikedBy.filter(userId => userId !== currentUserId);
    } else {
      newLikes += 1;
      newLikedBy.push(currentUserId);
    }

    await updateDoc(doc(db, 'socialPagePosts', id), {
      likes: newLikes,
      likedBy: newLikedBy,
    });

    setPosts(posts.map(post => post.id === id ? { ...post, likes: newLikes, likedBy: newLikedBy } : post));
  };

  const isPostLiked = (likedBy) => likedBy.includes(currentUserId);

  const currentTheme = themes[theme];

  return(
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {/*theme button*/}
      <View style={styles.themeButtonContainer}>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Image
            style={styles.themeButtonImage}
            source={theme === "light"
              ? require("../../project/my-app/assets/Sun.png")
              : require("../../project/my-app/assets/Moon.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Render welcome text if not adding a post */}
        {!addingPost && (
          <View style={[styles.welcomeContainer, posts.length > 0 ? styles.headerWelcome : styles.middleWelcome]}>
            <Text style={styles.welcomeText}>
              Welcome to NutriTrack's social page, a space where you can share and explore the health journeys of fellow community members!
            </Text>
          </View>
        )}

        {/* Conditionally render posts */}
        <View style={styles.mainContentContainer}>
          {addingPost ? (
            <View style={styles.addPostContainer}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              <TextInput
                style={[styles.input, { borderColor: currentTheme.borderColor, color: currentTheme.textColor }]}
                placeholder="Add a caption..."
                value={caption}
                onChangeText={setCaption} />
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => {
                  setAddingPost(false);
                  setImage(null);
                  setCaption('');
                }} color="red" />
                <Button title="Post" onPress={handlePost} />
              </View>
            </View>
          ) : (
            <>
              <FlatList
                data={posts}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.postContainer}>
                    {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
                    <Text style={[styles.postCaption, { color: currentTheme.textColor }]}>{item.caption}</Text>
                    <View style={styles.likeContainer}>
                      <TouchableOpacity onPress={() => handleLike(item.id, item.likes, item.likedBy)}>
                        <FontAwesome
                          name={isPostLiked(item.likedBy) ? 'heart' : 'heart-o'}
                          size={20}
                          color={isPostLiked(item.likedBy) ? 'red' : currentTheme.textColor} />
                      </TouchableOpacity>
                      <Text style={[styles.likeCount, { color: currentTheme.textColor }]}>
                        {item.likes} {item.likes === 1 ? 'Like' : 'Likes'}
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}  // Ensure space for the button
              />
              <TouchableOpacity onPress={pickImage} style={styles.fixedAddPostButton}>
                <Text style={styles.addPostButtonText}>Add Post</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Footer theme={theme} navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  headerWelcome: {
    alignItems: 'center',
  },
  middleWelcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 17,
    textAlign: 'center',
  },
  mainContentContainer: {
    flex: 1,
  },
  addPostContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  postContainer: {
    marginBottom: 30,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postCaption: {
    marginTop: 15,
    fontSize: 16,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
  fixedAddPostButton: {
    position: 'absolute',
    width: '45%',
    right: 20,
    bottom: 70,  // Adjusted to ensure the button is higher
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,  // Ensure the button is on top
  },    
  addPostButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  addPostBelowWelcomeButton: {
    alignSelf: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
  },
});
    
export default Social;

