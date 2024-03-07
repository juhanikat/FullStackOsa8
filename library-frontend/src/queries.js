import { gql } from "@apollo/client"

const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            author {
                name
                born
            }
            published
            genres
        }
    }
`

const ADD_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
        title: $title
        author: $author
        published: $published
        genres: $genres
    ) {
        title
        published
        genres
    }
}
`

const CHANGE_BIRTHYEAR = gql`
mutation changeBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(
        name: $name
        setBornTo: $setBornTo
    ) {
        name
        born
    }null
}

`

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
    login(
        username: $username
        password: $password
    ) {
        value
    }
}`

export { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, CHANGE_BIRTHYEAR, LOGIN }