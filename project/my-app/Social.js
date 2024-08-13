
	
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  itemDate: {
    color: 'gray',
    marginBottom: 10,
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventContainer: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  eventDate: {
    color: 'gray',
    marginBottom: 10,
  },
  eventDescription: {
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#779ECB',
    borderRadius: 5,
    width: '40%',
    marginLeft: '55%'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
});

const Social = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventUrl, setSelectedEventUrl] = useState(null);

  const initialCategoryIds = [8001, 8002, 8003, 8019];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('https://www.eventbriteapi.com/v3/categories/108/', {
          headers: {
            'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
          }
        });
        const data = response.data.subcategories;

        const filteredGroups = data
          .map((subcategory) => ({
            id: parseInt(subcategory.id, 10),
            name: { text: subcategory.name_localized },
            description: { text: subcategory.name_localized },
            start: { local: new Date().toISOString() }
          }))
          .filter((group) => initialCategoryIds.includes(group.id));

        setGroups(filteredGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedCategory === 8001) {
      const fetchEvents = async () => {
        try {
          const response1 = await axios.get(`https://www.eventbriteapi.com/v3/events/967696796167/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });
    
          const response2 = await axios.get(`https://www.eventbriteapi.com/v3/events/906626944597/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });

          const response3 = await axios.get(`https://www.eventbriteapi.com/v3/events/954518208657/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });
    
          const event1 = response1.data;
          const event2 = response2.data;
          const event3 = response3.data;
    
          // Format the events
          const formattedEvent1 = {
            id: event1.id,
            name: { text: event1.name.text },
            start: { local: event1.start.local },
            description: { text: event1.description.text },
            url: event1.url 
          };
    
          const formattedEvent2 = {
            id: event2.id,
            name: { text: event2.name.text },
            start: { local: event2.start.local },
            description: { text: event2.description.text },
            url: event2.url 
          };
          const formattedEvent3 = {
            id: event3.id,
            name: { text: event3.name.text },
            start: { local: event3.start.local },
            description: { text: event3.description.text },
            url: event3.url 
          };
    
          // Update the events state
          setEvents([formattedEvent1, formattedEvent2, formattedEvent3]); 
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
    
      fetchEvents();
    }    
    else if (selectedCategory === 8002) {
      const fetchEvents = async () => {
        try {
          const response1 = await axios.get(`https://www.eventbriteapi.com/v3/venues/204931649/events/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });

          const response2 = await axios.get(`https://www.eventbriteapi.com/v3/events/967519014417/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });

          const data1 = response1.data.events;
          const data2 = response2.data;

          const formattedEvents1 = data1.map((event) => ({
            id: event.id,
            name: { text: event.name.text },
            start: { local: event.start.local },
            description: { text: event.description.text },
            url: event.url 
          }));

          const formattedEvents2 = {
            id: data2.id,
            name: { text: data2.name.text },
            start: { local: data2.start.local },
            description: { text: data2.description.text },
            url: data2.url 
          };

          setEvents([...formattedEvents1, formattedEvents2]);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    } 
    
    else if (selectedCategory === 8003) {
      const fetchEvents = async () => {
        try {

          const response1 = await axios.get(`https://www.eventbriteapi.com/v3/events/767497454547/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });
          const response2 = await axios.get(`https://www.eventbriteapi.com/v3/events/953401107377/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });

          const data1 = response1.data;
          const data2 = response2.data;

          const formattedEvent1 = {
            id: data1.id,
            name: { text: data1.name.text },
            start: { local: data1.start.local },
            description: { text: data1.description.text },
            url: data1.url 
          };

          const formattedEvent2 = {
            id: data2.id,
            name: { text: data2.name.text },
            start: { local: data2.start.local },
            description: { text: data2.description.text },
            url: data2.url 
          };

          setEvents([formattedEvent1,formattedEvent2]);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    } 
    else if (selectedCategory === 8019) {
      const fetchEvents = async () => {
        try {

          const response1 = await axios.get(`https://www.eventbriteapi.com/v3/events/883045682407/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });
          const response2 = await axios.get(`https://www.eventbriteapi.com/v3/events/965608289387/`, {
            headers: {
              'Authorization': `Bearer 6GE6LAXSZUIKENDM34NU`
            }
          });

          const data1 = response1.data;
          const data2 = response2.data;

          const formattedEvent1 = {
            id: data1.id,
            name: { text: data1.name.text },
            start: { local: data1.start.local },
            description: { text: data1.description.text },
            url: data1.url 
          };

          const formattedEvent2 = {
            id: data2.id,
            name: { text: data2.name.text },
            start: { local: data2.start.local },
            description: { text: data2.description.text },
            url: data2.url 
          };

          setEvents([formattedEvent1,formattedEvent2]);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    } 
    
    else {
      setEvents([]);
    }
  }, [selectedCategory]);

  const handleBuyTickets = (eventUrl) => {
    setSelectedEventUrl(eventUrl);
    setShowModal(true);
  };
  const handleOutsidePress = () => {
    setSelectedCategory(null);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text>Groups:</Text>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View>
                  <Text style={styles.itemName}>{item.name.text}</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text style={styles.buttonText}>Select</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {selectedCategory && (
            <View style={styles.eventsContainer}>
              <Text>Events for Selected Category:</Text>
              <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.eventContainer}>
                    <Text style={styles.eventName}>{item.name.text}</Text>
                    <Text style={styles.eventDate}>{new Date(item.start.local).toLocaleString()}</Text>
                    <Text style={styles.eventDescription}>{item.description.text}</Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleBuyTickets(item.url)}
                    >
                      <Text style={styles.buttonText}>Buy Tickets</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}

          <Modal visible={showModal} animationType="slide">
            <View style={styles.modalContainer}>
              <Button title="Close" onPress={() => setShowModal(false)} />
              {selectedEventUrl && (
                <WebView
                  source={{ uri: selectedEventUrl }}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Social;









