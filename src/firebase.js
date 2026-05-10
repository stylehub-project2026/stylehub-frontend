import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDkjCqlSPnwTbcY2uq_KoZXIws4XeJB1gw",
    authDomain: "stylehub-4d407.firebaseapp.com",
    projectId: "stylehub-4d407",
    storageBucket: "stylehub-4d407.firebasestorage.app",
    messagingSenderId: "1028038834629",
    appId: "1:1028038834629:web:e2f799db37fbf3ec2373ac",
    measurementId: "G-3W6MBJGWVP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return idToken;
};

export const signInWithFacebook = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    const idToken = await result.user.getIdToken();
    return idToken;
};