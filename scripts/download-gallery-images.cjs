const https = require("https");
const fs = require("fs");
const path = require("path");

const recipesDir = path.join(__dirname, "..", "public", "images", "recipes");
fs.mkdirSync(recipesDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) {
      resolve(true);
      return;
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(response.headers.location, dest).then(resolve);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        resolve(false);
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    }).on("error", () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

// Gallery images per recipe (slug -> array of external URLs)
// Exclude: featured/cover images (already downloaded), 150x150 thumbnails, logo, page-title
const galleryImages = {
  "smh-biscuits": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-Wet-Ingredients.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Grated-Frozen-Butter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-ingredients-premix.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-Mix-Stage-3.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-Trayed.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/SMH-Biscuits-Fresh-out-the-Oven-1.jpg",
  ],
  "fragrant-lemon-herb-salmon": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Lemon-Herb-Salmon-Dressed-2.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Lemon-Herb-salmon-ready-to-Bake.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Fragrant-Lemon-Herb-Salmon.jpg",
  ],
  "crispy-air-fried-zucchini-fries": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/cut-zuchinni.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/egg-wash.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/zuchinni-breading.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/breaded-zuchinni.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/zuchinni-air-fryer.jpg",
  ],
  "broiled-sweet-thai-chili-salmon-and-spinach": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Thai-Chili-Salmon-Spinach-bed.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/dressed-salmon-with-butter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/baked-thai-chili-salmon.jpg",
  ],
  "chicken-tinga": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Chicken-Tinga-Taco-Arial-Shot.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Holding-a-chicken-tinga-taco.jpg",
  ],
  "the-legit-jamaican-coco-bread-recipe": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Melted-butter.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Coco-bread-dough-ball.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/small-dough-balls.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Coco-bread-shaped-and-proofing.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Coco-bread-strayed.jpg",
    "https://cookingwithatiba.com/wp-content/uploads/2020/04/Coco-bread-baked-fresh-out-of-the-oven.jpg",
  ],
  "no-knead-pull-apart-yeast-dinner-rolls": [
    "https://cookingwithatiba.com/wp-content/uploads/2020/05/Yeast-and-Flour.jpg",
  ],
};

async function main() {
  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const [slug, urls] of Object.entries(galleryImages)) {
    const slugDir = path.join(recipesDir, slug);
    fs.mkdirSync(slugDir, { recursive: true });

    console.log(`\n${slug}:`);
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const ext = path.extname(new URL(url).pathname);
      const filename = `gallery-${i + 1}${ext}`;
      const dest = path.join(slugDir, filename);
      const ok = await download(url, dest);
      if (ok) {
        totalDownloaded++;
        console.log(`  OK: ${filename}`);
      } else {
        totalFailed++;
        console.log(`  FAIL: ${url}`);
      }
    }
  }

  console.log(`\nDone! Downloaded ${totalDownloaded}, failed ${totalFailed}`);
}

main().catch(console.error);
