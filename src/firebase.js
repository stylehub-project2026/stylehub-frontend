import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyALETSPylzXEcYgg__jC4URI0MekZhvJEM",
    authDomain: "stylehub-4c8aa.firebaseapp.com",
    projectId: "stylehub-4c8aa",
    storageBucket: "stylehub-4c8aa.firebasestorage.app",
    messagingSenderId: "174890568563",
    appId: "1:174890568563:web:a2f5261f5f262d8e055306",
    measurementId: "G-23SXYF0CYW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return await result.user.getIdToken();
};

export const signInWithFacebook = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    return await result.user.getIdToken();
};