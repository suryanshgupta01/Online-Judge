import { useState, useContext } from 'react'
import { useUserContext } from './useCustomContext'
import { Route, useParams, Link, RouterProvider, createBrowserRouter } from "react-router-dom";

import './App.css'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Problems from './components/Problems'
import Contests from './components/Contests'
import Signin from './components/Signin'
import Navbar from './components/navbar'
import ErrorPage from './components/ErrorPage';
import LandingPage from './components/LandingPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  }, {
    path: '/problems',
    element: <Problems />
  },
  {
    path: '/problem',
    element: <Problems />
  },
  {
    path: '/contests',
    element: <Contests />
  },
  {
    path: "/profile/:name1",
    element: <Profile />
  }, 
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/signin',
    element: <Signin />
  },

  {
    path: "*",
    element: <ErrorPage />
  }
])
function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  )
}

export default App
