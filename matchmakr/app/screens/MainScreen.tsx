import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchCandidates, createMatch, deleteMatch, logout } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/300';

// Define the Skill type
type Skill = {
  id: number;
  name: string;
  description?: string;
};

// Update the UserProfile type to include all fields
type UserProfile = {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  current_title: string;
  years_of_experience: number;
  role_type: string;
  location: string;
  bio: string;
  image_url: string;
  skills: Skill[];
  previous_titles: {
    title: string;
    company: string;
    duration: string;
  }[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  twitter_url?: string;
  personal_website?: string;
  resume_url?: string;
};

// Update the fake data to include username
const FAKE_PROFILES: UserProfile[] = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'sarahchen',
      first_name: 'Sarah',
      last_name: 'Chen',
      email: 'sarah.chen@example.com'
    },
    current_title: 'Senior Full Stack Developer',
    years_of_experience: 5,
    role_type: 'Full Stack',
    location: 'San Francisco, CA',
    bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers.',
    image_url: 'https://randomuser.me/api/portraits/women/1.jpg',
    skills: [
      { id: 1, name: 'React' },
      { id: 2, name: 'Node.js' },
      { id: 3, name: 'TypeScript' },
      { id: 4, name: 'AWS' }
    ],
    previous_titles: [
      {
        title: 'Full Stack Developer',
        company: 'TechCorp',
        duration: '2020-2022'
      },
      {
        title: 'Frontend Developer',
        company: 'StartupX',
        duration: '2018-2020'
      }
    ],
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    github_url: 'https://github.com/sarahchen',
    portfolio_url: 'https://sarahchen.dev',
    twitter_url: 'https://twitter.com/sarahchen',
    personal_website: 'https://sarahchen.dev',
    resume_url: 'https://sarahchen.dev/resume.pdf'
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'michaelrodriguez',
      first_name: 'Michael',
      last_name: 'Rodriguez',
      email: 'michael.rodriguez@example.com'
    },
    current_title: 'Lead Backend Engineer',
    years_of_experience: 8,
    role_type: 'Backend',
    location: 'Remote',
    bio: 'Experienced backend engineer specializing in scalable systems and microservices architecture. Strong background in Python and cloud infrastructure.',
    image_url: 'https://randomuser.me/api/portraits/men/1.jpg',
    skills: [
      { id: 5, name: 'Python' },
      { id: 6, name: 'Django' },
      { id: 7, name: 'PostgreSQL' },
      { id: 8, name: 'Docker' }
    ],
    previous_titles: [
      {
        title: 'Senior Backend Engineer',
        company: 'CloudTech',
        duration: '2019-2022'
      },
      {
        title: 'Backend Developer',
        company: 'DataFlow',
        duration: '2015-2019'
      }
    ],
    linkedin_url: 'https://linkedin.com/in/michaelrodriguez',
    github_url: 'https://github.com/michaelrodriguez',
    portfolio_url: 'https://michaelrodriguez.dev',
    twitter_url: 'https://twitter.com/michaelrodriguez',
    personal_website: 'https://michaelrodriguez.dev',
    resume_url: 'https://michaelrodriguez.dev/resume.pdf'
  },
  {
    id: 3,
    user: {
      id: 3,
      username: 'emilypark',
      first_name: 'Emily',
      last_name: 'Park',
      email: 'emily.park@example.com'
    },
    current_title: 'Mobile Developer',
    years_of_experience: 3,
    role_type: 'Mobile',
    location: 'New York, NY',
    bio: 'Mobile developer passionate about creating beautiful and intuitive iOS applications. Experienced with Swift and React Native.',
    image_url: 'https://randomuser.me/api/portraits/women/2.jpg',
    skills: [
      { id: 9, name: 'Swift' },
      { id: 10, name: 'React Native' },
      { id: 11, name: 'iOS' },
      { id: 12, name: 'Firebase' }
    ],
    previous_titles: [
      {
        title: 'iOS Developer',
        company: 'AppStudio',
        duration: '2020-2022'
      }
    ],
    linkedin_url: 'https://linkedin.com/in/emilypark',
    github_url: 'https://github.com/emilypark',
    portfolio_url: 'https://emilypark.dev',
    twitter_url: 'https://twitter.com/emilypark',
    personal_website: 'https://emilypark.dev',
    resume_url: 'https://emilypark.dev/resume.pdf'
  }
];

