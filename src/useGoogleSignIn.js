import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';

// Required for expo-auth-session to close the browser popup correctly
WebBrowser.maybeCompleteAuthSession();

// ⚠️ Replace with your OAuth client IDs from Google Cloud Console
// (Firebase auto-creates the web one when you enable Google sign-in;
//  see README for how to create the iOS/Android ones)
const WEB_CLIENT_ID = '725535567348-ar6pgt7uhtsm42th86pjkg6rh3gbnvf8.apps.googleusercontent.com';
const IOS_CLIENT_ID = '725535567348-rmte3haa82sl4khp2vc8ru7c6jagbgcn.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '725535567348-i7389e1q1ro1jr2a7hlo7q8k6d2hifa6.apps.googleusercontent.com';

/**
 * One hook, two strategies:
 * - Web  → Firebase's signInWithPopup (native browser popup, no extra config)
 * - iOS/Android → expo-auth-session gets a Google ID token,
 *   which we exchange for a Firebase credential
 *
 * Returns { signInWithGoogle, loading, error }
 */
export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  // Native flow: when the browser round-trip completes, exchange the token
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      if (!idToken) {
        setError('Google did not return an ID token.');
        setLoading(false);
        return;
      }
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else if (response.type === 'error') {
      setError(response.error?.message ?? 'Google sign-in failed.');
      setLoading(false);
    } else {
      // 'dismiss' / 'cancel' — user closed the dialog, not an error
      setLoading(false);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    if (Platform.OS === 'web') {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e) {
        // Popup closed by user is not a real error
        if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Native: opens the system browser; result arrives in the useEffect above
      try {
        await promptAsync();
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    }
  };

  return { signInWithGoogle, loading, error, ready: Platform.OS === 'web' || !!request };
}
