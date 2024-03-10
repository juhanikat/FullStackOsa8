import { useQuery } from "@apollo/client"
import { FAVORITE_GENRE_BOOKS } from "../queries"


const Recommended = (props) => {
    const result = useQuery(FAVORITE_GENRE_BOOKS)
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

    let books = result.data.favoriteGenreBooks

    return (
        <div>
            <h2>Recommendations</h2>
            <h3>books in your favorite genre patterns</h3>

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
        </div>
    )
}

export default Recommended
