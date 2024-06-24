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

const BOOKS_WITH_SPESIFIC_GENRE = gql`
    query booksWithSpesificGenre($genre: String!){
        allBooks(genre: $genre) {
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
const FAVORITE_GENRE_BOOKS = gql`
    query favoriteGenreBooks {
        favoriteGenreBooks {
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
        author {
            name
            born
        }
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
    } null
}`

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
    login(
        username: $username
        password: $password
    ) {
        value
    }
}`

const RESET = gql`
mutation deleteEverything {
    deleteEverything
}
`
export { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, CHANGE_BIRTHYEAR, LOGIN, RESET, FAVORITE_GENRE_BOOKS, BOOKS_WITH_SPESIFIC_GENRE }