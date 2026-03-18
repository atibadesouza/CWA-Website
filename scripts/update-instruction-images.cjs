const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "prisma", "dev.db"));
const update = db.prepare("UPDATE Recipe SET instructionImages = ? WHERE slug = ?");

// Step numbers are 1-indexed from API, convert to 0-indexed for our array
// Format: { "0": "/images/recipes/slug/gallery-N.jpg" }
// Gallery images are numbered in the order they appear in the recipe

const mappings = {
  "no-knead-pull-apart-yeast-dinner-rolls": {
    // step 1 -> gallery-1, step 5 -> gallery-2, step 6 -> gallery-3, etc.
    "0": 1, "4": 2, "5": 3, "6": 4, "10": 5, "11": 6, "12": 7, "13": 8, "21": 9
  },
  "sourdough-bagel": {
    "6": 1, "8": 2, "9": 3, "10": 4, "11": 5, "12": 6, "17": 7, "20": 8, "22": 9, "23": 10, "24": 11
  },
  "sourdough-berry-galette": {
    "1": 1, "2": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "13": 10, "17": 11, "19": 12, "21": 13, "24": 14, "26": 15, "27": 16
  },
  "authentic-trini-coconut-sweetbread": {
    "0": 1
  },
  "date-night-shrimp-cocktail": {
    "0": 1, "1": 2, "4": 3, "5": 4, "6": 5
  },
  "sourdough-cinnamon-raisin-bread": {
    "2": 1, "4": 2, "7": 3, "9": 4, "15": 5, "19": 6, "20": 7, "21": 8
  },
  "coconut-ice-cream": {
    "0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "6": 6
  },
  "easy-4-ingredient-no-knead-rolls": {
    "0": 1, "3": 2
  },
  "stewed-red-beans-trinidad-style": {
    "0": 1, "6": 2
  },
  "cast-iron-cornbread": {
    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6
  },
  "sourdough-cranberry-orange-muffins": {
    "1": 1, "2": 2, "5": 3, "6": 4, "7": 5, "8": 6
  },
  "smh-biscuits": {
    "3": 1, "4": 2, "5": 3, "6": 4, "9": 5, "10": 6
  },
  "fragrant-lemon-herb-salmon": {
    "2": 1, "4": 2, "5": 3
  },
  "crispy-air-fried-zucchini-fries": {
    "0": 1, "1": 2, "2": 3, "3": 4, "4": 5
  },
  "broiled-sweet-thai-chili-salmon-and-spinach": {
    "1": 1, "2": 2, "3": 3
  },
  "crispy-chunky-granola": {
    "1": 1, "5": 2, "6": 3, "7": 4, "8": 5, "9": 6
  },
  "the-legit-jamaican-coco-bread-recipe": {
    "0": 1, "3": 2, "5": 3, "6": 4, "7": 5, "9": 6
  },
};

let updated = 0;
for (const [slug, stepMap] of Object.entries(mappings)) {
  // Convert gallery index numbers to actual paths
  const imageMap = {};
  for (const [stepIdx, galleryNum] of Object.entries(stepMap)) {
    imageMap[stepIdx] = `/images/recipes/${slug}/gallery-${galleryNum}.jpg`;
  }

  const result = update.run(JSON.stringify(imageMap), slug);
  if (result.changes > 0) {
    updated++;
    console.log(`  ${slug}: ${Object.keys(imageMap).length} inline images`);
  }
}

console.log(`\nUpdated ${updated} recipes with instruction-image mappings.`);
db.close();
