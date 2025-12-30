-- creating the dbs for the blog.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE mangas (
    id SERIAL PRIMARY KEY,
    mal_id INTEGER UNIQUE NOT NULL,
    title_en TEXT,
    title_jp TEXT,
    author TEXT,
    genre TEXT,
    cover_url TEXT
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    manga_id INTEGER REFERENCES mangas(id),
    rating NUMERIC(3, 1) CHECK (rating >= 1 AND rating <= 10),
    summary TEXT,
    full_review TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);