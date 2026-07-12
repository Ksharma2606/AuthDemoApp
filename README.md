# AuthDemoApp — React Native (Expo) with real Google & Email login on Mobile + Web

One codebase, three platforms: **iOS, Android, and Web**. Built with Expo + the Firebase **JS SDK** (not `@react-native-firebase`, which doesn't support web).

Auth features:
- Real email/password sign-up and sign-in (Firebase Auth)
- Real Google Sign-In:
  - **Web** → Firebase `signInWithPopup`
  - **iOS/Android** → `expo-auth-session` gets a Google ID token, exchanged for a Firebase credential
- Session persistence (stays logged in after closing the app/browser)

## 1. Create the project and copy these files in

```bash
npx create-expo-app AuthDemoApp --template blank
cd AuthDemoApp
```

Copy `App.js`, `index.js`, `app.json`, and the `src/` folder over the generated ones, then install:

```bash
npx expo install firebase expo-auth-session expo-crypto expo-web-browser @react-native-async-storage/async-storage react-dom react-native-web
```

## 2. Firebase setup (~5 min)

1. https://console.firebase.google.com → **Add project**
2. **Build → Authentication → Get started** → enable:
   - **Email/Password**
   - **Google**
3. Project settings → General → **Add app → Web** (</> icon). Copy the `firebaseConfig` object it shows you.
4. Paste it into **`src/firebase.js`**, replacing the placeholder.

That alone makes **email login work on all three platforms** and **Google login work on web**.

## 3. Google Sign-In on iOS/Android (native)

Native Google sign-in needs OAuth client IDs. In **Google Cloud Console → APIs & Services → Credentials** (same project as Firebase):

- A **Web client** already exists (Firebase created it when you enabled Google sign-in). Copy its ID.
- **Create Credentials → OAuth client ID → Android**: use your package name (`com.yourname.authdemoapp` from `app.json`) and your SHA-1 (`eas credentials` or `keytool` for your keystore).
- **Create Credentials → OAuth client ID → iOS**: use your bundle identifier from `app.json`.

Paste all three IDs into **`src/useGoogleSignIn.js`**:

```js
const WEB_CLIENT_ID = '...';
const IOS_CLIENT_ID = '...';
const ANDROID_CLIENT_ID = '...';
```

> Note: native Google sign-in requires a **development build** (`npx expo run:android` / `npx expo run:ios` or EAS build) — it won't work inside the Expo Go store app because Google OAuth is tied to your app's package name/bundle ID. Email login works fine in Expo Go.

## 4. Run it

```bash
npx expo start --web        # browser
npx expo run:android        # Android (dev build)
npx expo run:ios            # iOS (dev build, macOS only)
```

## 5. Web deployment note

When you host the web build somewhere (Netlify, Vercel, Firebase Hosting), add that domain in Firebase Console → **Authentication → Settings → Authorized domains**, or the Google popup will be blocked. `localhost` is authorized by default.

## Project structure

| File | Purpose |
|---|---|
| `App.js` | Auth state listener; routes between Login/SignUp/Home |
| `src/firebase.js` | Firebase init; AsyncStorage persistence on native, browser persistence on web |
| `src/useGoogleSignIn.js` | One hook, two flows: popup on web, expo-auth-session on native |
| `src/screens/LoginScreen.js` | Email sign-in + Google button |
| `src/screens/SignUpScreen.js` | Email registration |
| `src/screens/HomeScreen.js` | Profile info (photo, name, email, provider, platform) + sign out |

## Common issues

- **Google popup blocked on web** → domain not in Authorized domains (step 5), or the browser blocked the popup (must be triggered by a click, which this app does).
- **Native Google button does nothing / `invalid_client`** → wrong client IDs, or you're in Expo Go instead of a dev build.
- **`auth/operation-not-allowed`** → sign-in method not enabled in Firebase Console.
- **Logged out after app restart on native** → make sure `@react-native-async-storage/async-storage` is installed; `src/firebase.js` wires it up.
