
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useTheme } from "./ThemeContext";
import Footer from './Footer.js'; 
// using firebase storage to store the images
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// set theme styling
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
      // ensure user is authenticated
      if (user) {
        setCurrentUserId(user.uid);
      } 
      else {
        console.log('User not authenticated');
      }
    });

    // fetch posts to display on the page from the collection
    const fetchPosts = async () => {
      // error handling
      try {
        // query get all the images from the collection called - 'socialPagePosts'
        const q = query(collection(db, 'socialPagePosts'));
        // execute the query and get the snapshot of it
        const querySnapshot = await getDocs(q);
        // map through the images and create an array of posts with their data and document IDs
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // update the state 'posts' with the fetched posts
        setPosts(fetchedPosts);
      } 
      // if there is any error in while fetching the posts, display the message
      catch (error) {
        console.error('Error fetching posts:', error.message);
      } 
      finally {
        setLoading(false);
      }
    };
    // call the fetchPosts function to load posts
    fetchPosts();
    //return a cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [currentUserId]); // when the user changes, it will re-run the effect

  // function for the user to choose their preferred image to post
  const pickImage = async () => {
    // error handling
    try {
      // using imagePicker to allow users to choose the images from their device
      let result = await ImagePicker.launchImageLibraryAsync({
        // only images are allowed
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allow the chosen image to be cropped and edited
        allowsEditing: true,
        // image aspect ratio
        aspect: [4, 3],
        quality: 1,
      });
      // if user cancels the process of posting the image
      if (!result.canceled) {
        const source = result.assets[0].uri;
        // store the image URI locally
        setImage(source);  
        setAddingPost(true);
      }
      // test case 3: Image to be posted has been chosen, at the preview stage
      if (result){
        console.log('Image to be posted has been chosen')
      }
    } 
    // if any error in choosing the images, display the error message to test function
    catch (error) {
      console.error('Error picking image:', error.message);
    }
  };
  
  // function to upload the image to storage
  const uploadImage = async (imageUri) => {
    // error handling
    try {
      // fetch the image based on the URI
      const response = await fetch(imageUri);
      // convert to blob to upload
      const blob = await response.blob();
  
      // get the firebase storage reference
      const storage = getStorage();
      // create a unique file path in storage
      const storageRef = ref(storage, `imagesPosted/${Date.now()}-${currentUserId}.jpg`);
      // print where its being uploaded to 
      console.log('Uploading to:', storageRef.fullPath);
      // upload the blob to the firebase
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Upload successful:', snapshot);
  
      // get the image's download Url
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      return downloadURL;
    } 
    // if any error in uploading, print the error message to test function
    catch (error) {
      console.error("Error uploading image: ", error.message);
      throw error;
    }
  };
  
  // posting the chosen image with the caption
  const handlePost = async () => {
    // if the image and caption is both there, try uploading the image
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
        // test case 4: able to successfully post the image with the caption
        console.log('image successfully posted: ', image)
        console.log('caption for the chosen image: ', caption)
        // create a new post object with the uploaded data
        const newPost = { id: docRef.id, image: imageUri, caption, likes: 0, likedBy: [] };
        // include the new post in the posts state
        setPosts([...posts, newPost]);

        // reset the caption, clear the chosen image and adding post becomes false since its posted already
        setCaption('');
        setImage(null);
        setAddingPost(false);
      }
      // display any post saving error to test function
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
    // if user is not logged in, cant post
    if (!currentUserId) return;

    let newLikes = currentLikes;
    // clone likedBy array
    let newLikedBy = [...likedBy];

    // check if the post is already liked by the user
    if (newLikedBy.includes(currentUserId)) {
      // decrease if the heart is pressed again after liking
      newLikes -= 1;
      // remove user from likedBy array, since the post is disliked now
      newLikedBy = newLikedBy.filter(userId => userId !== currentUserId);

      //test case 7: If already liked by the user and heart icon is reclicked, removes the like
      console.log('Heart icon clicked when its already liked, user does not want to like the image')

    } 
    // increase the likes and add the user to the array
    else {
      // test case 5: user has liked the image, heart should turn red
      console.log('Heart icon clicked, user liked the image')
      newLikes += 1;
      newLikedBy.push(currentUserId);
    }
    // updating the collection with the like data
    await updateDoc(doc(db, 'socialPagePosts', id), {
      likes: newLikes,
      likedBy: newLikedBy,
    });
    // Update the state to reflect the new like count
    setPosts(posts.map(post => post.id === id ? { ...post, likes: newLikes, likedBy: newLikedBy } : post));
  };

  // function to check if a post is liked by the current user
  const isPostLiked = (likedBy = []) => likedBy.includes(currentUserId);

  const currentTheme = themes[theme];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {/* Theme Toggle Button */}
      <View style={styles.themeButtonContainer}>
      <TouchableOpacity style={styles.themeButton} onPress= {() =>{
          // test case 1: ensure theme is being toggled
          console.log("Theme changed to", theme === "light" ? "dark" : "light", "mode while on social page"),
          toggleTheme()
        }}
        >
          <Image
            style={styles.themeButtonImage}
            source={theme === "light" ? require("../../project/my-app/assets/Sun.png") : require("../../project/my-app/assets/Moon.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
         {/* display welcome message if user is not in the process of adding a post */}
        {!addingPost && (
          <View style={[styles.welcomeContainer, posts.length > 0 ? styles.headerWelcome : styles.middleWelcome]}>
            <Text style={[styles.welcomeText,  { color: currentTheme.textColor }]}>
              Welcome to NutriTrack's social page, a space where you can share and explore the health journeys of fellow community members!
            </Text>
          </View>
        )}

        <View style={styles.mainContentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={currentTheme.textColor} />
          ) : addingPost ? (  // Show post editor if the user is adding a post
            <View style={styles.addPostContainer}>
              {/* Display Selected Image */}
              {image && <Image source={{ uri: image }}  style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}  />}
               {/* add caption for the image */}
              <TextInput
                style={[styles.input, { borderColor: currentTheme.borderColor, color: currentTheme.textColor }]}
                placeholder="Add a caption..."
                placeholderTextColor={currentTheme.textColor}
                value={caption}
                onChangeText={setCaption} />
              {/* post or cancel posting */}
              <View style={styles.buttonContainer}>
                {/** cancel button and if cancelled, the caption, and selected image will be resetted */}
                <Button title="Cancel" onPress={() => {
                  // test case 5: able to cancel the process of posting an image middway
                  console.log('cancel button clicked, image not posted')
                  setAddingPost(false);
                  setImage(null);
                  setCaption('');
                }} color="red" />
                 {/** post button */}
                <Button title="Post" onPress={handlePost} />
              </View>
            </View>
          ) : (
            <>
              <FlatList
               // List of posts
                data={posts}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.postContainer}>
                     {/* post image */}
                    {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
                    {/* caption of the post */}
                    <Text style={[styles.postCaption, { color: currentTheme.textColor }]}>{item.caption}</Text>
                     {/* like Section */}
                    <View style={styles.likeContainer}>
                      <TouchableOpacity onPress={() => handleLike(item.id, item.likes, item.likedBy)}>
                        <FontAwesome
                          // if liked, the outlined heart white heart will turn red
                          name={isPostLiked(item.likedBy) ? 'heart' : 'heart-o'}
                          size={20}
                          color={isPostLiked(item.likedBy) ? 'red' : currentTheme.textColor} />
                      </TouchableOpacity>
                      {/** display the like count */}
                      <Text style={[styles.likeCount, { color: currentTheme.textColor }]}>
                        {item.likes} {item.likes === 1 ? 'Like' : 'Likes'}
                      </Text>
                    </View>
                  </View>
                )}
                // unique identifier for each post
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}  
              />
              {/* add post button near the footer */}
              <TouchableOpacity style={styles.fixedAddPostButton} onPress={() => {
                //test case 2: add post button should open up the gallery
                console.log('Add post button clicked and gallery opens up')
                pickImage()
                }} >
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

  // theme styling
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
  // welcome text
  welcomeContainer: {
    marginBottom: 20,
  },
  headerWelcome: {
    alignItems: 'center',
  },
  // put the welcome text in the middle when there is no posts but shift to the top when there are images
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
  // image styles 
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  // caption input
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
  // image after posting
  postImage: {
    width: '100%',
    height: 200,
  },
  postCaption: {
    marginTop: 15,
    fontSize: 16,
  },
  // like section
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
  // post button towards the end of the page
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
  }
});
    
export default Social;
