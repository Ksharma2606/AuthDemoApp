//This is a change
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    // Fires on app start and whenever login/logout happens — on ALL platforms
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {user ? (
        <HomeScreen user={user} />
      ) : screen === 'login' ? (
        <LoginScreen goToSignUp={() => setScreen('signup')} />
      ) : (
        <SignUpScreen goToLogin={() => setScreen('login')} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
