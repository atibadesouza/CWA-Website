const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "prisma", "dev.db"));

// Slug mapping: our slug -> image URL
// WordPress slugs have "-recipe" suffix in some cases, our slugs don't
const images = {
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
  // Sourdough baguettes and ciabatta - try common patterns
  "sourdough-baguettes": "https://cookingwithatiba.com/wp-content/uploads/2021/03/Sourdough-Baguettes-Cover-Image.jpg",
  "sourdough-ciabatta": "https://cookingwithatiba.com/wp-content/uploads/2020/09/Sourdough-Ciabatta-Cover-Image.jpg",
  "italian-herb-sourdough-discard-crackers": "https://cookingwithatiba.com/wp-content/uploads/2020/05/Italian-Herb-Sourdough-Discard-Crackers.jpg",
};

const update = db.prepare("UPDATE Recipe SET imageUrl = ? WHERE slug = ?");

let updated = 0;
for (const [slug, url] of Object.entries(images)) {
  const result = update.run(url, slug);
  if (result.changes > 0) {
    updated++;
    console.log(`  Updated: ${slug}`);
  }
}

console.log(`\nUpdated ${updated} recipes with images.`);
console.log(`Total recipes: ${db.prepare("SELECT COUNT(*) as c FROM Recipe").get().c}`);
console.log(`With images: ${db.prepare("SELECT COUNT(*) as c FROM Recipe WHERE imageUrl IS NOT NULL").get().c}`);

db.close();
