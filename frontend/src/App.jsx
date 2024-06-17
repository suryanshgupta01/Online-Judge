import { useState, useContext } from 'react'
import { useUserContext } from './useCustomContext'
import './App.css'
const baseURL = 'http://localhost:4000'
function App() {
  const { currentUser, login, signup, logout } = useUserContext()
  const [name1, setName1] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(name1, email, password)
    try {
      await signup(email, password)
    } catch (err) {
      console.log(err)
    }
    if (currentUser) {
      fetch(`${baseURL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name1 ? name1 : currentUser.displayName,//firebase auth names
          userid: currentUser.uid,
          email: email
        })
      }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))
    }
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name1">Name</label>
          <input type="text" id='name1' value={name1} onChange={(e) => setName1(e.target.value)} />
          <label htmlFor="email">Email</label>
          <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='submit'>Submit</button>
          <button onClick={() => logout()}>LOGOUT</button>
        </form>
      </div>

    </>
  )
}

export default App
