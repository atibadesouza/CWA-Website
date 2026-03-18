const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const recipesDir = path.join(__dirname, "..", "public", "images", "recipes");

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) { resolve(true); return; }
    // Normalize URL to https://cookingwithatiba.com
    url = url.replace("http://Cookingwithatiba.com", "https://cookingwithatiba.com");
    url = url.replace("https://www.atibadesouza.com", "https://cookingwithatiba.com");
    url = url.replace("https://atibadesouza.com", "https://cookingwithatiba.com");

    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        download(response.headers.location, dest).then(resolve);
        return;
      }
      if (response.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest);
        console.log(`    FAIL (${response.statusCode}): ${url}`);
        resolve(false); return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    }).on("error", (e) => {
      file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.log(`    ERR: ${e.message}`);
      resolve(false);
    });
  });
}

// Complete gallery images from WP API - ALL recipes
// Normalized to cookingwithatiba.com domain
const allGallery = {
  "no-knead-pull-apart-yeast-dinner-rolls": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Yeast-and-Flour.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Covered-Dough.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/03/Webp.net-resizeimage-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Separated-Dough.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Shaped-Dough-Balls.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/03/Webp.net-resizeimage-1.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/03/Webp.net-resizeimage-3.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/03/Webp.net-resizeimage-5.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/03/Webp.net-resizeimage.jpg",
  ],
  "sourdough-bagel": [
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Dough-After-Proofing.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Dough-First-Cut.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Dough-rolled-into-a-log.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Dough-Cut-Log.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Dough-balls.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Shaped-Sourdough-Bagels.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Boiling-Sourdough-Bagels.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Egg-washed-Sourdough-Bagels.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-Ready-to-bake.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2021/01/Sourdough-Bagels-2.jpg",
  ],
  "sourdough-berry-galette": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Cut-butter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Butter-cut-into-the-flour-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Add-the-Sourdough-starter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Pre-shaped-galette-dough.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/shaped-galette-dough.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Wrapped-galette-dough-for-the-fridge.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/berries-and-more-berries-for-teh-galette.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Make-berry-filling.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Berry-filling.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/egg-wash.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Cut-galette-dough-into-4.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Flour-the-dough.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Berry-Gallete-cut-the-shape.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Galette-Egg-Wash.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/Fold-your-Galette.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/11/InShot_20201130_121644145.jpg",
  ],
  "authentic-trini-coconut-sweetbread": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Cracked-Coconut.jpg",
  ],
  "date-night-shrimp-cocktail": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Camellas-Pumpkin-Cocktail-Sauce.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Steamed-Shrimp-Seasoning.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Seasoned-Shrimp.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Shrimp-in-Steamer-basket.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Steamed-Shrimp.jpg",
  ],
  "sourdough-cinnamon-raisin-bread": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Dough-Ball-Pre-Kneeding-576x1024.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Raisin-Bread-Dough-Ball-Pre-Raisins.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Dough-Ball-After-Autolyse-and-Raisins-1024x576.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Raisin-Bread-Dough-With-Raisins.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Dough-Before-adding-Cinnamon-Sugar-1024x576.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Shaped-Loaves.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Rissen-Shaped-Loaves.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Raisin-Bread-Fresh-from-the-Oven.jpg",
  ],
  "coconut-ice-cream": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Cracked-Coconut.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Chopped-Coconut.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/How-to-Make-Coconut-Milk.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Squeezing-Coconut.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Coconut-Ice-Cream-Mix.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Ice-Cream-maker.jpg",
  ],
  "crispy-chunky-granola": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Granola-wet-ingredients.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Granola-Mix.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Granola-Ready-to-Bake.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Baked-Granola.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Chunky-granola.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Granola-in-a-bowl.jpg",
  ],
  "sourdough-cranberry-orange-muffins": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Streusel.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Grated-Orange.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Muffin-Mix-without-fruit.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Muffin-Mix-with-Fruit.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Sourdough-Cranberry-Orange-mini-muffins-ready-to-bake.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Sourdough-Cranberry-Orange-Muffin-1.jpg",
  ],
  // Stewed pumpkin already had 3 gallery, but API shows same ones
  // Cast iron cornbread already had 7 gallery (from page scrape), API shows 6 from content - we already have more
  // SMH biscuits already had 6 gallery - same as API
  // Fragrant lemon herb salmon already had 3 - same as API
  // Zucchini fries already had 5 - same as API
  // Thai chili salmon already had 3 - same as API
  // Coco bread already had 6 - same as API
  // Butter fried swai already had 2 - API shows 0 content images (had gallery thumbs)
  // Pineapple mango salsa already had 2
  // Stewed red beans already had 2
  // Easy 4 ingredient rolls already had 2
  // Olive oil dip already had 2
};

async function main() {
  let ok = 0, fail = 0;
  for (const [slug, urls] of Object.entries(allGallery)) {
    const slugDir = path.join(recipesDir, slug);
    fs.mkdirSync(slugDir, { recursive: true });

    // Check existing gallery files
    const existing = fs.readdirSync(slugDir).filter(f => f.startsWith("gallery-"));

    // Clear existing and re-download all (to ensure correct order)
    for (const f of existing) {
      fs.unlinkSync(path.join(slugDir, f));
    }

    console.log(`${slug}: (${urls.length} images)`);
    for (let i = 0; i < urls.length; i++) {
      const ext = path.extname(new URL(urls[i]).pathname) || ".jpg";
      const dest = path.join(slugDir, `gallery-${i + 1}${ext}`);
      const r = await download(urls[i], dest);
      if (r) { ok++; console.log(`  OK: gallery-${i + 1}${ext}`); }
      else { fail++; }
    }
  }
  console.log(`\nDone! ${ok} downloaded, ${fail} failed`);
}

main().catch(console.error);
