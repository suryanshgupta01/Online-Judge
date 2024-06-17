import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'


const CustomContext = createContext();
const UseCustomContext = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
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
        return signInWithPopup(auth, provider)
    }
    const handleGithub = async () => {
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
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
            updatePassword1
        }}>
            {!loading && children}
        </CustomContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(CustomContext);
}
export default UseCustomContext