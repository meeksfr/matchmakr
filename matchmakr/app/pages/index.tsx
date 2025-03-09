import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>matchmakr</Text>
          <Text style={styles.tagline}>Find your next tech opportunity</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity style={[styles.button, styles.loginButton]}>
              <Text style={[styles.buttonText, styles.loginText]}>Log In</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/signup" asChild>
            <TouchableOpacity style={[styles.button, styles.signupButton]}>
              <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0A84FF',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0A84FF',
  },
  loginText: {
    color: '#0A84FF',
  },
  signupButton: {
    backgroundColor: '#0A84FF',
  },
  signupText: {
    color: '#fff',
  },
}); 