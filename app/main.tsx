import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for testing
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'John Doe',
    title: 'Software Engineer',
    location: 'San Francisco, CA',
    yearsExperience: 5,
    bio: 'Passionate about building scalable web applications and solving complex problems.',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Full Stack Developer',
    location: 'New York, NY',
    yearsExperience: 3,
    bio: 'Full stack developer with a focus on React and Node.js. Love building user-friendly applications.',
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
];

export default function MainView() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const currentCandidate = MOCK_CANDIDATES[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < MOCK_CANDIDATES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!currentCandidate) {
    return (
      <View style={styles.container}>
        <Text>No more candidates available!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: currentCandidate.imageUrl }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{currentCandidate.name}</Text>
          <Text style={styles.title}>{currentCandidate.title}</Text>
          <Text style={styles.location}>{currentCandidate.location}</Text>
          <Text style={styles.experience}>{currentCandidate.yearsExperience} years of experience</Text>
          <Text style={styles.bio}>{currentCandidate.bio}</Text>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleSwipe('left')}
        >
          <Ionicons name="close-circle" size={40} color="red" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleSwipe('right')}
        >
          <Ionicons name="checkmark-circle" size={40} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  info: {
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: '#666',
  },
  location: {
    fontSize: 16,
    color: '#888',
  },
  experience: {
    fontSize: 16,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#444',
    marginTop: 10,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 50,
  },
  rejectButton: {
    backgroundColor: '#ffebee',
  },
  acceptButton: {
    backgroundColor: '#e8f5e9',
  },
}); 