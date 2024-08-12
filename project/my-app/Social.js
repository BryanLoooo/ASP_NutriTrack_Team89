

import React, { useState } from 'react';
import { View, Button, Image, TextInput, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Social = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false); // New state to track if post is submitted

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowCaptionInput(true);
    }
  };

  const handlePost = () => {
    if (image && caption) {
      // Handle the post logic, such as uploading to a database or server
      console.log('Image:', image);
      console.log('Caption:', caption);
      setPostSubmitted(true); // Update state to reflect post submission
    } else {
      console.log('Please select an image and enter a caption');
    }
  };

  return (
    <View style={styles.container}>
      {!postSubmitted ? (
        !image ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome to the NutriTrack social page, a space where you can share and explore the health journeys of fellow community members. Start adding yours now!
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Add" onPress={pickImage} />
            </View>
          </View>
        ) : (
          <View style={styles.imagePickerContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            {showCaptionInput && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Add a caption..."
                  value={caption}
                  onChangeText={setCaption}
                />
                <Button title="Post" onPress={handlePost} />
              </>
            )}
          </View>
        )
      ) : (
        <View style={styles.postSubmittedContainer}>
          <Image source={{ uri: image }} style={styles.submittedImage} />
          <Text style={styles.captionText}>{caption}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 20,
  },
  imagePickerContainer: {
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
  postSubmittedContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the top
    alignItems: 'center',
    width: '100%',
  },
  submittedImage: {
    width: '100%',
    height: 300, // Adjust height as needed
  },
  captionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default Social;

// import React, { useState, useEffect } from 'react';
// import { View, Button, Image, TextInput, Text, StyleSheet, FlatList } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { addImagePost, fetchImagePosts } from './firebaseConfig'; // Adjust the import path as necessary

// const Social = () => {
//   const [image, setImage] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [showCaptionInput, setShowCaptionInput] = useState(false);
//   const [postSubmitted, setPostSubmitted] = useState(false);
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     // Fetch posts when the component mounts
//     const loadPosts = async () => {
//       try {
//         const fetchedPosts = await fetchImagePosts();
//         setPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error fetching posts: ", error);
//       }
//     };
//     loadPosts();
//   }, [postSubmitted]);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setShowCaptionInput(true);
//     }
//   };

//   const handlePost = async () => {
//     if (image && caption) {
//       try {
//         await addImagePost({ image, caption });
//         setPostSubmitted(true);
//         setImage(null); // Reset image and caption after posting
//         setCaption('');
//         setShowCaptionInput(false);
//       } catch (error) {
//         console.error("Error adding document: ", error);
//       }
//     } else {
//       console.log('Please select an image and enter a caption');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.postContainer}>
//       <Image source={{ uri: item.image }} style={styles.submittedImage} />
//       <Text style={styles.captionText}>{item.caption}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {!postSubmitted ? (
//         !image ? (
//           <View style={styles.welcomeContainer}>
//             <Text style={styles.welcomeText}>
//               Welcome to the NutriTrack social page, a space where you can share and explore the health journeys of fellow community members. Start adding yours now!
//             </Text>
//             <View style={styles.buttonContainer}>
//               <Button title="Add" onPress={pickImage} />
//             </View>
//           </View>
//         ) : (
//           <View style={styles.imagePickerContainer}>
//             <Image source={{ uri: image }} style={styles.image} />
//             {showCaptionInput && (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Add a caption..."
//                   value={caption}
//                   onChangeText={setCaption}
//                 />
//                 <Button title="Post" onPress={handlePost} />
//               </>
//             )}
//           </View>
//         )
//       ) : (
//         <FlatList
//           data={posts}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.postList}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   welcomeContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   welcomeText: {
//     fontSize: 17,
//     textAlign: 'center',
//     marginBottom: 50,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 20,
//   },
//   imagePickerContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 10,
//   },
//   input: {
//     width: '100%',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 5,
//   },
//   postSubmittedContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     width: '100%',
//   },
//   submittedImage: {
//     width: '100%',
//     height: 300,
//   },
//   captionText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 10,
//     paddingHorizontal: 20,
//   },
//   postContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   postList: {
//     width: '100%',
//     paddingHorizontal: 20,
//   },
// });

// export default Social;
