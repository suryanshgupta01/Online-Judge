import React, { useState, useContext } from 'react'
import { useUserContext } from '../useCustomContext'
import { useParams } from 'react-router-dom'
const baseURL = 'http://localhost:4000'

const Profile = () => {

    const { name1 } = useParams();

    return (<>Profile of {name1}</>)
}

export default Profile