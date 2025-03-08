import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';

const { width, height } = Dimensions.get('window');

type FilterType = 'experience' | 'roleType' | 'location' | 'skills';

type FilterValues = {
  [K in FilterType]: string | null;
};

type FilterOptions = {
  [K in FilterType]: string[];
};

export default function App() {
  const [activeFilter, setActiveFilter] = React.useState<FilterType | null>(null);
  const [selectedFilters, setSelectedFilters] = React.useState<FilterValues>({
    experience: null,
    roleType: null,
    location: null,
    skills: null
  });

  // Add animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const xMarkScale = useRef(new Animated.Value(0)).current;

  const filters: FilterOptions = {
    experience: ['0-2 years', '3-5 years', '5+ years'],
    roleType: ['Full-time', 'Contract', 'Remote'],
    location: ['San Francisco', 'New York', 'Remote'],
    skills: ['React', 'Node.js', 'Python', 'AWS']
  };

  const profile = {
    name: 'Alex',
    age: 28,
    location: 'San Francisco, CA',
    yearsExperience: 5,
    imageUrl: 'https://picsum.photos/400/600',
    currentTitle: 'Senior Software Engineer',
    previousTitles: [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        duration: '2020-2023'
      },
      {
        title: 'Junior Developer',
        company: 'Startup Inc',
        duration: '2018-2020'
      }
    ]
  };

  const handleInterested = () => {
    // Animate card sliding right
    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // Show and hide checkmark
        Animated.sequence([
          Animated.timing(checkmarkScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(300),
          Animated.timing(checkmarkScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Reset position for next card
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    console.log('Expressed interest');
  };

  const handlePass = () => {
    // Animate card sliding left
    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // Show and hide X mark
        Animated.sequence([
          Animated.timing(xMarkScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(300),
          Animated.timing(xMarkScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Reset position for next card
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    console.log('Passed on candidate');
  };

  const handleFilterPress = (filterType: FilterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleFilterSelect = (filterType: FilterType, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setActiveFilter(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>matchmakr</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#0A84FF" />
          </TouchableOpacity>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {(Object.entries(filters) as [FilterType, string[]][]).map(([filterType, options]) => (
              <TouchableOpacity 
                key={filterType}
                style={[
                  styles.filterPill,
                  selectedFilters[filterType] && styles.filterPillActive
                ]} 
                onPress={() => handleFilterPress(filterType)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilters[filterType] && styles.filterTextActive
                ]}>
                  {selectedFilters[filterType] || filterType}
                </Text>
                <Ionicons 
                  name={activeFilter === filterType ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={selectedFilters[filterType] ? "#0A84FF" : "#666"} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Filter Dropdowns */}
      {activeFilter && (
        <View style={styles.dropdown}>
          {filters[activeFilter].map((option: string) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => handleFilterSelect(activeFilter, option)}
            >
              <Text style={[
                styles.dropdownText,
                selectedFilters[activeFilter] === option && styles.dropdownTextSelected
              ]}>
                {option}
              </Text>
              {selectedFilters[activeFilter] === option && (
                <Ionicons name="checkmark" size={20} color="#0A84FF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Success Checkmark Overlay */}
      <Animated.View style={[styles.checkmarkOverlay, {
        transform: [{ scale: checkmarkScale }],
      }]}>
        <Ionicons name="checkmark-circle" size={120} color="rgba(76, 217, 100, 0.8)" />
      </Animated.View>

      {/* X Mark Overlay */}
      <Animated.View style={[styles.checkmarkOverlay, {
        transform: [{ scale: xMarkScale }],
      }]}>
        <Ionicons name="close-circle" size={120} color="rgba(255, 59, 48, 0.8)" />
      </Animated.View>

      <Animated.View style={{
        flex: 1,
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.card}>
            <Image
              source={{ uri: profile.imageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              <View style={styles.separator} />
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{profile.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="briefcase-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{profile.yearsExperience} years experience</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Experience Card */}
          <View style={styles.card}>
            <View style={styles.experienceHeader}>
              <Ionicons name="briefcase" size={20} color="#333" />
              <Text style={styles.experienceTitle}>Work Experience</Text>
            </View>
            <View style={styles.currentRole}>
              <Text style={styles.currentTitle}>{profile.currentTitle}</Text>
              <Text style={styles.currentLabel}>Current Role</Text>
            </View>
            <View style={styles.separator} />
            {profile.previousTitles.map((job, index) => (
              <View key={index} style={styles.previousRole}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
                <Text style={styles.duration}>{job.duration}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.passButton]} 
            onPress={handlePass}
          >
            <Ionicons name="close-circle-outline" size={24} color="#666" />
            <Text style={styles.buttonText}>Pass</Text>
          </TouchableOpacity>
          <View style={styles.buttonSeparator} />
          <TouchableOpacity 
            style={[styles.button, styles.interestedButton]} 
            onPress={handleInterested}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#0A84FF" />
            <Text style={[styles.buttonText, styles.interestedText]}>Interested</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'System',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterPillActive: {
    backgroundColor: '#E8F2FF',
    borderColor: '#0A84FF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: '#0A84FF',
  },
  dropdown: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownTextSelected: {
    color: '#0A84FF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: width * 0.8,
  },
  profileInfo: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  currentRole: {
    padding: 16,
    paddingTop: 8,
  },
  currentTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  currentLabel: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '500',
  },
  previousRole: {
    padding: 16,
    paddingTop: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  interestedText: {
    color: '#0A84FF',
  },
  buttonSeparator: {
    width: 1,
    backgroundColor: '#eee',
  },
  passButton: {
    backgroundColor: '#fff',
  },
  interestedButton: {
    backgroundColor: '#fff',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 