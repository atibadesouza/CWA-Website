const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "prisma", "dev.db"));

const update = db.prepare(`
  UPDATE Recipe SET
    instructions = ?,
    gallery = ?
  WHERE slug = ?
`);

const recipes = [
  {
    slug: "20-min-sourdough-pancakes",
    gallery: [],
    instructions: [
      "In a large bowl, whisk together the flour, baking powder, soda, sugar and salt.",
      "Add sourdough starter, vanilla extract, butter, egg, milk, and whisk together until smooth",
      "Spray a pancake griddle or skillet with cooking spray or grease well with butter. Heat to approximately 325 degrees.",
      "Pour 1/4 cup pancake batter on the hot griddle. Cook until the pancake starts bubbling on top, then flip the pancake.",
      "Cook for an additional 1-2 minutes.",
      "Serve immediately with maple syrup or honey."
    ],
  },
  {
    slug: "smh-biscuits",
    gallery: [
      "/images/recipes/smh-biscuits/gallery-1.jpg",
      "/images/recipes/smh-biscuits/gallery-2.jpg",
      "/images/recipes/smh-biscuits/gallery-3.jpg",
      "/images/recipes/smh-biscuits/gallery-4.jpg",
      "/images/recipes/smh-biscuits/gallery-5.jpg",
      "/images/recipes/smh-biscuits/gallery-6.jpg",
    ],
    instructions: [
      "Preheat oven to 450 Degrees",
      "Foil line and greese a cookie sheet",
      "In a large bowl whisk together all Dry Ingredients (flour, baking powder, sugar and salt)",
      "Measure out milk and crack the egg and set aside",
      "Grate the butter with a cheese grater.",
      "Combine dry ingredients, milk, butter, and egg and mix with a wooden spoon to combine all the flour.",
      "Mix until a solid dough ball is formed. Typically takes 3-4 minutes of mixing",
      "Dump dough ball onto a floured surface ad roll out to 1/2 inch thick with a rolling pin",
      "Cut out biscuit shapes using a cookie cutter or small glass",
      "Place biscuits 1 inch apart on foil-lined ad greased cookie sheet",
      "Bake 10 min or until tops of biscuits are golden brown"
    ],
  },
  {
    slug: "fragrant-lemon-herb-salmon",
    gallery: [
      "/images/recipes/fragrant-lemon-herb-salmon/gallery-1.jpg",
      "/images/recipes/fragrant-lemon-herb-salmon/gallery-2.jpg",
      "/images/recipes/fragrant-lemon-herb-salmon/gallery-3.jpg",
    ],
    instructions: [
      "Preheat oven to 450 degrees",
      "Wash salmon in lemon juice and place on a greased foil-lined tray",
      "Sprinkle seasoning on top of the fish in this order: 1. Salt 2. Black pepper 2. Onion Powder 4. Garlic Powder 5. Italian 6. Parsley 7. Oregano 8. Thyme 9. Rosemary",
      "Place at least 1 slice of lemon on each filet.",
      "Slice the butter thinly and arrange on the fish. There is not much science on how to do this.",
      "Thin Fillet (under 1 inch0 - Bake 9 min at 450 degrees and then an additional 3 minutes on Broil Thick Fillet - Bake 12 min at 450 degrees and then an additional 4 minutes on Broil 1 inch thick steaks - Bake 12 min at 450 degrees and then an additional 4 minutes on Broil"
    ],
  },
  {
    slug: "crispy-air-fried-zucchini-fries",
    gallery: [
      "/images/recipes/crispy-air-fried-zucchini-fries/gallery-1.jpg",
      "/images/recipes/crispy-air-fried-zucchini-fries/gallery-2.jpg",
      "/images/recipes/crispy-air-fried-zucchini-fries/gallery-3.jpg",
      "/images/recipes/crispy-air-fried-zucchini-fries/gallery-4.jpg",
      "/images/recipes/crispy-air-fried-zucchini-fries/gallery-5.jpg",
    ],
    instructions: [
      "Cut zucchini to the desired size. I typically cut my zucchini into 16 pieces.",
      "In a flat container wide enough to hold at least 1 zucchini fry beat the 3 eggs to make an egg wash.",
      "Add all other ingredients together to make the breading for your fries.",
      "Dip each fry into the egg wash and then into breading coating all sides of the fry. Then remove from breading and place on air fryer tray. Spray with olive oil before frying.",
      "Air Fry at 400 degrees for 15 minutes."
    ],
  },
  {
    slug: "broiled-sweet-thai-chili-salmon-and-spinach",
    gallery: [
      "/images/recipes/broiled-sweet-thai-chili-salmon-and-spinach/gallery-1.jpg",
      "/images/recipes/broiled-sweet-thai-chili-salmon-and-spinach/gallery-2.jpg",
      "/images/recipes/broiled-sweet-thai-chili-salmon-and-spinach/gallery-3.jpg",
    ],
    instructions: [
      "Before you season the Salmon Bring 3 quarts of water to a boil Add Vermicelli and pinch of salt Boil for 9 minutes Drain Vermicelli",
      "Foil line a baking sheet and spray with Olive oil or another cooking spray Place fresh spinach onto the foil no more than 1 inch thick. season with all dry ingredients Drizzle olive oil over the spinach",
      "Place salmon on top of the spinach Season with all the Dry ingredients Place pats of butter on each piece of fish about 2 inches apart Broil side down in pan first for 30 seconds flip and cook for 1 min",
      "Bake for 9 minutes at 450 degrees Broil for 3 minutes",
      "As you turn the oven to broil Heat a pan large enough for at least 1 piece of salmon over medium heat Add butter, cooking wine (sherry), and mirin and stir to mix As the mixture starts to bubble add sweet chili and stir constantly until the fish is added",
      "Remove fish from the oven and place in the pan with the Thai chili glaze seasoned side down first. Turn the temperature on the pan to low and allow fish to sit in the glaze for 30 seconds Turn the fish over and allow it to sit in the glaze for 1 minute",
      "Put vermicelli in the middle of a large plate Remove a portion of spinach from baking sheet and place on top of the vermicelli Place a piece of salmon seasoned side up on the spinach (add additional glaze as desired)"
    ],
  },
  {
    slug: "crispy-chunky-granola",
    gallery: [],
    instructions: [
      "Preheat Oven to 325",
      "Add all Wet ingredients and all Spice ingredients to a small saucepan and heat over low heat. This usually takes me about 3-5 minutes. The mixture should warm-up and not become very hot.",
      "Add Oats to a Large bowl",
      "Add the flour on top of the oats and mix well to coat the oats with flour",
      "Add dried fruit and nuts mix to the bowl.",
      "Pour liquid ingredients on top of the dry ingredients and mix together thoroughly.",
      "Parchment line 2 baking sheets. Put half of the granola mixture on each sheet. The goal is to have the granola packed in tightly AND not taller than 1/2 an inch.",
      "Bake for 25 min at 325 Degrees or until the top of your granola is golden or the raisins (if you used them) get plump. If you need to add more time to your baking check the granola every 5 minutes.",
      "Remove parchment from the baking sheet and place it on a cooling rack and allow it to cool for 15-20 min. Then break granola into large chunks.",
      "Return the cooled granola to a foil-lined greased baking sheet. Drizzle the granola with 1/2 cup of honey and bake for 10 minutes at 325 degrees. It's important to note that the granola will be soft after baking until its completely cooled. Resist the desire to bake it until its crispy."
    ],
  },
  {
    slug: "chicken-tinga",
    gallery: [
      "/images/recipes/chicken-tinga/gallery-1.jpg",
      "/images/recipes/chicken-tinga/gallery-2.jpg",
    ],
    instructions: [
      "Add All ingredients to a large stockpot over medium-high heat. Once the liquid starts to bubble turn the temperature down to a medium-low and allow the pot to simmer. Simmer for 1 hour or until chicken is tender and breaks apart easily.",
      "After an hour of simmering on medium-low heat, Remove the Chipotle pepper.",
      "Remove all chicken from the pot and place in a large bowl, for me, I never get every piece of chicken out because some break apart and that's ok. With 2 forks gently pull apart and shed all the chicken.",
      "Using a blender, pulse blend approximately 60-70 percent of the liquid in your pan.",
      "Add the chicken and blended liquid back to your pan and mix all of it together and simmer on low for 10-15 min."
    ],
  },
  {
    slug: "the-legit-jamaican-coco-bread-recipe",
    gallery: [
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-1.jpg",
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-2.jpg",
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-3.jpg",
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-4.jpg",
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-5.jpg",
      "/images/recipes/the-legit-jamaican-coco-bread-recipe/gallery-6.jpg",
    ],
    instructions: [
      "Melt and cool 4 tablespoons of butter",
      "In a large bowl combine egg, coconut milk, yeast, salt, sugar and 4 tablespoons of butter",
      "Add 4 cups of flour to wet ingredients 1 cup at a time. Mix to combine and incorporate all the flour. The mixture should start to become solid but still very moist and sticky.",
      "Turn the dough out on a floured surface and gently kneed for 3-4 minutes. The dough ball will still be very soft but not sticky to the touch.",
      "Place dough in a lightly greased bowl and cover with a kitchen towel or moist paper towels for 90 minutes.",
      "Return the dough to a floured surface and divide it into 12 pieces. CWA Note: 12 pieces is ideal. I rarely get 12. sometimes 10 sometimes 13. The biggest point is don't stress it.",
      "Roll each dough ball out to approximately 1/8 inch thick. Brush the dough with butter then fold the dough circle in half. Then brush top with butter. Place coco bread on a lined or greased tray.",
      "Allow coco bread to rest for 25 minutes",
      "Pre-heat oven to 375 degrees",
      "bake for 20 minutes"
    ],
  },
  {
    slug: "no-knead-pull-apart-yeast-dinner-rolls",
    gallery: [
      "/images/recipes/no-knead-pull-apart-yeast-dinner-rolls/gallery-1.jpg",
    ],
    instructions: [
      "Add warm water, salt and yeast to a large bowl",
      "Add all 1 1/2 cups of flour to the bowl and mix it into a pancake batter consistency",
      "Add the remaining flour",
      "Mix with a wooden spoon until there are no patches or pockets of dry flour. It may take 3-5 minutes to mix in all the flour. You may be tempted to add more water, DO NOT, just keep mixing until all the flour is absorbed",
      "Cover the dough with damp paper towels or kitchen towel and allow the dough to rise for 2-3 hours.",
      "Parchment line two 9 inch cake pans",
      "Turn the dough out on a floured surface. The dough will be sticky",
      "Divide the dough until you have 12 roughly equal-sized pieces",
      "Generously flour each of your hands",
      "Pick up one of the 12 portions of dough",
      "Stretch the edges of the dough around to the bottom and middle of the dough ball on all sides, rotating the dough in your hands as you do so. (The bottom of the ball will look like a bunch of bunched ends.) Do this until the top of the dough ball is smooth.",
      "Place dough ball in the center of the cake pan",
      "Repeat this process with all the dough balls placing the 1 inch apart in the cake pan. You may end with 1 pan having 7 and the other having 5",
      "Cover with damp paper towels and allow them to rest for 40-45 minutes.",
      "Place a roasting pan (or any metal pan) on the bottom rack of your oven.",
      "Preheat oven to 450 degrees for 30 min",
      "Boil 2 cups of water",
      "After the 30min oven pre-heat, place both cake pans into the oven",
      "Pour 2 cups of water into the roasting pan on the bottom self of your oven and close the oven door quickly. Pouring water into the scorching hot pan will produce an instant seam which we want to capture in the oven.",
      "Bake for 14 minutes",
      "Reduce temperature to 375 degrees F and remove the pan with the water",
      "Bake an additional 10-13 minutes or until golden brown."
    ],
  },
];

let updated = 0;
for (const recipe of recipes) {
  const galleryJson = recipe.gallery.length > 0 ? JSON.stringify(recipe.gallery) : null;
  const result = update.run(
    JSON.stringify(recipe.instructions),
    galleryJson,
    recipe.slug
  );
  if (result.changes > 0) {
    updated++;
    console.log(`  Updated: ${recipe.slug} (${recipe.gallery.length} gallery images)`);
  }
}

console.log(`\nUpdated ${updated} recipes with exact instructions and gallery.`);
db.close();
