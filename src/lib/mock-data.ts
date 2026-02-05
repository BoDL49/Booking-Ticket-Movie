import { Movie, Genre, Person, MovieCast } from "@prisma/client"

export const MOCK_MOVIES = [
    {
        id: "movie-1",
        title: "Avatar: The Way of Water",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        duration: 192,
        posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=d9MyqW3xTuE",
        releaseDate: new Date("2022-12-16"),
        rating: 8.5,
        ageRating: "P",
        country: "USA",
        directorId: "director-1",
        genres: [{ genre: { name: "Sci-Fi", slug: "sci-fi" } }, { genre: { name: "Action", slug: "action" } }],
    },
    {
        id: "movie-2",
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        releaseDate: new Date("2008-07-18"),
        rating: 9.0,
        ageRating: "C16",
        country: "USA",
        directorId: "director-2",
        genres: [{ genre: { name: "Action", slug: "action" } }],
    },
]
