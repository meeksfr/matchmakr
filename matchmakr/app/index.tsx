import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function App() {
  const profile = {
    name: 'Alex',
    age: 28,
    bio: 'Passionate about photography, travel, and trying new restaurants. Looking for someone to share adventures with!',
    imageUrl: 'https://picsum.photos/400/600',
    distance: '2 miles'
  };

  const handleLike = () => {
    console.log('Liked profile');
  };

  const handleDislike = () => {
    console.log('Disliked profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>matchmakr</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: profile.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nameAge}>{profile.name}, {profile.age}</Text>
            <Text style={styles.distance}>{profile.distance} away</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.dislikeButton]} onPress={handleDislike}>
          <Ionicons name="close" size={32} color="#FF4C4C" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={handleLike}>
          <Ionicons name="heart" size={32} color="#4CD964" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  iconButton: {
    padding: 4,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: width - 32,
    height: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '75%',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  nameAge: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CD964',
  },
  dislikeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF4C4C',
  },
}); 