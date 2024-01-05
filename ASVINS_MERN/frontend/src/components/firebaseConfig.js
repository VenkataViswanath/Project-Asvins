import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBKLVoUpX9D1vALRl_lFxtWWaIqdaxcI_I",
    authDomain: "asvins-auth.firebaseapp.com",
    projectId: "asvins-auth",
    storageBucket: "asvins-auth.appspot.com",
    messagingSenderId: "506283858170",
    appId: "1:506283858170:web:cc17900c91be5802409143",
    measurementId: "G-WEH8H8XQ5F",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
  
export default app;

// import firebase from 'firebase/compat/app';
// import 'firebase/auth'; // Add other Firebase services that you need

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

// export const auth = app.auth();
// export default app