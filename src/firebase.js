import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDIxBAfsyZYNvq7Vux3b6IcwIwx1kvz8mE",
  authDomain: "authdemoapp-351e0.firebaseapp.com",
  projectId: "authdemoapp-351e0",
  storageBucket: "authdemoapp-351e0.firebasestorage.app",
  messagingSenderId: "725535567348",
  appId: "1:725535567348:web:3bfd3b6e50d18bd4205da1",
};

const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export default app;