import { useState } from 'react'
import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, RESET } from './queries'
import Recommended from './components/Recommended'
import { BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (books) => {
    let seen = new Set()
    const filtered = books.filter((item) => {
      let k = item.title
      console.log(k)
      return seen.has(k) ? false : seen.add(k)
    })
    console.log(filtered)
    return filtered
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

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

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(JSON.stringify(addedBook))
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })


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
