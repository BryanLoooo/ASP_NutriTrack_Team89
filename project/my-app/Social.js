


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useTheme } from "./ThemeContext";
import Footer from './Footer.js'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


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
      } else {
        console.log('User not authenticated');
      }
    });

    // fetch posts to display on the page from the collection
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'socialPagePosts'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => unsubscribe();
  }, [currentUserId]);

  // function for the user to choose their preferred image to post
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const source = result.assets[0].uri;
        // store the image URI locally
        setImage(source);  
        setAddingPost(true);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
    }
  };
  
  // function to upload the image to storage
  const uploadImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const storage = getStorage();
      const storageRef = ref(storage, `imagesPosted/${Date.now()}-${currentUserId}.jpg`);
      // print where its being uploaded to 
      console.log('Uploading to:', storageRef.fullPath);
  
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Upload successful:', snapshot);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      return downloadURL;
    } 
    // if any error in uploading
    catch (error) {
      console.error("Error uploading image: ", error.message);
      alert(`Error uploading image: ${error.message}`);
      throw error;
    }
  };
  
  // posting the chosen image with the caption
  const handlePost = async () => {
    if (image && caption) {
      try {
        // Upload the edited image
        const imageUri = await uploadImage(image); 
        // reference to the firestore collection 
        const docRef = await addDoc(collection(db, 'socialPagePosts'), {
          image: imageUri,
          caption,
          likes: 0,
          likedBy: [],
          createdAt: new Date(),
          userId: currentUserId,
        });
        // data of the post
        const newPost = { id: docRef.id, image: imageUri, caption, likes: 0, likedBy: [] };
        setPosts([...posts, newPost]);
  
        setCaption('');
        setImage(null);
        setAddingPost(false);
      }
      catch (error) {
        console.error('Error saving post:', error.message);
      }
    } 
    else {
      console.log('Please select an image and enter a caption');
    }
  };
  
  //handle the likes of the post
  const handleLike = async (id, currentLikes, likedBy) => {
    if (!currentUserId) return;

    let newLikes = currentLikes;
    let newLikedBy = [...likedBy];

    // one account can only like on
    if (newLikedBy.includes(currentUserId)) {
      newLikes -= 1;
      newLikedBy = newLikedBy.filter(userId => userId !== currentUserId);
    } else {
      newLikes += 1;
      newLikedBy.push(currentUserId);
    }
    // updating the collection wiht the likes
    await updateDoc(doc(db, 'socialPagePosts', id), {
      likes: newLikes,
      likedBy: newLikedBy,
    });

    setPosts(posts.map(post => post.id === id ? { ...post, likes: newLikes, likedBy: newLikedBy } : post));
  };

  const isPostLiked = (likedBy = []) => likedBy.includes(currentUserId);

  const currentTheme = themes[theme];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {/* Theme Toggle Button */}
      <View style={styles.themeButtonContainer}>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Image
            style={styles.themeButtonImage}
            source={theme === "light" ? require("../../project/my-app/assets/Sun.png") : require("../../project/my-app/assets/Moon.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
         {/* display welcome message if user is not in the process of adding a post */}
        {!addingPost && (
          <View style={[styles.welcomeContainer, posts.length > 0 ? styles.headerWelcome : styles.middleWelcome]}>
            <Text style={styles.welcomeText}>
              Welcome to NutriTrack's social page, a space where you can share and explore the health journeys of fellow community members!
            </Text>
          </View>
        )}

        <View style={styles.mainContentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={currentTheme.textColor} />
          ) : addingPost ? (
            <View style={styles.addPostContainer}>
              {/* Display Selected Image */}
              {image && <Image source={{ uri: image }}  style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}  />}
               {/* add caption for the image */}
              <TextInput
                style={[styles.input, { borderColor: currentTheme.borderColor, color: currentTheme.textColor }]}
                placeholder="Add a caption..."
                value={caption}
                onChangeText={setCaption} />
              {/* post or cancel posting */}
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
                     {/* post image */}
                    {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
                    <Text style={[styles.postCaption, { color: currentTheme.textColor }]}>{item.caption}</Text>
                     {/* like Section */}
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
                contentContainerStyle={{ paddingBottom: 100 }}  
              />
              {/* add post button near the footer */}
              <TouchableOpacity onPress={pickImage} style={styles.fixedAddPostButton}>
                <Text style={styles.addPostButtonText}>Add Post</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Footer theme={theme} navigation={navigation} />
    </View>
  );
};



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
    bottom: 70,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,  
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
