import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAIzsUMpUC6_zSlZtTHLmiA5UGlYZl3CPY",
    authDomain: "leaderbored-c1ea2.firebaseapp.com",
    projectId: "leaderbored-c1ea2",
    storageBucket: "leaderbored-c1ea2.appspot.com",
    messagingSenderId: "1043865417419",
    appId: "1:1043865417419:web:970c2594274dc4d2798d4e",
    measurementId: "G-18P8KDGWMY"
};

initializeApp(firebaseConfig);

export const db = getFirestore();