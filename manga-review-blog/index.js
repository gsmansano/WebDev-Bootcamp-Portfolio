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

// home page with all review summary.
app.get("/", async (req, res) => {
  // some toggling logic for the main page
  const sort = req.query.sort || "date";
  const dir = req.query.dir === "asc" ? "asc" : "desc";

  let sortColumn = "reviews.date_added"; // date desc is the standard sorting
  if (sort === "rating") sortColumn = "reviews.rating";
  if (sort === "title") sortColumn = "mangas.title_en";

  try {
    // this query will join the reviews and some manga info saved in the db.
    const queryResult = await db.query(
      `SELECT reviews.id AS review_id, reviews.*, mangas.title_en, mangas.cover_url 
       FROM reviews 
       JOIN mangas ON reviews.manga_id = mangas.id
       ORDER BY ${sortColumn} ${dir.toUpperCase()};`
    );

    res.render("index.ejs", {
      reviews: queryResult.rows,
      currentSort: sort,
      currentDir: dir,
      pageTitle: "All Reviews",
      activePage: "home",
    });
  } catch (err) {
    console.error(err);
    res.send("Error fetching reviews from database.");
  }
});

// unitary full review page.
app.get("/review/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query(
      `SELECT
        reviews.id AS review_id,
        reviews.rating,
        reviews.full_review,
        reviews.date_added,
        mangas.* FROM reviews
        JOIN mangas ON reviews.manga_id = mangas.id

        WHERE reviews.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Review not found.");
    }

    const reviewData = result.rows[0];

    res.render("post.ejs", {
      data: reviewData,
      pageTitle: "Full Review",
      activePage: "post",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
});

// search page that gets data from jikan/mal to create a new review.
app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.render("search.ejs", {
      results: [],
      searchQuery: "",
      pageTitle: "Search",
      activePage: "search",
    });
  }

  try {
    const response = await axios.get(
      `https://api.jikan.moe/v4/manga?q=${query}&limit=10`
    );

    const results = response.data.data;

    res.render("search.ejs", {
      results: results,
      searchQuery: query,
      pageTitle: "Search",
      activePage: "search",
    });
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
    // and we pass it along to our review editor page.
    const mangaData = response.data.data;
    res.render("editor.ejs", {
      manga: mangaData,
      isEditing: false,
      pageTitle: "New Review",
      activePage: "editor",
    });
  } catch (error) {
    res.status(500).send("Error loading manga details");
  }
});

app.post("/save-review", async (req, res) => {
  // Destructure the data coming from editor
  const {
    mal_id,
    title,
    title_jp,
    image_url,
    author,
    genre,
    rating,
    summary,
    full_review,
  } = req.body;

  try {
    // we save the relevant information from the manga on our db so the website can function without jikan
    const mangaResult = await db.query(
      `INSERT INTO mangas (mal_id, title_en, title_jp, author, genre, cover_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (mal_id) 
       DO UPDATE SET mal_id = EXCLUDED.mal_id 
       RETURNING id`,
      [mal_id, title, title_jp, author, genre, image_url]
    );

    // grabbing the serial id
    const mangaId = mangaResult.rows[0].id;

    await db.query(
      `
        INSERT INTO reviews (
        user_id,
        manga_id,
        rating,
        summary,
        full_review)
        VALUES ($1, $2, $3, $4, $5)`,
      [1, mangaId, rating, summary, full_review]
    );

    res.redirect("/");
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Could not save review to database.");
  }
});

// edit review.
app.get("/edit-review/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(
      `SELECT reviews.*, mangas.title_en, mangas.cover_url, mangas.author 
       FROM reviews 
       JOIN mangas ON reviews.manga_id = mangas.id 
       WHERE reviews.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).send("Review not found");

    res.render("editor.ejs", {
      manga: result.rows[0],
      isEditing: true,
      pageTitle: "Edit Review",
      activePage: "editor",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching review for edit");
  }
});

// post route for edited review
app.post("/update-review/:id", async (req, res) => {
  const id = req.params.id;
  const { rating, summary, full_review } = req.body;

  try {
    await db.query(
      "UPDATE reviews SET rating = $1, summary = $2, full_review = $3 WHERE id = $4",
      [rating, summary, full_review, id]
    );
    res.redirect(`/review/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// delete a review route
app.post("/delete-review/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting review");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
