const https = require("https");
const fs = require("fs");
const path = require("path");

const recipesDir = path.join(__dirname, "..", "public", "images", "recipes");

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) { resolve(true); return; }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        download(response.headers.location, dest).then(resolve);
        return;
      }
      if (response.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest); resolve(false); return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    }).on("error", () => {
      file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve(false);
    });
  });
}

// All gallery images (excluding cover images already downloaded, excluding 150x150 thumbnails)
const galleryImages = {
  // Batch 1
  "camellas-hot-harvest-ketchup": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Camellas-Hot-Harvest-Ketchup.jpg",
  ],
  "date-night-shrimp-cocktail": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Camellas-Pumpkin-Cocktail-Sauce.jpg",
  ],
  "sourdough-chocolate-chip-walnut-pancakes": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Chocolate-chip-Walnut-Pancakes.jpg",
  ],
  // Batch 2
  "shrimp-fried-rice": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Shrimp-Fried-Rice-Plated.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Pot-of-Shrimp-Fried-Rice.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Shrimp-Fried-Rice-Mound.jpg",
  ],
  "olive-oil-dip-for-sourdough-bread": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/08/Olive-Oil-Dip-for-Sourdough-Bread-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/08/Olive-Oil-Dip-for-Sourdough-Bread.jpg",
  ],
  "stewed-pumpkin-trinidad-style": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/07/Cut-Pumpkin.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/07/Pumpkin-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/07/Pumpkin-Side-Dish.jpg",
  ],
  "cast-iron-cornbread": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Greased-Cast-Iron.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Cornbread-Dry-Ingredients-Mixed.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Eggs.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Cornbread-Wet-Ingredients.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Combine-Wet-and-Dry-Ingredients-for-Cornbread.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Cornbread-Batter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Cornbread-Dry-Ingredients.jpg",
  ],
  // Batch 3
  "butter-fried-swai": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Butter-Fried-Swai-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Butter-Fried-Swai-Cover-Image.jpg",
  ],
  "pineapple-mango-salsa": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Pineapple-Mango-Salsa-1.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/06/Pineapple-Mango-Salsa-2.jpg",
  ],
  "easy-4-ingredient-no-knead-rolls": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Yeast-and-Flour.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Covered-Dough.jpg",
  ],
  "stewed-red-beans-trinidad-style": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Base-seasonings-for-beans.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Red-beans-in-a-pot.jpg",
  ],
};

async function main() {
  let ok = 0, fail = 0;
  for (const [slug, urls] of Object.entries(galleryImages)) {
    const slugDir = path.join(recipesDir, slug);
    fs.mkdirSync(slugDir, { recursive: true });
    console.log(`${slug}:`);
    for (let i = 0; i < urls.length; i++) {
      const ext = path.extname(new URL(urls[i]).pathname);
      const dest = path.join(slugDir, `gallery-${i + 1}${ext}`);
      const r = await download(urls[i], dest);
      if (r) { ok++; console.log(`  OK: gallery-${i + 1}${ext}`); }
      else { fail++; console.log(`  FAIL: ${urls[i]}`); }
    }
  }
  console.log(`\nDone! ${ok} downloaded, ${fail} failed`);
}

main().catch(console.error);
