import { useState } from 'react'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient } from '@apollo/client'
import { RESET } from './queries'
import Recommended from './components/Recommended'


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const [reset, result] = useMutation(RESET)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    }

    if (result.data) {
      console.log(result.data)
    }
  }, [result.data])

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <Login
          setToken={setToken}
        />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => logout()}>Log Out</button>
        <button onClick={() => {
          logout()
          reset()
        }}>Reset Database</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommended show={page === "recommended"} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
