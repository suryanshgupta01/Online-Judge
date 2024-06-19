import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { browserPopupRedirectResolver, OAuthProvider, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, TwitterAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import axios from 'axios'


const CustomContext = createContext();
const UseCustomContext = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function signup(email, password) {
        await auth.createUserWithEmailAndPassword(email, password)
        try {
            axios.post(`${baseURL}/user/register`, {
                name: currentUser.displayName || 'User',
                userid: currentUser.uid,
                email: currentUser.email || email
            })
            .then(response => console.log(response))
            .catch(error => console.log(error))

        } catch (err) {
            console.log(err)
        }
    }

    async function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail1(email) {
        return auth.currentUser.updateEmail(email)
    }

    function updatePassword1(password) {
        return auth.currentUser.updatePassword(password)
    }
    function deleteUser() {
        return auth.currentUser.delete()
    }
    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider, browserPopupRedirectResolver)
    }
    const handleGithub = async () => {
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider, browserPopupRedirectResolver)
    }
    const handleMicrosoft = async () => {
        const provider = new OAuthProvider('microsoft.com')
        return signInWithPopup(auth, provider, browserPopupRedirectResolver)

    }
    const handleTwitter = async () => {
        const provider = new TwitterAuthProvider()
        return signInWithPopup(auth, provider, browserPopupRedirectResolver)

    }
    const handleFacebook = async () => {
        const provider = new FacebookAuthProvider()
        return signInWithPopup(auth, provider, browserPopupRedirectResolver)
    }
    const handleCreateUser = async (user) => {
        const baseURL = 'http://localhost:4000'
        if(!user)return
        const name1 = user.displayName || 'User'
        console.log(name1, user.uid, user.email)
        axios.post(`${baseURL}/user/register`, {
            name: name1,
            userid: user.uid,
            email: user.email
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            handleCreateUser(user)
            console.log(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    return (
        <CustomContext.Provider value={{
            currentUser,
            login,
            signup,
            logout,
            handleGoogle,
            handleGithub,
            deleteUser,
            resetPassword,
            updateEmail1,
            updatePassword1,
            handleMicrosoft,
            handleTwitter,
            handleFacebook
        }}>
            {!loading && children}
        </CustomContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(CustomContext);
}
export default UseCustomContext