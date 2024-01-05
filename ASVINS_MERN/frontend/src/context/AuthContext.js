import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../components/firebaseConfig';
import { GoogleAuthProvider, RecaptchaVerifier, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({});

    function changeUserInfo(newUser) {
        setUserInfo(newUser);
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function googleLogIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    function logOut() {
        localStorage.setItem('token', null);
        localStorage.setItem('userInfo', null);
        return signOut(auth);
    }

    function setUpRecaptcha() {
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {}
        );
        return recaptchaVerifier;
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            const localInfo = localStorage.getItem('userInfo');
            setUserInfo(JSON.parse(localInfo));
        });

        return () => {
            unsub();
        };
    }, []);


    return (
        <authContext.Provider value={{user, userInfo, changeUserInfo, logIn, signUp, googleLogIn, logOut, setUpRecaptcha}}>
            {children}
        </authContext.Provider>
    );
}

export function UserAuth() {
    return useContext(authContext);
}