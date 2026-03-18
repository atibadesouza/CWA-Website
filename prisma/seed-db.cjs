const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

const db = new Database(path.join(__dirname, "..", "dev.db"));

function cuid() {
  return crypto.randomBytes(12).toString("hex");
}

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("MilagrosAtibaDestiny3", 12);
  const userId = cuid();

  const existingUser = db.prepare("SELECT id FROM User WHERE username = ?").get("atibadesouza");
  if (!existingUser) {
    db.prepare(
      "INSERT INTO User (id, username, email, hashedPassword, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).run(userId, "atibadesouza", "cooking@atibadesouza.com", hashedPassword, "Atiba de Souza", "admin");
    console.log("Created admin user: atibadesouza");
  } else {
    console.log("Admin user already exists");
  }

  // Create categories
  const categoryData = [
    { name: "Appetizers", slug: "appetizers" },
    { name: "Bread", slug: "bread" },
    { name: "Breakfast", slug: "breakfast" },
    { name: "Desserts", slug: "desserts" },
    { name: "Entrees", slug: "entrees" },
    { name: "Sauces", slug: "sauces" },
    { name: "Sides", slug: "sides" },
    { name: "Snacks", slug: "snacks" },
    { name: "Vegetarian", slug: "vegetarian" },
    { name: "Mexican", slug: "mexican" },
  ];

  const childCategories = [
    { name: "Biscuits", slug: "biscuits", parentSlug: "bread" },
    { name: "Sourdough", slug: "sourdough", parentSlug: "bread" },
    { name: "Chicken", slug: "chicken", parentSlug: "entrees" },
    { name: "Seafood", slug: "seafood", parentSlug: "entrees" },
    { name: "Rice", slug: "rice", parentSlug: "sides" },
  ];

  const grandchildCategories = [
    { name: "Salmon", slug: "salmon", parentSlug: "seafood" },
    { name: "Shrimp", slug: "shrimp", parentSlug: "seafood" },
  ];

  const catMap = {};

  const insertCat = db.prepare(
    "INSERT OR IGNORE INTO Category (id, name, slug, parentId) VALUES (?, ?, ?, ?)"
  );
  const getCat = db.prepare("SELECT id FROM Category WHERE slug = ?");

  for (const cat of categoryData) {
    const existing = getCat.get(cat.slug);
    if (existing) {
      catMap[cat.slug] = existing.id;
    } else {
      const id = cuid();
      insertCat.run(id, cat.name, cat.slug, null);
      catMap[cat.slug] = id;
    }
  }

  for (const cat of childCategories) {
    const existing = getCat.get(cat.slug);
    if (existing) {
      catMap[cat.slug] = existing.id;
    } else {
      const id = cuid();
      insertCat.run(id, cat.name, cat.slug, catMap[cat.parentSlug]);
      catMap[cat.slug] = id;
    }
  }

  for (const cat of grandchildCategories) {
    const existing = getCat.get(cat.slug);
    if (existing) {
      catMap[cat.slug] = existing.id;
    } else {
      const id = cuid();
      insertCat.run(id, cat.name, cat.slug, catMap[cat.parentSlug]);
      catMap[cat.slug] = id;
    }
  }

  console.log("Created categories:", Object.keys(catMap).length);

  // Recipes
  const recipes = [
    {
      title: "No Knead Pull Apart Yeast Dinner Rolls",
      slug: "no-knead-pull-apart-yeast-dinner-rolls",
      description: "Soft, fluffy pull-apart dinner rolls that require no kneading. Perfect for holidays and family dinners.",
      prepTime: "4 hours", cookTime: "15 minutes", totalTime: "4 hours 15 minutes",
      servings: "12", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1.50 cups warm water", "2¼ tsp yeast", "2 tsp coarse salt", "3¼ cups all-purpose flour"],
      instructions: ["Combine water, salt, yeast in a large bowl.", "Add flour gradually to achieve pancake batter consistency.", "Add remaining flour and mix until no dry patches appear.", "Cover and let rise for 2 hours at room temperature.", "Punch down dough and shape into rolls.", "Let rise for another 1.5-2 hours until doubled.", "Bake at 375°F for 15 minutes until golden brown."],
      categories: ["bread"],
    },
    {
      title: "Authentic Trini Coconut Sweetbread",
      slug: "authentic-trini-coconut-sweetbread",
      description: "A traditional Trinidad Christmas bread that has become an everyday treat.",
      prepTime: "45 minutes", cookTime: "60 minutes", totalTime: "1 hour 45 minutes",
      servings: "16", difficulty: "Intermediate", cuisine: "Caribbean", cookingMethod: "Baking",
      ingredients: ["3 cups all-purpose flour", "1 tablespoon baking powder", "½ cup butter, softened", "1 cup sugar", "2½ cups grated fresh coconut", "1 cup raisins", "½ cup Paradise cherries, halved", "½ cup Paradise mixed peel", "1 teaspoon allspice", "1 teaspoon nutmeg", "2 teaspoons cinnamon", "¾ cup whole milk", "2 teaspoons vanilla extract", "1 egg, beaten", "3 tablespoons sugar (for glaze)", "1½ tablespoons water (for glaze)"],
      instructions: ["Grate fresh coconut; use white, firm flesh.", "Sift flour and baking powder.", "Cream softened butter and sugar.", "Add coconut, raisins, cherries, mixed peel, allspice, cinnamon, nutmeg.", "Combine egg, milk, vanilla.", "Mix wet into fruit mixture.", "Add flour gradually (¼ cup at a time).", "Grease two 9x5-inch pans.", "Divide dough between pans.", "Press to even thickness.", "Bake at 325°F for 60 minutes.", "Make sugar-water glaze, baste bread, return to off oven 5 min."],
      nutrition: JSON.stringify({ Calories: "361", Carbohydrates: "64g", Protein: "4g", Fat: "11g", Fiber: "4.4g", Sodium: "70mg", Cholesterol: "27mg" }),
      categories: ["bread"],
    },
    {
      title: "Sourdough Baguettes", slug: "sourdough-baguettes",
      description: "Crusty, artisan-style sourdough baguettes with a chewy interior.",
      prepTime: "30 minutes", cookTime: "25 minutes", totalTime: "12 hours",
      servings: "3 baguettes", difficulty: "Advanced", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["200g active sourdough starter", "500g bread flour", "325g water", "10g salt"],
      instructions: ["Mix starter, flour, and water. Autolyse 30 min.", "Add salt and mix.", "Stretch and fold every 30 min for 2 hours.", "Bulk ferment 4-6 hours.", "Divide into 3 pieces, pre-shape.", "Final shape into baguettes.", "Cold proof overnight.", "Score and bake at 475°F with steam for 25 min."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Bagel", slug: "sourdough-bagel",
      description: "Chewy, dense sourdough bagels with New York-style crust.",
      prepTime: "30 minutes", cookTime: "25 minutes", totalTime: "14 hours",
      servings: "8", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g sourdough starter", "300g bread flour", "150g water", "30g honey", "8g salt", "1 tbsp barley malt syrup"],
      instructions: ["Mix into stiff dough.", "Knead 10 min.", "Bulk ferment 4-5 hours.", "Shape into bagels.", "Cold proof overnight.", "Boil with malt syrup 1 min each side.", "Bake at 425°F for 20-25 min."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Berry Galette", slug: "sourdough-berry-galette",
      description: "A rustic, free-form sourdough pastry filled with mixed berries.",
      prepTime: "30 minutes", cookTime: "35 minutes", totalTime: "2 hours",
      servings: "8", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["100g sourdough discard", "200g flour", "100g cold butter", "50g sugar", "Salt", "Ice water", "3 cups mixed berries", "½ cup sugar", "2 tbsp cornstarch", "1 tbsp lemon juice", "1 egg", "Coarse sugar"],
      instructions: ["Make dough with flour, butter, discard. Chill 1 hour.", "Mix berries with sugar, cornstarch, lemon juice.", "Roll dough into 12-inch circle.", "Add filling, fold edges.", "Egg wash and sugar.", "Bake at 400°F for 35 min."],
      categories: ["desserts", "sourdough"],
    },
    {
      title: "Camella's Hot Harvest Ketchup", slug: "camellas-hot-harvest-ketchup",
      description: "Homemade ketchup with a spicy kick.",
      prepTime: "15 minutes", cookTime: "45 minutes", totalTime: "1 hour",
      servings: "2 cups", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["2 lbs tomatoes", "1 onion", "2 cloves garlic", "½ cup apple cider vinegar", "¼ cup brown sugar", "1 tsp smoked paprika", "½ tsp cayenne", "1 tsp mustard powder", "Salt and pepper"],
      instructions: ["Sauté onion and garlic.", "Add tomatoes, cook 15 min.", "Add vinegar, sugar, spices.", "Simmer 30 min.", "Blend smooth.", "Cool and store."],
      categories: ["sauces"],
    },
    {
      title: "Sage Jalapeno Cheddar Sourdough Loaf", slug: "sage-jalapeno-cheddar-sourdough-loaf",
      description: "Savory sourdough loaded with cheddar, sage, and jalapenos.",
      prepTime: "30 minutes", cookTime: "45 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Advanced", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["200g starter", "400g bread flour", "100g whole wheat flour", "350g water", "10g salt", "1 cup cheddar", "2 jalapenos", "2 tbsp fresh sage"],
      instructions: ["Mix, autolyse 30 min.", "Add salt.", "Incorporate cheese, jalapenos, sage during folds.", "Bulk ferment 4-6 hours.", "Shape, cold proof overnight.", "Bake in Dutch oven at 500°F/450°F."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Date Night Shrimp Cocktail", slug: "date-night-shrimp-cocktail",
      description: "Elegant shrimp cocktail perfect for date night.",
      prepTime: "15 minutes", cookTime: "5 minutes", totalTime: "20 minutes",
      servings: "2", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["1 lb jumbo shrimp", "1 lemon", "Old Bay", "½ cup ketchup", "2 tbsp horseradish", "1 tbsp lemon juice", "½ tsp Worcestershire", "Hot sauce"],
      instructions: ["Boil shrimp in seasoned water 2-3 min.", "Ice bath.", "Mix cocktail sauce.", "Serve chilled."],
      categories: ["appetizers", "seafood", "shrimp"],
    },
    {
      title: "Sourdough Ciabatta", slug: "sourdough-ciabatta",
      description: "Light, airy ciabatta with large holes and crispy crust.",
      prepTime: "20 minutes", cookTime: "25 minutes", totalTime: "12 hours",
      servings: "2 loaves", difficulty: "Advanced", cuisine: "Italian", cookingMethod: "Baking",
      ingredients: ["200g starter", "500g bread flour", "400g water", "10g salt", "2 tbsp olive oil"],
      instructions: ["Mix very wet dough.", "Add salt and olive oil after 30 min.", "6 sets of stretch and folds over 3 hours.", "Bulk ferment until tripled.", "Divide, stretch into rectangles.", "Proof 45 min.", "Bake at 475°F with steam."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Chocolate Chip Walnut Pancakes", slug: "sourdough-chocolate-chip-walnut-pancakes",
      description: "Fluffy sourdough pancakes with chocolate chips and walnuts.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "8 pancakes", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 cup sourdough discard", "1 cup flour", "1 cup milk", "1 egg", "2 tbsp butter", "2 tbsp sugar", "1 tsp baking powder", "½ tsp baking soda", "½ cup chocolate chips", "¼ cup walnuts"],
      instructions: ["Whisk wet ingredients.", "Combine dry separately.", "Fold together.", "Add chips and walnuts.", "Cook on greased griddle.", "Serve with maple syrup."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "Sourdough Cinnamon Raisin Bread", slug: "sourdough-cinnamon-raisin-bread",
      description: "Soft sourdough bread swirled with cinnamon sugar and raisins.",
      prepTime: "30 minutes", cookTime: "40 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g starter", "400g bread flour", "200g milk", "50g butter", "60g sugar", "8g salt", "1 cup raisins", "3 tbsp cinnamon sugar", "2 tbsp melted butter"],
      instructions: ["Mix and knead 8-10 min.", "Fold in raisins.", "Bulk ferment 4-6 hours.", "Roll, fill with cinnamon sugar.", "Roll into log, proof 2-3 hours.", "Bake at 350°F for 35-40 min."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Shrimp Fried Rice", slug: "shrimp-fried-rice",
      description: "Quick and flavorful shrimp fried rice with vegetables.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 lb shrimp", "4 cups cooked rice", "3 eggs", "1 cup mixed vegetables", "3 green onions", "3 cloves garlic", "3 tbsp soy sauce", "1 tbsp sesame oil", "2 tbsp vegetable oil"],
      instructions: ["Cook shrimp, set aside.", "Scramble eggs, set aside.", "Stir-fry vegetables.", "Add rice, soy sauce, sesame oil.", "Return shrimp and eggs.", "Garnish with green onions."],
      categories: ["seafood", "shrimp", "rice"],
    },
    {
      title: "Simple Sourdough Sandwich Loaf", slug: "simple-sourdough-sandwich-loaf",
      description: "Soft, pillowy sourdough bread for everyday sandwiches.",
      prepTime: "20 minutes", cookTime: "35 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g starter", "450g bread flour", "240g milk", "30g butter", "30g honey", "9g salt"],
      instructions: ["Mix and autolyse 30 min.", "Knead until smooth.", "Bulk ferment 4-6 hours.", "Shape and place in loaf pan.", "Proof 3-4 hours.", "Bake at 375°F for 30-35 min."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Simple Yellow Split Peas Dhal", slug: "simple-yellow-split-peas-dhal",
      description: "Comforting Trinidad-style dhal with yellow split peas.",
      prepTime: "10 minutes", cookTime: "40 minutes", totalTime: "50 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["1 cup yellow split peas", "4 cups water", "1 tbsp oil", "4 cloves garlic", "1 onion", "2 tsp cumin", "1 tsp turmeric", "1 Scotch bonnet", "Salt", "Cilantro"],
      instructions: ["Boil peas until soft.", "Sauté garlic and onion.", "Add cumin, turmeric.", "Combine with peas.", "Simmer with Scotch bonnet.", "Season and serve with rice."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Sourdough Cheddar Biscuits", slug: "sourdough-cheddar-biscuits",
      description: "Flaky, buttery sourdough biscuits with sharp cheddar.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "2 cups flour", "1 tbsp baking powder", "½ tsp baking soda", "½ cup cold butter", "1 cup cheddar", "¾ cup buttermilk", "1 tsp garlic powder"],
      instructions: ["Combine dry ingredients.", "Cut in butter.", "Add discard, cheddar, buttermilk.", "Drop on baking sheet.", "Bake at 425°F for 12-15 min.", "Brush with butter."],
      categories: ["bread", "sourdough", "biscuits"],
    },
    {
      title: "Olive Oil Dip For Sourdough Bread", slug: "olive-oil-dip-for-sourdough-bread",
      description: "Simple olive oil dip with herbs and Parmesan.",
      prepTime: "5 minutes", cookTime: "0 minutes", totalTime: "5 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Italian", cookingMethod: "Sautee",
      ingredients: ["½ cup olive oil", "2 tbsp balsamic vinegar", "3 cloves garlic", "1 tsp oregano", "1 tsp basil", "½ tsp red pepper flakes", "2 tbsp Parmesan"],
      instructions: ["Pour oil into shallow bowl.", "Add vinegar, garlic, herbs.", "Add Parmesan.", "Serve with sourdough."],
      categories: ["appetizers", "sauces"],
    },
    {
      title: "Stewed Pumpkin (Trinidad Style)", slug: "stewed-pumpkin-trinidad-style",
      description: "Simple, savory Caribbean-style stewed pumpkin.",
      prepTime: "10 minutes", cookTime: "25 minutes", totalTime: "35 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 lbs Caribbean pumpkin", "2 tbsp oil", "1 onion", "3 cloves garlic", "1 tbsp brown sugar", "½ cup coconut milk", "Fresh thyme", "Salt and pepper"],
      instructions: ["Sauté onion and garlic.", "Add brown sugar.", "Add pumpkin.", "Add coconut milk and thyme.", "Simmer 20-25 min.", "Season and serve."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Sourdough English Muffins", slug: "sourdough-english-muffins",
      description: "Classic English muffins with sourdough. Full of nooks and crannies.",
      prepTime: "20 minutes", cookTime: "20 minutes", totalTime: "8 hours",
      servings: "10", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["150g starter", "300g flour", "150g milk", "30g butter", "20g sugar", "5g salt", "Cornmeal"],
      instructions: ["Mix and knead 5 min.", "Bulk ferment 4-6 hours.", "Roll out, cut rounds.", "Dust with cornmeal.", "Proof 1-2 hours.", "Cook on griddle 7-8 min per side.", "Split with fork."],
      categories: ["bread", "sourdough", "breakfast"],
    },
    {
      title: "Grilled Honey Cinnamon Apple Wedges", slug: "grilled-honey-cinnamon-apple-wedges",
      description: "Sweet, caramelized grilled apple wedges with honey and cinnamon.",
      prepTime: "10 minutes", cookTime: "8 minutes", totalTime: "18 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Grilling",
      ingredients: ["4 large apples", "2 tbsp honey", "1 tsp cinnamon", "1 tbsp butter", "Pinch nutmeg"],
      instructions: ["Preheat grill.", "Toss apples with honey, cinnamon, butter.", "Grill 3-4 min per side.", "Drizzle with honey."],
      categories: ["desserts", "snacks"],
    },
    {
      title: "Grilled Honey Cinnamon Pineapple Spears", slug: "grilled-honey-cinnamon-pineapple-spears",
      description: "Juicy grilled pineapple with honey-cinnamon glaze.",
      prepTime: "10 minutes", cookTime: "8 minutes", totalTime: "18 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Grilling",
      ingredients: ["1 pineapple, spears", "2 tbsp honey", "1 tsp cinnamon", "1 tbsp butter", "Pinch cayenne"],
      instructions: ["Preheat grill.", "Mix glaze.", "Brush pineapple.", "Grill 3-4 min per side."],
      categories: ["desserts", "snacks"],
    },
    {
      title: "Cast Iron Cornbread", slug: "cast-iron-cornbread",
      description: "Golden, crispy-edged cornbread baked in cast iron.",
      prepTime: "10 minutes", cookTime: "25 minutes", totalTime: "35 minutes",
      servings: "8", difficulty: "Easy", cuisine: "Southern", cookingMethod: "Baking",
      ingredients: ["1 cup cornmeal", "1 cup flour", "¼ cup sugar", "1 tbsp baking powder", "½ tsp salt", "1 cup buttermilk", "⅓ cup melted butter", "2 eggs"],
      instructions: ["Preheat oven with butter in skillet.", "Mix dry, whisk wet.", "Combine, pour into hot skillet.", "Bake 20-25 min.", "Serve with butter and honey."],
      categories: ["bread", "sides"],
    },
    {
      title: "Sriracha Ketchup", slug: "sriracha-ketchup",
      description: "Quick spicy ketchup for everything.",
      prepTime: "5 minutes", cookTime: "0 minutes", totalTime: "5 minutes",
      servings: "1 cup", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["½ cup ketchup", "2 tbsp sriracha", "1 tbsp honey", "1 tsp lime juice", "½ tsp garlic powder"],
      instructions: ["Combine all ingredients.", "Whisk smooth.", "Adjust heat.", "Refrigerate."],
      categories: ["sauces"],
    },
    {
      title: "Butter Fried Swai", slug: "butter-fried-swai",
      description: "Pan-fried swai fillets in golden butter.",
      prepTime: "10 minutes", cookTime: "10 minutes", totalTime: "20 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["4 swai fillets", "½ cup flour", "1 tsp garlic powder", "1 tsp paprika", "Salt and pepper", "4 tbsp butter", "Lemon wedges", "Parsley"],
      instructions: ["Pat dry, season flour.", "Dredge fillets.", "Melt butter, cook 3-4 min per side.", "Squeeze lemon, garnish."],
      categories: ["seafood"],
    },
    {
      title: "Jerk Shrimp", slug: "jerk-shrimp",
      description: "Spicy, smoky Caribbean jerk-seasoned shrimp.",
      prepTime: "15 minutes", cookTime: "8 minutes", totalTime: "23 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Grilling",
      ingredients: ["1 lb shrimp", "2 tbsp jerk seasoning", "2 tbsp olive oil", "1 tbsp lime juice", "2 cloves garlic", "1 tbsp honey", "Cilantro", "Lime wedges"],
      instructions: ["Mix marinade.", "Toss shrimp, rest 10 min.", "Cook 2-3 min per side.", "Garnish and serve."],
      categories: ["seafood", "shrimp", "appetizers"],
    },
    {
      title: "Pineapple Mango Salsa", slug: "pineapple-mango-salsa",
      description: "Fresh tropical fruit salsa.",
      prepTime: "15 minutes", cookTime: "0 minutes", totalTime: "15 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Latino", cookingMethod: "Sautee",
      ingredients: ["1 cup pineapple", "1 mango", "½ red onion", "1 jalapeno", "¼ cup cilantro", "2 tbsp lime juice", "Salt"],
      instructions: ["Combine all ingredients.", "Toss gently.", "Chill 30 min.", "Serve."],
      categories: ["sauces", "appetizers"],
    },
    {
      title: "Belgian Waffles", slug: "belgian-waffles",
      description: "Light, crispy Belgian waffles with deep pockets.",
      prepTime: "15 minutes", cookTime: "20 minutes", totalTime: "35 minutes",
      servings: "6", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["2 cups flour", "¾ cup milk", "½ cup melted butter", "2 eggs", "1 tbsp sugar", "2 tsp baking powder", "1 tsp vanilla", "½ tsp salt"],
      instructions: ["Mix dry.", "Combine wet.", "Fold together.", "Beat and fold in egg whites.", "Cook in waffle iron.", "Serve with toppings."],
      categories: ["breakfast"],
    },
    {
      title: "Coconut Ice Cream", slug: "coconut-ice-cream",
      description: "Creamy homemade coconut ice cream. Dairy-free friendly.",
      prepTime: "15 minutes", cookTime: "0 minutes", totalTime: "4 hours",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 cans coconut milk", "¾ cup sugar", "1 cup toasted coconut", "1 tsp vanilla", "Pinch salt"],
      instructions: ["Whisk coconut milk, sugar, vanilla.", "Chill 2 hours.", "Churn in ice cream maker.", "Fold in coconut.", "Freeze 2 hours."],
      categories: ["desserts"],
    },
    {
      title: "Easy 4 Ingredient No Knead Rolls", slug: "easy-4-ingredient-no-knead-rolls",
      description: "Easiest dinner rolls. 4 ingredients, no kneading.",
      prepTime: "10 minutes", cookTime: "20 minutes", totalTime: "2 hours 30 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["3 cups flour", "1½ cups warm water", "2¼ tsp yeast", "1 tsp salt"],
      instructions: ["Dissolve yeast in water.", "Add flour and salt.", "Rise 2 hours.", "Scoop into pan.", "Bake at 400°F for 18-20 min."],
      categories: ["bread"],
    },
    {
      title: "Stewed Red Beans (Trinidad Style)", slug: "stewed-red-beans-trinidad-style",
      description: "Hearty Trinidad-style stewed red beans.",
      prepTime: "10 minutes", cookTime: "45 minutes", totalTime: "55 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 cans red kidney beans", "1 tbsp oil", "1 onion", "3 cloves garlic", "1 tbsp brown sugar", "1 cup coconut milk", "Fresh thyme", "1 tsp cumin", "1 Scotch bonnet"],
      instructions: ["Caramelize brown sugar.", "Sauté onion, garlic.", "Add beans, coconut milk, seasonings.", "Simmer 30-40 min.", "Serve over rice."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Italian Herb Sourdough Discard Crackers", slug: "italian-herb-sourdough-discard-crackers",
      description: "Thin, crispy crackers from sourdough discard.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "30 crackers", difficulty: "Easy", cuisine: "Italian", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "¼ cup olive oil", "1 tsp Italian seasoning", "½ tsp garlic powder", "½ tsp sea salt", "Rosemary"],
      instructions: ["Mix discard with oil and seasoning.", "Spread thin on parchment.", "Add salt and rosemary.", "Bake at 350°F for 12-15 min.", "Break into pieces."],
      categories: ["snacks", "sourdough"],
    },
    {
      title: "Sourdough Cranberry Orange Muffins", slug: "sourdough-cranberry-orange-muffins",
      description: "Tender muffins with cranberries and orange zest.",
      prepTime: "15 minutes", cookTime: "22 minutes", totalTime: "37 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "1½ cups flour", "½ cup sugar", "1 tsp baking powder", "½ tsp baking soda", "1 egg", "⅓ cup butter", "½ cup milk", "Orange zest", "1 cup cranberries"],
      instructions: ["Mix dry.", "Whisk wet with discard.", "Fold together. Add cranberries.", "Fill muffin cups.", "Bake at 375°F for 20-22 min."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "20 min Sourdough Pancakes", slug: "20-min-sourdough-pancakes",
      description: "Quick sourdough pancakes in 20 minutes.",
      prepTime: "5 minutes", cookTime: "15 minutes", totalTime: "20 minutes",
      servings: "8", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 cup sourdough discard", "1 cup flour", "1 cup milk", "1 egg", "2 tbsp sugar", "2 tbsp butter", "1 tsp baking powder", "½ tsp baking soda"],
      instructions: ["Whisk wet.", "Add dry.", "Mix until just combined.", "Cook on griddle.", "Serve with syrup."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "SMH Biscuits", slug: "smh-biscuits",
      description: "Soft, melt-in-your-mouth homemade biscuits.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "10", difficulty: "Easy", cuisine: "Southern", cookingMethod: "Baking",
      ingredients: ["2 cups flour", "1 tbsp baking powder", "1 tsp sugar", "½ tsp salt", "½ cup cold butter", "¾ cup buttermilk"],
      instructions: ["Mix dry.", "Cut in butter.", "Add buttermilk.", "Pat and fold 3 times.", "Cut biscuits.", "Bake at 450°F for 12-15 min.", "Brush with butter."],
      categories: ["bread", "biscuits"],
    },
    {
      title: "Fragrant Lemon Herb Salmon", slug: "fragrant-lemon-herb-salmon",
      description: "Baked salmon with lemon, herbs, and garlic.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["4 salmon fillets", "2 lemons", "4 cloves garlic", "2 tbsp olive oil", "Dill", "Parsley", "Salt and pepper"],
      instructions: ["Preheat 400°F.", "Place salmon, add oil, lemon, garlic, herbs.", "Bake 12-15 min.", "Serve."],
      categories: ["seafood", "salmon"],
    },
    {
      title: "Crispy Air Fried Zucchini Fries", slug: "crispy-air-fried-zucchini-fries",
      description: "Crunchy outside, tender inside. Healthier fries.",
      prepTime: "15 minutes", cookTime: "12 minutes", totalTime: "27 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Air Frying",
      ingredients: ["3 zucchini", "½ cup flour", "2 eggs", "1 cup panko", "½ cup Parmesan", "Garlic powder", "Italian seasoning", "Marinara"],
      instructions: ["Bread zucchini: flour, egg, panko-Parmesan.", "Air fry at 400°F for 10-12 min.", "Serve with marinara."],
      categories: ["sides", "snacks", "vegetarian"],
    },
    {
      title: "Broiled Sweet Thai Chili Salmon and Spinach", slug: "broiled-sweet-thai-chili-salmon-and-spinach",
      description: "Quick broiled salmon with Thai chili glaze on spinach.",
      prepTime: "10 minutes", cookTime: "12 minutes", totalTime: "22 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["4 salmon fillets", "¼ cup Thai chili sauce", "2 tbsp soy sauce", "1 tbsp lime juice", "Garlic", "Ginger", "6 cups spinach", "Sesame seeds"],
      instructions: ["Mix glaze.", "Brush salmon, broil 8-10 min.", "Wilt spinach.", "Serve salmon over spinach.", "Garnish."],
      categories: ["seafood", "salmon"],
    },
    {
      title: "Crispy Chunky Granola", slug: "crispy-chunky-granola",
      description: "Crunchy granola with big clusters, nuts, and fruit.",
      prepTime: "10 minutes", cookTime: "30 minutes", totalTime: "40 minutes",
      servings: "8", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["3 cups oats", "1 cup mixed nuts", "½ cup honey", "¼ cup coconut oil", "½ cup coconut", "¼ cup seeds", "1 tsp vanilla", "1 tsp cinnamon", "½ tsp salt", "½ cup dried fruit"],
      instructions: ["Mix dry ingredients.", "Warm honey and coconut oil.", "Combine.", "Press onto sheet.", "Bake at 325°F for 25-30 min.", "Cool, add fruit.", "Break into chunks."],
      categories: ["breakfast", "snacks"],
    },
    {
      title: "Chicken Tinga", slug: "chicken-tinga",
      description: "Smoky shredded chicken in chipotle tomato sauce.",
      prepTime: "15 minutes", cookTime: "30 minutes", totalTime: "45 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Latino", cookingMethod: "Sautee",
      ingredients: ["2 lbs chicken", "1 can fire-roasted tomatoes", "2-3 chipotle peppers", "1 onion", "3 cloves garlic", "Cumin", "Oregano"],
      instructions: ["Poach and shred chicken.", "Blend tomatoes with chipotles.", "Sauté onion.", "Add sauce, simmer.", "Add chicken, cook 5 min.", "Serve on tostadas."],
      categories: ["chicken", "mexican"],
    },
    {
      title: "The Legit Jamaican Coco Bread Recipe", slug: "the-legit-jamaican-coco-bread-recipe",
      description: "Soft, buttery Jamaican coco bread with coconut milk.",
      prepTime: "30 minutes", cookTime: "20 minutes", totalTime: "2 hours 50 minutes",
      servings: "8", difficulty: "Intermediate", cuisine: "Caribbean", cookingMethod: "Baking",
      ingredients: ["3½ cups flour", "¼ cup sugar", "1 tsp salt", "2¼ tsp yeast", "½ cup coconut milk", "½ cup warm water", "3 tbsp melted butter"],
      instructions: ["Dissolve yeast.", "Mix flour, sugar, salt.", "Add liquids and butter.", "Knead 10 min.", "Rise 1.5 hours.", "Shape into ovals.", "Butter and fold.", "Rise 30 min.", "Bake at 350°F for 18-20 min.", "Brush with butter."],
      categories: ["bread"],
    },
  ];

  const insertRecipe = db.prepare(
    "INSERT INTO Recipe (id, title, slug, description, prepTime, cookTime, totalTime, servings, difficulty, cuisine, cookingMethod, imageUrl, ingredients, instructions, nutrition, published, featured, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, datetime('now'), datetime('now'))"
  );

  const insertRecipeCategory = db.prepare(
    "INSERT OR IGNORE INTO RecipeCategory (recipeId, categoryId) VALUES (?, ?)"
  );

  const getRecipe = db.prepare("SELECT id FROM Recipe WHERE slug = ?");

  let created = 0;
  for (const recipe of recipes) {
    const existing = getRecipe.get(recipe.slug);
    if (existing) continue;

    const id = cuid();
    insertRecipe.run(
      id,
      recipe.title,
      recipe.slug,
      recipe.description || null,
      recipe.prepTime || null,
      recipe.cookTime || null,
      recipe.totalTime || null,
      recipe.servings || null,
      recipe.difficulty || null,
      recipe.cuisine || null,
      recipe.cookingMethod || null,
      null, // imageUrl
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.instructions),
      recipe.nutrition || null,
      );

    for (const catSlug of recipe.categories) {
      if (catMap[catSlug]) {
        insertRecipeCategory.run(id, catMap[catSlug]);
      }
    }

    created++;
    console.log(`  Created: ${recipe.title}`);
  }

  console.log(`\nSeed completed! Created ${created} recipes.`);
  console.log(`Total recipes in DB: ${db.prepare("SELECT COUNT(*) as count FROM Recipe").get().count}`);
}

main()
  .catch(console.error)
  .finally(() => db.close());
