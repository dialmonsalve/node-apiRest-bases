import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '71382312',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [genres] = await connection.query(
        'SELECT HEX(id) AS id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre]
      )
      if (genres.length === 0) return []

      const [{ id }] = genres
      console.log(id)

      return []
    }

    const [movies] = await connection.query('SELECT HEX(id) AS id, title, year, director, duration, poster, rate FROM movie;')

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, HEX(id) id FROM movie WHERE HEX(id) = ?', [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    await connection.query(
      "INSERT INTO  movie (id, title, year, director, duration, poster, rate) VALUES ( (UNHEX(REPLACE(?, '-', ''))), ?, ?, ?, ?, ?, ?)", [uuid, title, year, director, duration, poster, rate]
    )

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, HEX(id) id FROM movie WHERE HEX(id) = ?', [uuid]
    )

    console.log(movies[0])

    return movies[0]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
