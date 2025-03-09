import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainApp from './app/index';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 