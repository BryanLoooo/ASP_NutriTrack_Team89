

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

interface Group {
  id: number;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    local: string;
  };
}

interface Event {
  id: string;
  name: {
    text: string;
  };
  start: {
    local: string;
  };
  description: {
    text: string;
  };
  url: string; // Add a URL field
}

const App = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventUrl, setSelectedEventUrl] = useState<string | null>(null);

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
          .map((subcategory: any) => ({
            id: parseInt(subcategory.id, 10),
            name: { text: subcategory.name_localized },
            description: { text: subcategory.name_localized },
            start: { local: new Date().toISOString() }
          }))
          .filter((group: Group) => initialCategoryIds.includes(group.id));

        setGroups(filteredGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedCategory == 8002) {
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

          const formattedEvents1: Event[] = data1.map((event: any) => ({
            id: event.id,
            name: { text: event.name.text },
            start: { local: event.start.local },
            description: { text: event.description.text },
            url: event.url // Add URL to the event
          }));

          const formattedEvents2: Event = {
            id: data2.id,
            name: { text: data2.name.text },
            start: { local: data2.start.local },
            description: { text: data2.description.text },
            url: data2.url // Add URL to the event
          };

          setEvents([...formattedEvents1, formattedEvents2]);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [selectedCategory]);

  const handleBuyTickets = (eventUrl: string) => {
    setSelectedEventUrl(eventUrl);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Text>Groups:</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Button
              title={`Select ${item.name.text}`}
              onPress={() => setSelectedCategory(item.id)}
            />
            <Text style={styles.itemName}>{item.name.text}</Text>
            <Text style={styles.itemDate}>{new Date(item.start.local).toLocaleString()}</Text>
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
              source={{ uri: selectedEventUrl }} // Load the full event page
              style={{ flex: 1 }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

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
  },
  itemDescription: {
    fontStyle: 'italic',
  },
  itemDate: {
    color: 'gray',
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
  },
  eventDate: {
    color: 'gray',
  },
  eventDescription: {
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
});

export default App;
