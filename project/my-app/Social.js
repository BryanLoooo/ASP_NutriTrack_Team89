

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';

const Social = () => {
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

  return (
    <View style={styles.container}>
      {/* Conditionally render welcome text if not adding a post */}
      {!addingPost && (
        <View style={[styles.welcomeContainer, posts.length > 0 ? styles.headerWelcome : styles.middleWelcome]}>
          <Text style={styles.welcomeText}>
            Welcome to NutriTrack's social page, a space where you can share and explore the health journeys of fellow community members.
          </Text>
        </View>
      )}

      {addingPost ? (
        <View style={styles.addPostContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TextInput
            style={styles.input}
            placeholder="Add a caption..."
            value={caption}
            onChangeText={setCaption}
          />
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
          {posts.length > 0 && (
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <View key={item.id} style={{ marginBottom: 30 }}>
                  {item.image && <Image source={{ uri: item.image }} style={{ width: '100%', height: 200 }} />}
                  <Text style={{ marginTop: 15 }}>{item.caption}</Text>
                  <View style={styles.likeContainer}>
                    <TouchableOpacity onPress={() => handleLike(item.id, item.likes, item.likedBy)}>
                      <FontAwesome
                        name={isPostLiked(item.likedBy) ? 'heart' : 'heart-o'}
                        size={20}
                        color={isPostLiked(item.likedBy) ? 'red' : 'black'}
                      />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>
                      {item.likes} {item.likes === 1 ? 'Like' : 'Likes'}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}

          {!addingPost && (
            <TouchableOpacity onPress={pickImage} style={styles.addPostButton}>
              <Text style={styles.addPostButtonText}>Add Post</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addPostContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#48AAAD',
    padding: 10,
    borderRadius: 50,
  },
  addPostButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  welcomeContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerWelcome: {
    alignItems: 'flex-start',
  },
  middleWelcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeCount: {
    color: '#333',
    marginLeft: 5,
  },
});

export default Social;
