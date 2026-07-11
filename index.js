const express = require("express");
const path = require("path");
const fishionary = require("./Fishionary.json");

const FISHES = [[], [], [], [], [], [], []];
const [COMMON, UNCOMMON, RARE, EPIC, UNIQUE, LEGENDARY] = [
  10, 25, 50, 75, 300, 5000,
];
const weights = [
  550000, // Common
  350000, // Uncommon
  100000, // Rare
  10000, // Epic
  2500, // Unique
  500, // Legendary
  10, // Mythic
];

Object.keys(fishionary).forEach((key) => {
  const item = fishionary[key];
  const value = item.value;

  if (value <= COMMON) {
    FISHES[0].push({ ...item });
  } else if (value > COMMON && value <= UNCOMMON) {
    FISHES[1].push({ ...item });
  } else if (value > UNCOMMON && value <= RARE) {
    FISHES[2].push({ ...item });
  } else if (value > RARE && value <= EPIC) {
    FISHES[3].push({ ...item });
  } else if (value > EPIC && value <= UNIQUE) {
    FISHES[4].push({ ...item });
  } else if (value > UNIQUE && value <= LEGENDARY) {
    FISHES[5].push({ ...item });
  } else {
    FISHES[6].push({ ...item });
  }
});

const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

const getRandomCategory = () => {
  const randomWeight = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (randomWeight <= cumulativeWeight) return i;
  }

  return 0; // Fallback in case of any rounding issues
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "active", message: "Hello from Heroku!" });
});

app.get("/fish", (req, res) => {
  const category = getRandomCategory();
  const index = Math.floor(Math.random() * FISHES[category].length);
  const fish = FISHES[category][index];

  res.json(fish);
});

app.get("/fishImg/:id", (req, res) => {
  const filePath = path.join(__dirname, "fishImage", `${req.params.id}.png`);

  res.sendFile(filePath);
});

app.get("/fishAlert/:id", (req, res) => {
  const fishId = req.params.id;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          overflow: hidden;
          background: transparent;
        }

        img {
          position: absolute;
          width: 500px;
          left: 50%;
          transform: translateX(-50%);
          bottom: -500px;
          animation: slide 5s ease-in-out forwards;
        }

        @keyframes slide {
          0% {
            bottom: -500px;
          }

          20% {
            bottom: 50px;
          }

          80% {
            bottom: 50px;
          }

          100% {
            bottom: -500px;
          }
        }
      </style>
    </head>

    <body>
      <img src="/fishImg/${fishId}">
    </body>

    </html>
  `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
