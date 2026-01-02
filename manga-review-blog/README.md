# Mangaboxd 📖

## 📖 Description
A personal manga journal and review platform inspired by Letterboxd. Mangaboxd allows users to track their reading progress, document their thoughts, and maintain a persistent library of reviews. The application bridges the gap between a personal database and the massive MyAnimeList library by integrating with the **Jikan API** to fetch high-quality metadata and cover art automatically.

## 🚀 Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Relational storage for reviews and manga metadata)
* **Frontend:** EJS (Embedded JavaScript), CSS (Custom Flexbox/Grid layout), Vanilla JS
* **API Client:** Axios (Jikan API / MyAnimeList)

## 🛠️ Features
* **Full CRUD Functionality:** Users can Create, Read, Update, and Delete reviews with immediate database persistence.
* **API Integration:** Dynamic search functionality that pulls official manga titles, Japanese names, authors, and covers from the Jikan API.
* **Smart Search:** Search results limited to top 10 matches to ensure UI clarity and performance.
* **Relational Database:** Optimized PostgreSQL schema using `JOIN` queries to link reviews with manga metadata.
* **Dynamic Sorting:** Toggle between sorting by Date Added, Title, or Personal Rating (ASC/DESC).
* **Responsive Reader View:** A minimalist, distraction-free layout for reading full-length reviews.

## 📊 Project Status & Roadmap
* [x] Project Concept & Planning
* [x] Database Schema Design (One-to-Many relationship)
* [x] Full CRUD Implementation (Update/Delete logic)
* [x] Jikan API Integration & Manga Search

### 🔮 Future Roadmap (Next Steps)
* **User Accounts:** Implement a userbase system with authentication (Passport.js/Bcrypt).
* **Community Reviews:** Allow different users to post separate reviews for the same manga title.
* **Section Expansion:** Create a dedicated **Anime Review** section with unique metadata (Episodes, Studios).
* **Advanced Search:** Add filters for Genre, Status (Publishing/Finished), and Score range.
* **Styling Refinement:** Continuous UI/UX polish to enhance the "Letterboxd" aesthetic.
