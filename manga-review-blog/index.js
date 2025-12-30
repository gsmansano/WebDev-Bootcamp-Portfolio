import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const { Pool } = pg;

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "manga-reviews",
  password: "qwerty",
  port: 5432,
});

db.connect();

// a few test arrays. will be substituted for db queries later.
let mangas = [
  {
    id: 1,
    mal_id: 1,
    title_en: "One Piece",
    title_jp: "One Piece",
    author: "Eichiro Oda",
    genre: ["Action", "Adventure"],
    cover_url: "www.google.com",
  },
  {
    id: 2,
    mal_id: 2,
    title_en: "Naruto",
    title_jp: "Naruto",
    author: "Naruto's Author",
    genre: ["Action", "Ninja"],
    cover_url: "www.facebook.com",
  },
];
let users = [{ id: 1, username: "Geovane", password: "123456" }];
let reviews = [
  {
    id: 1,
    user_id: 1,
    manga_id: 1,
    rating: 10,
    summary: "Summary of One Piece",
    full_review: "Full review of one piece",
    date_added: Date(),
  },
  {
    id: 2,
    user_id: 1,
    manga_id: 2,
    rating: 9,
    summary: "Summary of Naruto Shipuuden",
    full_review: "Etc",
    date_added: Date(),
  },
];

// home page with all review summary.
app.get("/", async (req, res) => {
  // this route will eventually fetch the db for the info
  res.render("index.ejs", { reviews, mangas, users });
});

// full review pages.
app.get("/review/:id", (req, res) => {
  const id = parseInt(req.params.id);

  //these will be actually queries fetched from the DB
  const foundReview = reviews.find((r) => r.id === id);
  const foundManga = mangas.find(
    (m) => m.id === foundReview.manga_id
  );

  res.render("post.ejs", {
    review: foundReview,
    manga: foundManga,
  });
});

// search page that gets data from jikan/mal to create a new review.
app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.render("search.ejs", { results: [] });
  }

  try {
    const response = await axios.get(
      `https://api.jikan.moe/v4/manga?q=${query}&limit=5`
    );

    const results = response.data.data;

    res.render("search.ejs", { results: results, searchQuery: query });
  } catch (error) {
    res.status(500).send("Error fetching from Jikan");
  }
});

// write review page, once user selects an anime.
app.post("/write-review", async (req, res) => {
  const id = parseInt(req.body.mal_id);

  try {
    // here we get the full info from the chosen manga
    const response = await axios.get(
      `https://api.jikan.moe/v4/manga/${id}/full`
    );
    const mangaData = response.data.data;

    // here we'd save the necessary info for the db
    // insert queries.

    res.render("editor.ejs", { manga: mangaData });
  } catch (error) {
    res.status(500).send("Error loading manga details");
  }
});

app.post("/save-review", (req, res) => {
    // Destructure the data coming from editor
    const { mal_id, title, image_url, author, rating, summary, full_review } = req.body;

    // check if this manga is already in the db
    // all this will become a query
    const mangaExists = mangas.find(m => m.id === parseInt(mal_id));

    if (!mangaExists) {
        mangas.push({
            id: parseInt(mal_id),
            title_en: title,
            author: author,
            cover_image: image_url
        });
    }

    // new review object
    const newReview = {
        id: reviews.length + 1, 
        manga_id: parseInt(mal_id),
        user_id: 1, // hardcoded for now
        rating: rating,
        summary: summary,
        full_review: full_review,
        date_added: new Date().toLocaleDateString()
    };

    // 4. Push to reviews array and go back home
    reviews.push(newReview);
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
