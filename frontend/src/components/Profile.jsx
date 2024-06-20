import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const baseURL = 'http://localhost:4000';

const Profile = () => {
    const { name1 } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${baseURL}/user/profile/${name1}`)
            .then(response => {
                if (response.msg) 
                    alert(response.msg)
                else
                    setUser(response.data[0]);
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [name1]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile of {user.name}</h1>
            <img src={user.profile_pic} alt="Profile" />
            <p>Email: {user.email}</p>
            <p>Contest Rating: {user.contest_rating}</p>
            {/* <p>Number of Problems Submitted: {user.problems_submitted}</p> */}
            <p>Admin Status: {user.isAdmin ? 'Yes' : 'No'}</p>
        </div>
    );
}

export default Profile;
