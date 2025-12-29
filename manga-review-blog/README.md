# Manga Review Blog

## 📖 Description
A personal blog and review platform designed to track and document manga reading progress. Users can post detailed reviews and ratings, which are persisted in a PostgreSQL database. The application integrates with the **Jikan API** (MyAnimeList) to automatically fetch manga metadata, covers, and details.

## 🚀 Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Frontend:** EJS (Embedded JavaScript templates), CSS, Vanilla JS
* **API Client:** Axios

## 🛠️ Features (Planned)
* **CRUD Functionality:** Create, read, update, and delete manga reviews.
* **API Integration:** Fetch official manga data and cover images via Jikan API.
* **Dynamic Routing:** Dedicated pages for individual manga summaries and full reviews.
* **Data Sorting:** Ability to sort reviews by date added, title, or personal rating.
* **Search:** Find specific manga titles within the local database.

## 📊 Current Status
* [x] Project Concept & Planning
* [x] Database Schema Design (Draw.io)
* [ ] Project Skeleton & Initial Commit
* [ ] Database Implementation
* [ ] API Integration & Route Handling

## ⚙️ Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Configure your local PostgreSQL database using the provided `queries.sql` file (Coming soon).
4. Run `nodemon index.js` to start the server.