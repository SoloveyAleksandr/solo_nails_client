import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLvi8TGZG6OEeSx4lziW_QRxg2KafVaZM",
  authDomain: "solo-nails-774ab.firebaseapp.com",
  projectId: "solo-nails-774ab",
  storageBucket: "solo-nails-774ab.appspot.com",
  messagingSenderId: "739028926152",
  appId: "1:739028926152:web:5b4aa1348ff27312bf2ffd"
};

export const app = initializeApp(firebaseConfig);
export const DB = getFirestore(app);
export const authentification = getAuth(app);
