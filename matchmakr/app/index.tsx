import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCandidates, fetchSkills, UserProfile, createMatch, deleteMatch, Skill } from './services/api';

const { width } = Dimensions.get('window');

type FilterType = 'experience' | 'roleType' | 'location' | 'skills';

type FilterValues = {
  [K in FilterType]: string | null;
};

type FilterOptions = {
  [K in FilterType]: string[];
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    experience: null,
    roleType: null,
    location: null,
    skills: null
  });
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const xMarkScale = useRef(new Animated.Value(0)).current;

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [candidatesData, skillsData] = await Promise.all([
          fetchCandidates(),
          fetchSkills()
        ]);
        setProfiles(candidatesData);
        setFilteredProfiles(candidatesData);
        setAvailableSkills(skillsData.map((skill: Skill) => skill.name));
        setError(null);
      } catch (err) {
        setError('Failed to load candidates. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filters: FilterOptions = {
    experience: ['0-2 years', '3-5 years', '5+ years'],
    roleType: ['Full-time', 'Contract', 'Remote'],
    location: ['San Francisco', 'New York', 'Remote'],
    skills: availableSkills
  };

  // Apply filters whenever selectedFilters changes
  useEffect(() => {
    let filtered = profiles;

    if (selectedFilters.experience) {
      const [min, max] = selectedFilters.experience.split('-').map(x => parseInt(x));
      filtered = filtered.filter(profile => {
        if (max) {
          return profile.years_of_experience >= min && profile.years_of_experience <= max;
        } else {
          // Handle "5+ years" case
          return profile.years_of_experience >= min;
        }
      });
    }

    if (selectedFilters.skills) {
      filtered = filtered.filter(profile => 
        profile.skills.some(skill => skill.name === selectedFilters.skills)
      );
    }

    setFilteredProfiles(filtered);
    setCurrentProfileIndex(0);
  }, [selectedFilters, profiles]);

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
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Move to next profile
      setCurrentProfileIndex((prev) => (prev + 1) % filteredProfiles.length);
    });
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
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Move to next profile
      setCurrentProfileIndex((prev) => (prev + 1) % filteredProfiles.length);
    });
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text style={styles.loadingText}>Loading candidates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
                  selectedFilters[filterType] ? styles.filterPillActive : null
                ]} 
                onPress={() => handleFilterPress(filterType)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilters[filterType] ? styles.filterTextActive : null
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
          outputRange: [0, 1],
        }),
      }}>
        {filteredProfiles.length > 0 ? (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Profile Card */}
            <View style={styles.card}>
              <Image
                source={{ uri: filteredProfiles[currentProfileIndex].image_url }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {filteredProfiles[currentProfileIndex].user.first_name} {filteredProfiles[currentProfileIndex].user.last_name}
                </Text>
                <Text style={styles.title}>
                  {filteredProfiles[currentProfileIndex].current_title}
                </Text>
                <Text style={styles.location}>
                  {filteredProfiles[currentProfileIndex].location}
                </Text>
                <View style={styles.separator} />
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Ionicons name="briefcase-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {filteredProfiles[currentProfileIndex].years_of_experience} years experience • {filteredProfiles[currentProfileIndex].role_type}
                    </Text>
                  </View>
                  <View style={styles.skillsContainer}>
                    <Ionicons name="code-outline" size={16} color="#666" />
                    <View style={styles.skillPills}>
                      {filteredProfiles[currentProfileIndex].skills.map((skill, index) => (
                        <View key={index} style={styles.skillPill}>
                          <Text style={styles.skillText}>{skill.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Experience Card */}
            <View style={styles.card}>
              <View style={styles.experienceHeader}>
                <Ionicons name="briefcase" size={20} color="#333" />
                <Text style={styles.experienceTitle}>Experience</Text>
              </View>
              <View style={styles.experienceContent}>
                {filteredProfiles[currentProfileIndex].previous_titles?.map((title, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.experienceRole}>{title.title}</Text>
                    <Text style={styles.experienceCompany}>{title.company}</Text>
                    <Text style={styles.experienceDuration}>{title.duration}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.bioSection}>
                <Text style={styles.bioTitle}>About</Text>
                <Text style={styles.bioText}>{filteredProfiles[currentProfileIndex].bio}</Text>
              </View>
              {filteredProfiles[currentProfileIndex].resume_url && (
                <TouchableOpacity 
                  style={styles.resumeButton}
                  onPress={() => window.open(filteredProfiles[currentProfileIndex].resume_url, '_blank')}
                >
                  <Ionicons name="document-text-outline" size={20} color="#0A84FF" />
                  <Text style={styles.resumeButtonText}>View Resume</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color="#999" />
            <Text style={styles.noResultsText}>No matches found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your filters</Text>
          </View>
        )}

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
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: width * 0.8,
  },
  profileInfo: {
    padding: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 6,
    fontWeight: '500',
  },
  location: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 16,
  },
  detailsContainer: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 2,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  experienceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  experienceContent: {
    padding: 20,
    backgroundColor: '#fff',
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceRole: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  bioSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  skillPills: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillPill: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0A84FF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  resumeButtonText: {
    fontSize: 16,
    color: '#0A84FF',
    fontWeight: '500',
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