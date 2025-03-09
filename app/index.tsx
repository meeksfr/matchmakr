import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>matchmakr</Text>
          <Text style={styles.tagline}>Find your next tech opportunity</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="login" style={styles.link}>
            <Pressable style={[styles.button, styles.loginButton]}>
              <Text style={[styles.buttonText, styles.loginText]}>Log In</Text>
            </Pressable>
          </Link>
          
          <View style={styles.buttonSpacer} />
          
          <Link href="signup" style={styles.link}>
            <Pressable style={[styles.button, styles.signupButton]}>
              <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
            </Pressable>
          </Link>

          <View style={styles.buttonSpacer} />
          
          <Link href="pages/main" style={styles.link}>
            <Pressable style={[styles.button, styles.skipButton]}>
              <Text style={[styles.buttonText, styles.skipText]}>Skip to Main</Text>
            </Pressable>
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
  },
  buttonSpacer: {
    height: 16,
  },
  link: {
    width: '100%',
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
  skipButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#666',
  },
  skipText: {
    color: '#666',
  },
}); 