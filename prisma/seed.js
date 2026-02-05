const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const dotenv = require('dotenv')

const result = dotenv.config()
console.log("Dotenv result:", result)
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing!")
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {

    console.log("🌱 Starting seed...")

  // 1. Cleanup
  await prisma.bookingItem.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.showtime.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.cinemaHall.deleteMany()
  await prisma.movieCast.deleteMany()
  await prisma.movieGenre.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.person.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Genres
  const genres = await Promise.all([
    prisma.genre.create({ data: { name: "Action", slug: "action" } }),
    prisma.genre.create({ data: { name: "Sci-Fi", slug: "sci-fi" } }),
    prisma.genre.create({ data: { name: "Romance", slug: "romance" } }),
    prisma.genre.create({ data: { name: "Horror", slug: "horror" } }),
  ])
  
  const [action, scifi, romance, horror] = genres

  // 3. Create Persons (Directors & Actors)
  const nolan = await prisma.person.create({
    data: { name: "Christopher Nolan", bio: "Master of time." }
  })
  
  const cameron = await prisma.person.create({
    data: { name: "James Cameron", bio: "Deep sea explorer." }
  })

  const bale = await prisma.person.create({
    data: { name: "Christian Bale", bio: "The Dark Knight." }
  })

  const zoe = await prisma.person.create({
    data: { name: "Zoe Saldana", bio: "Queen of Sci-Fi." }
  })

  // 4. Create Movies
  const darkKnight = await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      duration: 152,
      releaseDate: new Date("2008-07-18"),
      rating: 9.0,
      ageRating: "C16",
      country: "USA",
      directorId: nolan.id,
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      genres: { create: [{ genreId: action.id }] },
      cast: { create: [{ personId: bale.id, characterName: "Bruce Wayne / Batman" }] }
    }
  })

  const avatar = await prisma.movie.create({
    data: {
      title: "Avatar: The Way of Water",
      description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
      duration: 192,
      releaseDate: new Date("2022-12-16"),
      rating: 8.5,
      ageRating: "P",
      country: "USA",
      directorId: cameron.id,
      posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=d9MyqW3xTuE",
      genres: { create: [{ genreId: scifi.id }, { genreId: action.id }] },
      cast: { create: [{ personId: zoe.id, characterName: "Neytiri" }] }
    }
  })

  // 5. Create Cinema Halls (Variable Layouts)
  
  // --- Hall 1 (IMAX - Straight standard grid) ---
  const imaxHall = await prisma.cinemaHall.create({
    data: { name: "IMAX Hall 1", totalSeats: 80 }
  })

  const imaxRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  for (const row of imaxRows) {
    for (let i = 1; i <= 10; i++) {
        let type = "STANDARD"
        if (row === 'E' || row === 'F') type = "VIP"
        if (row === 'H') type = "COUPLE"
        
        await prisma.seat.create({
            data: { hallId: imaxHall.id, row, number: i, type }
        })
    }
  }

  // --- Hall 2 (Standard - Complex Layout with Gaps) ---
  const standardHall = await prisma.cinemaHall.create({
    data: { name: "Rạp 02 (Standard)", totalSeats: 94 }
  })

  // Define layout configuration for Hall 2
  // Format: [rowLabel, startNum, endNum, type, excludeNums[]]
  const hall2Config = [
    { row: 'A', start: 1, end: 12, type: 'STANDARD' },
    { row: 'B', start: 1, end: 12, type: 'STANDARD' },
    { row: 'C', start: 1, end: 12, type: 'STANDARD' },
    { row: 'D', start: 1, end: 12, type: 'STANDARD' },
    { row: 'E', start: 1, end: 12, type: 'STANDARD' },
    { row: 'F', start: 1, end: 12, type: 'STANDARD' },
    { row: 'G', start: 1, end: 11, type: 'VIP' },    // Slightly shorter
    { row: 'H', start: 1, end: 11, type: 'VIP' },
    { row: 'I', start: 1, end: 4, type: 'COUPLE' }   // 4 Couple seats detached
  ]

  for (const cfg of hall2Config) {
      for (let i = cfg.start; i <= cfg.end; i++) {
          await prisma.seat.create({
              data: {
                  hallId: standardHall.id,
                  row: cfg.row,
                  number: i,
                  type: cfg.type
              }
          })
      }
  }


  // 6. Create Showtimes
  // Today at 20:00 for Dark Knight (2D) in IMAX Hall 1
  const today = new Date()
  today.setHours(20, 0, 0, 0)
  
  await prisma.showtime.create({
    data: {
        movieId: darkKnight.id,
        hallId: imaxHall.id,
        startTime: today,
        basePrice: 120000,
        format: "IMAX",
        language: "VIETSUB"
    }
  })

  // Tomorrow at 19:00 for Avatar (3D) in Standard Hall 2
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(19, 0, 0, 0)

  await prisma.showtime.create({
    data: {
        movieId: avatar.id,
        hallId: standardHall.id,
        startTime: tomorrow,
        basePrice: 90000,
        format: "THREE_D",
        language: "VIETSUB"
    }
  })

  // Add another showtime for Dark Knight in Hall 2 to test layout
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)
  dayAfter.setHours(18, 30, 0, 0)

  await prisma.showtime.create({
    data: {
        movieId: darkKnight.id,
        hallId: standardHall.id, 
        startTime: dayAfter,
        basePrice: 85000,
        format: "TWO_D",
        language: "VIETSUB"
    }
  })


  // 7. Create Admin User
  const password = await bcrypt.hash("admin123", 10)
  await prisma.user.create({
    data: {
        email: "admin@vibeticket.com",
        name: "Admin User",
        password,
        role: "ADMIN"
    }
  })

  console.log("✅ Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
