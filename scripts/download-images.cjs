const https = require("https");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public", "images");
const recipesDir = path.join(publicDir, "recipes");

// Ensure directories exist
fs.mkdirSync(recipesDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  SKIP (exists): ${path.basename(dest)}`);
      resolve(true);
      return;
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        console.log(`  FAIL (${response.statusCode}): ${url}`);
        resolve(false);
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`  OK: ${path.basename(dest)}`);
        resolve(true);
      });
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.log(`  ERR: ${url} - ${err.message}`);
      resolve(false);
    });
  });
}

// Logo and branding
const brandImages = {
  "logo.jpg": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Cooking-with-atiba-logo-header.jpg",
  "page-title-bg.jpg": "https://cookingwithatiba.com/wp-content/uploads/2020/04/page-title.jpg",
};

// Recipe images - slug -> URL
const recipeImages = {
  "no-knead-pull-apart-yeast-dinner-rolls": "https://cookingwithatiba.com/wp-content/uploads/2021/03/No-Knead-Pull-Apart-Yeast-Dinner-Rolls-Cover.jpg",
  "sourdough-bagel": "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Cover-Image.jpg",
  "sourdough-berry-galette": "https://cookingwithatiba.com/wp-content/uploads/2020/11/Sourdough-Berry-Galette-Cover-Image.jpg",
  "camellas-hot-harvest-ketchup": "https://cookingwithatiba.com/wp-content/uploads/2020/11/Camellas-Hot-Harvest-Ketchup-Cover-Image.jpg",
  "sage-jalapeno-cheddar-sourdough-loaf": "https://cookingwithatiba.com/wp-content/uploads/2020/11/Sage-Jalapenos-Cheddar-Sourdough-Loaf-Cover-Image.jpg",
  "authentic-trini-coconut-sweetbread": "https://cookingwithatiba.com/wp-content/uploads/2020/11/Coconut-Sweetbread-Cover-Image.jpg",
  "date-night-shrimp-cocktail": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Date-Night-Pumpkin-Shrimp-Cocktail-Cover.png",
  "sourdough-chocolate-chip-walnut-pancakes": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Chocolate-chip-Walnut-Pancakes-Cover-Image.jpg",
  "sourdough-cinnamon-raisin-bread": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Raisin-Bread-Cover-Image.jpg",
  "shrimp-fried-rice": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Shrimp-Fried-Rice-Cover-Image.jpg",
  "simple-sourdough-sandwich-loaf": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Sandwich-Loaf-Cover.jpg",
  "simple-yellow-split-peas-dhal": "https://cookingwithatiba.com/wp-content/uploads/2020/08/Dhal-Cover-Image.jpg",
  "sourdough-cheddar-biscuits": "https://cookingwithatiba.com/wp-content/uploads/2020/08/Sourdough-Cheddar-Biscuits-Cover-Image.jpg",
  "olive-oil-dip-for-sourdough-bread": "https://cookingwithatiba.com/wp-content/uploads/2020/08/Olive-Oil-Dip-for-Sourdough-Bread-Cover-Image.jpg",
  "stewed-pumpkin-trinidad-style": "https://cookingwithatiba.com/wp-content/uploads/2020/07/Stewed-Pumpkin-Cover-Image.jpg",
  "sourdough-english-muffins": "https://cookingwithatiba.com/wp-content/uploads/2020/07/Sourdough-English-muffins-Cover.jpg",
  "grilled-honey-cinnamon-apple-wedges": "https://cookingwithatiba.com/wp-content/uploads/2020/07/Grilled-Honey-Cinnamon-Apple.jpg",
  "grilled-honey-cinnamon-pineapple-spears": "https://cookingwithatiba.com/wp-content/uploads/2020/07/Grilled-Honey-Cinnamon-Pineapple.jpg",
  "cast-iron-cornbread": "https://cookingwithatiba.com/wp-content/uploads/2020/06/Cast-Iron-Cornbread-with-Real-Corn.jpg",
  "sriracha-ketchup": "https://cookingwithatiba.com/wp-content/uploads/2020/06/Sriracha-Kechup.jpg",
  "butter-fried-swai": "https://cookingwithatiba.com/wp-content/uploads/2020/06/Butter-Fried-Swai.jpg",
  "jerk-shrimp": "https://cookingwithatiba.com/wp-content/uploads/2020/06/Jerk-Shrimp-Cover-Image.jpg",
  "pineapple-mango-salsa": "https://cookingwithatiba.com/wp-content/uploads/2020/06/Pineapple-Mango-Salsa-Cover-Image.jpg",
  "belgian-waffles": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Waffle-Cover-Image.jpg",
  "coconut-ice-cream": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Coconut-Ice-Cream-Cover-image.jpg",
  "easy-4-ingredient-no-knead-rolls": "https://cookingwithatiba.com/wp-content/uploads/2020/05/4-Ingredient-Rolls-Cover-Image.jpg",
  "stewed-red-beans-trinidad-style": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Red-beans-cover-image.jpg",
  "sourdough-cranberry-orange-muffins": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Sourdough-Cranberry-Orange-Muffin-4.jpg",
  "20-min-sourdough-pancakes": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Sourdough-Discard-Pancakes.jpg",
  "smh-biscuits": "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-Featured-Image.png",
  "fragrant-lemon-herb-salmon": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Fragrant-Lemon-Herb-Salmon-Featured-Image.jpg",
  "crispy-air-fried-zucchini-fries": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Air-Fried-Zuchinni-With-Oil-Spray-1.jpg",
  "broiled-sweet-thai-chili-salmon-and-spinach": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Sweet-Thai-Chilli-Salmon-and-Spinach.jpg",
  "crispy-chunky-granola": "https://cookingwithatiba.com/wp-content/uploads/2020/04/granola-in-a-bowl-2.jpg",
  "chicken-tinga": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Chicken-Tinga-taco.jpg",
  "the-legit-jamaican-coco-bread-recipe": "https://cookingwithatiba.com/wp-content/uploads/2020/04/Coco-bread-featured-image.jpg",
  "sourdough-baguettes": "https://cookingwithatiba.com/wp-content/uploads/2021/03/Sourdough-Baguettes-Cover-Image.jpg",
  "sourdough-ciabatta": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Ciabatta-Cover-Image.jpg",
  "italian-herb-sourdough-discard-crackers": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Italian-Herb-Sourdough-Discard-Crackers.jpg",
};

async function main() {
  console.log("=== Downloading brand images ===");
  for (const [filename, url] of Object.entries(brandImages)) {
    await download(url, path.join(publicDir, filename));
  }

  console.log("\n=== Downloading recipe images ===");
  for (const [slug, url] of Object.entries(recipeImages)) {
    const ext = path.extname(new URL(url).pathname);
    const filename = slug + ext;
    await download(url, path.join(recipesDir, filename));
  }

  console.log("\nDone! Downloaded images to public/images/");
}

main().catch(console.error);
