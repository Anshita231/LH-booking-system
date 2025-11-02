// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyArbAteqawvqThAFK59sTQwGkJs8TbnfLI",
  authDomain: "lhmanagemnt.firebaseapp.com",
  projectId: "lhmanagemnt",
  storageBucket: "lhmanagemnt.appspot.com",
  messagingSenderId: "19094670454",
  appId: "1:19094670454:web:32d5e97d7395740d362357",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Auth provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Optional: Configure Google Provider to use specific scopes
provider.setCustomParameters({
  prompt: "select_account",
});

// Export the Firebase app (optional, if needed elsewhere)
export default app;
