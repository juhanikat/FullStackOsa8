const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
        me: async (root, args, context) => context.currentUser,
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let returned = Book.find({}).populate("author")
            if (args.author) {
                returned = Book.find({ author: args.author }).populate("author")
            }
            if (args.genre) {
                returned = Book.find({ genres: { "$in": [args.genre] } }).populate("author")
            }
            return returned
        },
        favoriteGenreBooks: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('not authenticated',
                    {
                        extensions:
                            { code: 'BAD_USER_INPUT' }
                    }
                )
            }

            const genre = context.currentUser.favoriteGenre
            return Book.find({ genres: { "$in": [genre] } }).populate("author")
        },
        allAuthors: async (root, args) => {
            return Author.find({})
        },
    },
    Mutation: {
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre, password: "secret" })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== "secret") {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('not authenticated',
                    {
                        extensions:
                            { code: 'BAD_USER_INPUT' }
                    }
                )
            }
            var author = await Author.findOne({ name: args.author })
            if (!author) {
                console.log("tehdään author")
                try {
                    author = new Author({ name: args.author })
                    await author.save()
                } catch (error) {
                    throw new GraphQLError('Saving author failed', {
                        extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error }
                    })
                }
            }
            const book = new Book({ ...args, author: author.id })
            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error }
                })
            }
            await book.populate("author")
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
            author.bookCount = author.bookCount + 1
            await author.save()
            return book
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('not authenticated',
                    {
                        extensions:
                            { code: 'BAD_USER_INPUT', }
                    }
                )
            }
            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo
            return author.save()
        },
        deleteEverything: async (root, args) => {
            // used to reset database to default values
            await Book.deleteMany({})
            await Author.deleteMany({})
            const author1 = new Author({ name: "Joku", born: 1991, bookCount: 1 })
            const author2 = new Author({ name: "JK Rowling", born: 1980, bookCount: 1 })
            await author1.save()
            await author2.save()
            const book1 = new Book({ title: "testikirja1", published: 2000, author: author1.id, genres: ["fiction", "comedy"] })
            const book2 = new Book({ title: "testikirja2", published: 1900, author: author2.id, genres: ["nonfiction", "drama", "fantasy"] })
            await book1.save()
            await book2.save()
            await User.deleteMany({})
            const user = new User({ username: "Juhani", favoriteGenre: "fiction", password: "secret" })
            await user.save()
            return "Done"
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    }

}

module.exports = resolvers