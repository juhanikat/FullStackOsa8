import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: { ...headers, Authorization: token ? `Bearer ${token}` : null }
    }
})

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})


ReactDOM.createRoot(document.getElementById('root')).render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>)