type FilterType = 'experience' | 'roleType' | 'location' | 'skills';
type FilterValues = { [K in FilterType]: string | null; };
type FilterOptions = { [K in FilterType]: string[]; };

type MainScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const filterLabels: Record<FilterType, string> = {
  experience: 'Experience',
  roleType: 'Role Type',
  location: 'Location',
  skills: 'Skills'
};

const filters: Record<FilterType, string[]> = {
  experience: ['0-2 years', '3-5 years', '5-10 years', '10+ years'],
  roleType: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'DevOps'],
  location: ['Remote', 'Hybrid', 'On-site'],
  skills: ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes']
};

export default function MainScreen({ navigation }: MainScreenProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType | null>(null);
  const [selectedFilters, setSelectedFilters] = React.useState<FilterValues>({
    experience: null,
    roleType: null,
    location: null,
    skills: null
  });
  const [currentProfileIndex, setCurrentProfileIndex] = React.useState(0);
  const [profiles, setProfiles] = React.useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = React.useState<string[]>([]);

  // Animation values
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const checkmarkScale = React.useRef(new Animated.Value(0)).current;
  const xMarkScale = React.useRef(new Animated.Value(0)).current;

  // Memoize current profile data
  const currentProfile = React.useMemo(() => 
    filteredProfiles[currentProfileIndex] || null,
    [filteredProfiles, currentProfileIndex]
  );

  // Prefetch next profile's image
  const prefetchNextProfile = React.useCallback((index: number) => {
    const nextProfile = filteredProfiles[(index + 1) % filteredProfiles.length];
    if (nextProfile?.image_url && Platform.OS !== 'web') {
      Image.prefetch(nextProfile.image_url).catch(() => {
        // Silently handle prefetch errors
      });
    }
  }, [filteredProfiles]);

  // Batch fetch profiles
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Use fake data instead of API calls for testing
        setProfiles(FAKE_PROFILES);
        setFilteredProfiles(FAKE_PROFILES);
        setAvailableSkills(['React', 'Node.js', 'Python', 'Swift', 'iOS', 'AWS', 'Docker']);
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

  // Prefetch next profile when current index changes
  React.useEffect(() => {
    prefetchNextProfile(currentProfileIndex);
  }, [currentProfileIndex, prefetchNextProfile]);

  // Optimize filtered profiles calculation
  const updateFilteredProfiles = React.useCallback(() => {
    let filtered = profiles;

    if (selectedFilters.experience) {
      const [min, max] = selectedFilters.experience.split('-').map(x => parseInt(x));
      filtered = filtered.filter(profile => {
        if (max) {
          return profile.years_of_experience >= min && profile.years_of_experience <= max;
        } else {
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
  }, [profiles, selectedFilters]);

  React.useEffect(() => {
    updateFilteredProfiles();
  }, [selectedFilters, profiles, updateFilteredProfiles]);

  const handleInterested = React.useCallback(() => {
    const nextIndex = (currentProfileIndex + 1) % filteredProfiles.length;
    prefetchNextProfile(nextIndex);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: width,
          damping: 20,
          mass: 0.8,
          stiffness: 150,
          useNativeDriver: true,
          restSpeedThreshold: 100,
          restDisplacementThreshold: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(checkmarkScale, {
            toValue: 1,
            damping: 20,
            mass: 0.8,
            stiffness: 150,
            useNativeDriver: true,
            restSpeedThreshold: 100,
            restDisplacementThreshold: 40,
          }),
          Animated.delay(250),
          Animated.timing(checkmarkScale, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]),
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
      setCurrentProfileIndex(nextIndex);
    });
  }, [currentProfileIndex, filteredProfiles.length, prefetchNextProfile, slideAnim, fadeAnim, checkmarkScale]);

  const handlePass = React.useCallback(() => {
    const nextIndex = (currentProfileIndex + 1) % filteredProfiles.length;
    prefetchNextProfile(nextIndex);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -width,
          damping: 20,
          mass: 0.8,
          stiffness: 150,
          useNativeDriver: true,
          restSpeedThreshold: 100,
          restDisplacementThreshold: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(xMarkScale, {
            toValue: 1,
            damping: 20,
            mass: 0.8,
            stiffness: 150,
            useNativeDriver: true,
            restSpeedThreshold: 100,
            restDisplacementThreshold: 40,
          }),
          Animated.delay(250),
          Animated.timing(xMarkScale, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]),
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
      setCurrentProfileIndex(nextIndex);
    });
  }, [currentProfileIndex, filteredProfiles.length, prefetchNextProfile, slideAnim, fadeAnim, xMarkScale]);

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

  const handleLogout = async () => {
    try {
      logout();
      navigation.replace('Landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.webContainer}>
      <SafeAreaView style={styles.container} testID="app-container">
        {/* Header */}
        <View style={styles.header} testID="header">
          <Text style={styles.logoText} testID="logo">matchmakr</Text>
          <View style={styles.filterRow} testID="filter-bar">
            <TouchableOpacity style={styles.filterButton} testID="filter-button">
              <Ionicons name="filter" size={24} color="#0A84FF" />
            </TouchableOpacity>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
              testID="filters-scroll"
            >
              {(Object.entries(filters) as [FilterType, string[]][]).map(([filterType, options]) => (
                <TouchableOpacity 
                  key={filterType}
                  testID={`filter-pill-${filterType}${selectedFilters[filterType] ? '-active' : ''}`}
                  style={[
                    styles.filterPill,
                    selectedFilters[filterType] ? styles.filterPillActive : null
                  ]} 
                  onPress={() => handleFilterPress(filterType)}
                >
                  <Text style={styles.filterText} testID={`filter-text-${filterType}`}>{filterLabels[filterType]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Filter Dropdowns */}
        {activeFilter && (
          <View style={styles.dropdown} testID="filter-dropdown">
            {filters[activeFilter].map((option: string) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                testID={`dropdown-item-${option.toLowerCase().replace(/\s+/g, '-')}${selectedFilters[activeFilter] === option ? '-selected' : ''}`}
                onPress={() => handleFilterSelect(activeFilter, option)}
              >
                <Text style={[
                  styles.dropdownText,
                  selectedFilters[activeFilter] === option && styles.dropdownTextSelected
                ]} testID={`dropdown-text-${option.toLowerCase().replace(/\s+/g, '-')}`}>{option}</Text>
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
        }]} testID="success-overlay">
          <Ionicons name="checkmark-circle" size={120} color="rgba(76, 217, 100, 0.8)" />
        </Animated.View>

        {/* X Mark Overlay */}
        <Animated.View style={[styles.checkmarkOverlay, {
          transform: [{ scale: xMarkScale }],
        }]} testID="reject-overlay">
          <Ionicons name="close-circle" size={120} color="rgba(255, 59, 48, 0.8)" />
        </Animated.View>

        <Animated.View style={{
          flex: 1,
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }} testID="profile-content">
          {currentProfile ? (
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContent}
              removeClippedSubviews={true}
              scrollEventThrottle={8}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.985}
              bounces={false}
              bouncesZoom={false}
              alwaysBounceVertical={false}
              snapToAlignment="start"
              testID="profile-scroll"
              contentInsetAdjustmentBehavior="automatic"
              onMomentumScrollBegin={() => {
                if (Platform.OS === 'web') {
                  document.body.style.pointerEvents = 'none';
                }
              }}
              onMomentumScrollEnd={() => {
                if (Platform.OS === 'web') {
                  document.body.style.pointerEvents = 'auto';
                }
              }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: new Animated.Value(0) } } }],
                { 
                  useNativeDriver: true,
                  listener: () => {
                    // Optional: Add custom scroll handling if needed
                  },
                }
              )}
            >
              {/* Profile Card */}
              <View style={[styles.card, styles.profileCard]} testID="profile-card">
                <View style={styles.imageContainer} testID="profile-image-container">
                  <Image
                    source={{ uri: currentProfile.image_url || DEFAULT_PROFILE_IMAGE }}
                    style={styles.profileImage}
                    testID="profile-image"
                    resizeMode="cover"
                    fadeDuration={0}
                  />
                </View>
                <View style={styles.profileInfo} testID="profile-info">
                  <Text style={styles.name} testID="profile-name">
                    {currentProfile.user.first_name}{' '}
                    {currentProfile.user.last_name}
                  </Text>
                  <Text style={styles.title} testID="profile-title">
                    {currentProfile.current_title}
                  </Text>
                  <Text style={styles.location} testID="profile-location">
                    {currentProfile.location}
                  </Text>
                  <View style={styles.separator} testID="profile-separator" />
                  <View style={styles.detailsContainer} testID="profile-details">
                    <View style={styles.detailItem} testID="experience-section">
                      <Ionicons name="briefcase-outline" size={16} color="#666" />
                      <Text style={styles.detailText} testID="experience-text">
                        {currentProfile.years_of_experience} years experience • {currentProfile.role_type}
                      </Text>
                    </View>
                    <View style={styles.skillsContainer} testID="skills-section">
                      <Ionicons name="code-outline" size={16} color="#666" />
                      <View style={styles.skillPills} testID="skills-list">
                        {currentProfile.skills.map((skill, index) => (
                          <View key={index} style={styles.skillPill} testID={`skill-pill-${index}`}>
                            <Text style={styles.skillText} testID={`skill-text-${index}`}>{skill.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Experience Card */}
              <View style={[styles.card, styles.experienceCard]} testID="experience-card">
                <View style={styles.experienceHeader} testID="experience-header">
                  <Ionicons name="briefcase" size={20} color="#333" />
                  <Text style={styles.experienceTitle} testID="experience-title">Experience</Text>
                </View>
                <View style={styles.experienceContent} testID="experience-content">
                  {currentProfile.previous_titles?.map((title, index) => (
                    <View key={index} style={styles.experienceItem} testID={`experience-item-${index}`}>
                      <Text style={styles.experienceRole} testID={`experience-role-${index}`}>{title.title}</Text>
                      <Text style={styles.experienceCompany} testID={`experience-company-${index}`}>{title.company}</Text>
                      <Text style={styles.experienceDuration} testID={`experience-duration-${index}`}>{title.duration}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.bioSection} testID="bio-section">
                  <Text style={styles.bioTitle} testID="bio-title">About</Text>
                  <Text style={styles.bioText} testID="bio-content">{currentProfile.bio}</Text>
                </View>
                <View style={styles.separator} testID="links-separator" />
                <View style={styles.linksSection} testID="links-section">
                  <Text style={styles.linksTitle} testID="links-title">Links</Text>
                  <View style={styles.linksGrid} testID="links-grid">
                    {currentProfile.linkedin_url && (
                      <TouchableOpacity 
                        style={styles.linkButton}
                        testID="linkedin-link"
                        onPress={() => window.open(currentProfile.linkedin_url, '_blank')}
                      >
                        <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
                        <Text style={styles.linkText}>LinkedIn</Text>
                      </TouchableOpacity>
                    )}
                    {currentProfile.github_url && (
                      <TouchableOpacity 
                        style={styles.linkButton}
                        testID="github-link"
                        onPress={() => window.open(currentProfile.github_url, '_blank')}
                      >
                        <Ionicons name="logo-github" size={20} color="#333" />
                        <Text style={styles.linkText}>GitHub</Text>
                      </TouchableOpacity>
                    )}
                    {currentProfile.portfolio_url && (
                      <TouchableOpacity 
                        style={styles.linkButton}
                        testID="portfolio-link"
                        onPress={() => window.open(currentProfile.portfolio_url, '_blank')}
                      >
                        <Ionicons name="briefcase-outline" size={20} color="#666" />
                        <Text style={styles.linkText}>Portfolio</Text>
                      </TouchableOpacity>
                    )}
                    {currentProfile.twitter_url && (
                      <TouchableOpacity 
                        style={styles.linkButton}
                        testID="twitter-link"
                        onPress={() => window.open(currentProfile.twitter_url, '_blank')}
                      >
                        <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                        <Text style={styles.linkText}>Twitter</Text>
                      </TouchableOpacity>
                    )}
                    {currentProfile.personal_website && (
                      <TouchableOpacity 
                        style={styles.linkButton}
                        testID="website-link"
                        onPress={() => window.open(currentProfile.personal_website, '_blank')}
                      >
                        <Ionicons name="globe-outline" size={20} color="#666" />
                        <Text style={styles.linkText}>Website</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {currentProfile.resume_url && (
                  <TouchableOpacity 
                    style={styles.resumeButton}
                    testID="resume-button"
                    onPress={() => window.open(currentProfile.resume_url, '_blank')}
                  >
                    <Ionicons name="document-text-outline" size={20} color="#0A84FF" />
                    <Text style={styles.resumeButtonText} testID="resume-button-text">View Resume</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.noResults} testID="no-results">
              <Ionicons name="search-outline" size={48} color="#999" />
              <Text style={styles.noResultsText} testID="no-results-text">No matches found</Text>
              <Text style={styles.noResultsSubtext} testID="no-results-subtext">Try adjusting your filters</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons} testID="action-buttons">
            <TouchableOpacity 
              style={[styles.button, styles.passButton]} 
              testID="pass-button"
              onPress={handlePass}
            >
              <Ionicons name="close-circle-outline" size={24} color="#666" />
              <Text style={styles.buttonText} testID="pass-button-text">Pass</Text>
            </TouchableOpacity>
            <View style={styles.buttonSeparator} testID="button-separator" />
            <TouchableOpacity 
              style={[styles.button, styles.interestedButton]} 
              testID="interested-button"
              onPress={handleInterested}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#0A84FF" />
              <Text style={[styles.buttonText, styles.interestedText]} testID="interested-button-text">Interested</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
    minHeight: '100%',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e1e1e1',
    borderRadius: Platform.OS === 'web' ? 32 : 0,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    } : {}),
  },
  webContainer: Platform.OS === 'web' ? {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  } : {},
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
    width: '100%',
    ...(Platform.OS === 'web' ? {
      WebkitOverflowScrolling: 'touch',
    } : {}),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'web' ? 56 : 72,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Platform.OS === 'web' ? 16 : 0,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#eee',
    ...(Platform.OS === 'web' ? {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    } : Platform.OS === 'android' ? {
      elevation: 4,
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  profileCard: {
    backfaceVisibility: 'hidden',
    ...(Platform.OS === 'web' ? {
      transform: 'translateZ(0)',
      perspective: 1000,
    } : {}),
  },
  experienceCard: {
    backfaceVisibility: 'hidden',
    marginBottom: 24,
    ...(Platform.OS === 'web' ? {
      transform: 'translateZ(0)',
      perspective: 1000,
    } : {}),
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    ...(Platform.OS === 'web' ? {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
    } : {}),
  },
  profileImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -150 }],
    ...(Platform.OS === 'web' ? {
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    } : {}),
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
    padding: 12,
    paddingLeft: 28,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  resumeButtonText: {
    fontSize: 16,
    color: '#0A84FF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: -1,
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
  linksSection: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 0 : 16,
  },
  linksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 0,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    height: 40,
    marginBottom: Platform.OS === 'web' ? 0 : 8,
  },
  linkText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

// Update web-specific CSS
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  const cssText = document.createTextNode(`
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      overscroll-behavior: none;
    }
    
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
    
    [data-testid="profile-scroll"] {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      overscroll-behavior: none;
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000;
      will-change: transform;
      height: calc(100vh - 140px) !important;
      max-height: calc(100vh - 140px) !important;
    }
    
    @media (max-width: 480px) {
      html, body, #root {
        height: 100%;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
      }
      [data-testid="app-container"] {
        border-radius: 0 !important;
      }
      [data-testid="profile-scroll"] {
        height: calc(100vh - 180px) !important;
        max-height: calc(100vh - 180px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 56px !important;
      }
      [data-testid="action-buttons"] {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        margin-top: -1px !important;
        transform: translateZ(0);
        z-index: 1000;
      }
      [data-testid="profile-card"],
      [data-testid="experience-card"] {
        border-radius: 16px !important;
      }
      [data-testid="profile-image-container"] {
        border-radius: 16px 16px 0 0 !important;
      }
      [data-testid="links-section"] {
        padding: 16px !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }
      [data-testid="links-grid"] {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }
      [data-testid="resume-button"] {
        margin-bottom: 0 !important;
        padding-bottom: 12px !important;
        border-bottom: none !important;
      }
      [data-testid="experience-card"] {
        padding-bottom: 0 !important;
        border-bottom: none !important;
      }
    }
  `);
  style.appendChild(cssText);
  document.head.appendChild(style);
}