const fs = require("fs");
const path = require("path");

let content = fs.readFileSync(path.join(__dirname, "..", "prisma", "seed-db.cjs"), "utf8");

const imageMap = {
  "sourdough-bagel": "/images/recipes/sourdough-bagel.jpg",
  "sourdough-berry-galette": "/images/recipes/sourdough-berry-galette.jpg",
  "camellas-hot-harvest-ketchup": "/images/recipes/camellas-hot-harvest-ketchup.jpg",
  "sage-jalapeno-cheddar-sourdough-loaf": "/images/recipes/sage-jalapeno-cheddar-sourdough-loaf.jpg",
  "date-night-shrimp-cocktail": "/images/recipes/date-night-shrimp-cocktail.png",
  "sourdough-chocolate-chip-walnut-pancakes": "/images/recipes/sourdough-chocolate-chip-walnut-pancakes.jpg",
  "sourdough-cinnamon-raisin-bread": "/images/recipes/sourdough-cinnamon-raisin-bread.jpg",
  "shrimp-fried-rice": "/images/recipes/shrimp-fried-rice.jpg",
  "simple-sourdough-sandwich-loaf": "/images/recipes/simple-sourdough-sandwich-loaf.jpg",
  "simple-yellow-split-peas-dhal": "/images/recipes/simple-yellow-split-peas-dhal.jpg",
  "sourdough-cheddar-biscuits": "/images/recipes/sourdough-cheddar-biscuits.jpg",
  "olive-oil-dip-for-sourdough-bread": "/images/recipes/olive-oil-dip-for-sourdough-bread.jpg",
  "stewed-pumpkin-trinidad-style": "/images/recipes/stewed-pumpkin-trinidad-style.jpg",
  "sourdough-english-muffins": "/images/recipes/sourdough-english-muffins.jpg",
  "grilled-honey-cinnamon-apple-wedges": "/images/recipes/grilled-honey-cinnamon-apple-wedges.jpg",
  "grilled-honey-cinnamon-pineapple-spears": "/images/recipes/grilled-honey-cinnamon-pineapple-spears.jpg",
  "cast-iron-cornbread": "/images/recipes/cast-iron-cornbread.jpg",
  "sriracha-ketchup": "/images/recipes/sriracha-ketchup.jpg",
  "butter-fried-swai": "/images/recipes/butter-fried-swai.jpg",
  "jerk-shrimp": "/images/recipes/jerk-shrimp.jpg",
  "pineapple-mango-salsa": "/images/recipes/pineapple-mango-salsa.jpg",
  "belgian-waffles": "/images/recipes/belgian-waffles.jpg",
  "coconut-ice-cream": "/images/recipes/coconut-ice-cream.jpg",
  "easy-4-ingredient-no-knead-rolls": "/images/recipes/easy-4-ingredient-no-knead-rolls.jpg",
  "stewed-red-beans-trinidad-style": "/images/recipes/stewed-red-beans-trinidad-style.jpg",
  "sourdough-cranberry-orange-muffins": "/images/recipes/sourdough-cranberry-orange-muffins.jpg",
  "20-min-sourdough-pancakes": "/images/recipes/20-min-sourdough-pancakes.jpg",
  "smh-biscuits": "/images/recipes/smh-biscuits.png",
  "fragrant-lemon-herb-salmon": "/images/recipes/fragrant-lemon-herb-salmon.jpg",
  "crispy-air-fried-zucchini-fries": "/images/recipes/crispy-air-fried-zucchini-fries.jpg",
  "broiled-sweet-thai-chili-salmon-and-spinach": "/images/recipes/broiled-sweet-thai-chili-salmon-and-spinach.jpg",
  "crispy-chunky-granola": "/images/recipes/crispy-chunky-granola.jpg",
  "chicken-tinga": "/images/recipes/chicken-tinga.jpg",
  "the-legit-jamaican-coco-bread-recipe": "/images/recipes/the-legit-jamaican-coco-bread-recipe.jpg",
};

let count = 0;
for (const [slug, imgPath] of Object.entries(imageMap)) {
  const marker = `slug: "${slug}",`;
  const idx = content.indexOf(marker);
  if (idx === -1) continue;

  // Check if imageUrl already exists on the next line
  const after = content.substring(idx + marker.length, idx + marker.length + 80);
  if (after.includes("imageUrl:")) continue;

  // Insert imageUrl after the slug line
  const insertPoint = idx + marker.length;
  const newLine = `\n      imageUrl: "${imgPath}",`;
  content = content.substring(0, insertPoint) + newLine + content.substring(insertPoint);
  count++;
}

fs.writeFileSync(path.join(__dirname, "..", "prisma", "seed-db.cjs"), content);
console.log(`Added imageUrl to ${count} recipes`);
