import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bio: '',
    age: '',
    location: '',
    roleType: '',
    currentTitle: '',
    yearsOfExperience: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    imageUrl: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Create the user account
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to create account');
        return;
      }

      // Redirect to login page on success
      router.replace('/login');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0A84FF" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>Create Account</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="number-pad"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g., San Francisco, CA)"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Title"
            value={formData.currentTitle}
            onChangeText={(text) => setFormData({ ...formData, currentTitle: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Role Type (e.g., Full-time, Remote)"
            value={formData.roleType}
            onChangeText={(text) => setFormData({ ...formData, roleType: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Years of Experience"
            keyboardType="number-pad"
            value={formData.yearsOfExperience}
            onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio"
            multiline
            numberOfLines={4}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <TextInput
            style={styles.input}
            placeholder="LinkedIn URL"
            keyboardType="url"
            autoCapitalize="none"
            value={formData.linkedinUrl}
            onChangeText={(text) => setFormData({ ...formData, linkedinUrl: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="GitHub URL"
            keyboardType="url"
            autoCapitalize="none"
            value={formData.githubUrl}
            onChangeText={(text) => setFormData({ ...formData, githubUrl: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Portfolio URL"
            keyboardType="url"
            autoCapitalize="none"
            value={formData.portfolioUrl}
            onChangeText={(text) => setFormData({ ...formData, portfolioUrl: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Profile Image URL"
            keyboardType="url"
            autoCapitalize="none"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0A84FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginPromptText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 