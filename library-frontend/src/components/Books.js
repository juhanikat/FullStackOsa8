import { useQuery } from "@apollo/client"
import { ALL_BOOKS, BOOKS_WITH_SPESIFIC_GENRE } from "../queries"
import { useState } from "react"


const Books = (props) => {
  const [genre, setGenre] = useState("")
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(BOOKS_WITH_SPESIFIC_GENRE, {
    variables: { genre }
  })
  if (!props.show) {
    return null
  }

  if (allBooksResult.loading || filteredBooksResult.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  let books = allBooksResult.data.allBooks

  const allGenres = []
  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!allGenres.includes(genre)) {
        allGenres.push(genre)
      }
    })
  })

  if (genre) {
    books = filteredBooksResult.data.allBooks
  }

  return (
    <div>
      <h2>books</h2>

      <table key="table">
        <tbody key="body">
          <tr key="tr1">
            <th key="1">name</th>
            <th key="2">author</th>
            <th key="3">published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title + a.author.name}>
              <td key={a.title}>{a.title}</td>
              <td key={a.author.name}>{a.author.name}</td>
              <td key={a.published}>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map(genre =>
          <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
        )}
        <button onClick={() => setGenre("")}>All Genres</button>
      </div>
    </div>
  )
}

export default Books
