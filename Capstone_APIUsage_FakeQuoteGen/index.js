import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const animeBaseUrl = "https://api.animechan.io/v1";
const imageBaseUrl = "https://picsum.photos/400";
let isGrayscale;
let amountBlur;
const fallbackQuotes = [
  {
    quote: "The world is full of choices. Choose who you want to become.",
    anime: "Fake Anime",
    character: "Wise Old Master",
  },
  {
    quote: "If you can’t find the path, create your own.",
    anime: "Fake Shonen",
    character: "Hero MC",
  },
  {
    quote: "Every day is a chance to restart your journey.",
    anime: "Slice of Life Tales",
    character: "Main Girl",
  },
];
let celebrity;

app.get("/", async (req, res) => {
  let quoteData;
  try {
    try {
      const animeResponse = await axios.get(`${animeBaseUrl}/quotes/random`);

      quoteData = {
        quote: animeResponse.data.data.content,
        anime: animeResponse.data.data.anime?.name || "Unknown anime",
        character:
          animeResponse.data.data.character?.name || "Unknown character",
      };
    } catch (error) {
      console.error("Anime API failed:", error.message);
      quoteData = getFallbackQuote();
    }

    isGrayscale = getRandomBool();
    amountBlur = getRandomNumber();

    console.log(isGrayscale, amountBlur);

    let imageUrl = `${imageBaseUrl}?blur=${amountBlur}`;

    if (isGrayscale) {
      imageUrl += "&grayscale";
    }

    celebrity = getRandomCelebrity();

    res.render("index.ejs", { data: quoteData, imageUrl, celebrity });

  } catch (error) {
    console.error(error.message);
    res.render("index.ejs", {
      data: null,
      imageUrl: null,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getRandomNumber() {
  return Math.floor(Math.random() * 3) + 1;
}

function getRandomBool() {
  return Math.random() < 0.5;
}

function getFallbackQuote() {
  const index = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[index];
}

function getRandomCelebrity() {
  const celebrities = [
    "Albert Einstein",
    "Marie Curie",
    "Leonardo da Vinci",
    "Isaac Newton",
    "Nikola Tesla",
    "Galileo Galilei",
    "Aristotle",
    "Cleopatra",
    "Julius Caesar",
    "Alexander the Great",
    "Genghis Khan",
    "Nelson Mandela",
    "Mahatma Gandhi",
    "Martin Luther King Jr.",
    "Mother Teresa",
    "Winston Churchill",
    "Queen Elizabeth II",
    "Napoleon Bonaparte",
    "Abraham Lincoln",
    "George Washington",
    "Beyoncé",
    "Taylor Swift",
    "Ariana Grande",
    "Dwayne Johnson",
    "Zendaya",
    "Tom Cruise",
    "Scarlett Johansson",
    "Keanu Reeves",
    "Chris Hemsworth",
    "Angelina Jolie",
    "Elon Musk",
    "Mark Zuckerberg",
    "Bill Gates",
    "Steve Jobs",
    "Jennifer Lawrence",
    "Robert Downey Jr.",
    "Morgan Freeman",
    "Emma Watson",
    "Brad Pitt",
    "Johnny Depp",
    "Oprah Winfrey",
    "Kim Kardashian",
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Michael Jordan",
    "Serena Williams",
    "Usain Bolt",
    "Bruce Lee",
    "Frida Kahlo",
    "Vincent van Gogh"
  ];

  return celebrities[Math.floor(Math.random() * celebrities.length)];
}
