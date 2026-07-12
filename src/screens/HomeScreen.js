import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function HomeScreen({ user }) {
  const handleLogout = () => {
    // signOut works identically on web, iOS, and Android with the JS SDK
    signOut(auth).catch(() => {});
  };

  const provider =
    user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email & password';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarLetter}>
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.title}>You're signed in 🎉</Text>

        <View style={styles.infoBox}>
          <Row label="Name" value={user.displayName || '—'} />
          <Row label="Email" value={user.email || '—'} />
          <Row label="Signed in via" value={provider} />
          <Row label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
          <Row label="Platform" value={Platform.OS} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      },
    }),
  },
  avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 16 },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarLetter: { color: '#fff', fontSize: 34, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 24 },
  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  rowLabel: { color: '#888', fontSize: 14 },
  rowValue: { color: '#111', fontSize: 14, fontWeight: '500', maxWidth: '60%' },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 48,
  },
  logoutText: { color: '#e53935', fontSize: 16, fontWeight: '600' },
});
