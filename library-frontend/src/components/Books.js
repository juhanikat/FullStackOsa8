import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"


const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  let books = result.data.allBooks
  const genres = []
  for (let i in books) {
    const bookGenres = books[i].genres
    for (let a in bookGenres) {
      if (!genres.includes(bookGenres[a])) {
        genres.push(bookGenres[a])
      }
    }
  }
  genres.push("All Genres")

  if (filter && filter !== "All Genres") {
    books = books.filter((book) => book.genres.includes(filter))
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th key={1}>name</th>
            <th key={2}>author</th>
            <th key={3}>published</th>
          </tr>
          {books.map((a) => (
            <tr>
              <td key={a.title}>{a.title}</td>
              <td key={a.author.name}>{a.author.name}</td>
              <td key={a.published}>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre =>
          <button onClick={() => setFilter(genre)}>{genre}</button>
        )}
      </div>
    </div>
  )
}

export default Books
