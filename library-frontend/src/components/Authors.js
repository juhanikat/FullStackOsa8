import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, CHANGE_BIRTHYEAR } from "../queries"
import { useState } from "react"
import Select from "react-select"

const BirthYearChangeForm = (props) => {
  const [changeBirthYear] = useMutation(CHANGE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const [born, setBorn] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const authorOptions = props.authors.map((author) => ({ value: author.name, label: author.name }))

  const submit = async (event) => {
    event.preventDefault()
    if (!selectedAuthor) {
      return
    }
    changeBirthYear({ variables: { name: selectedAuthor.value, setBornTo: Number(born) } })
    setBorn("")
    event.target.born.value = ""
  }

  return (
    <div>
      <form onSubmit={submit}>
        <Select defaultValue={selectedAuthor} onChange={setSelectedAuthor} options={authorOptions} />
        born
        <input name="born" onChange={({ target }) => setBorn(target.value)}></input>
        Submit
        <input type="submit"></input>
      </form>
    </div>
  )
}


const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

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

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYearChangeForm authors={authors} />
    </div>
  )
}

export default Authors
