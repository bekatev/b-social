import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAH6Gg_z0yeQLTN0qItzWmGjiZIG5EL04",
  authDomain: "b-social-dd7a3.firebaseapp.com",
  projectId: "b-social-dd7a3",
  storageBucket: "b-social-dd7a3.appspot.com",
  messagingSenderId: "556778966076",
  appId: "1:556778966076:web:edb5cf5cc5562450780739",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence to local (user session will persist across reloads)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { auth, db };
