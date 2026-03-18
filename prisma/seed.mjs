import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic import of the generated Prisma client
const clientModule = await import(resolve(__dirname, "../src/generated/prisma/client.ts").replace(/\\/g, "/"));
const PrismaClient = clientModule.PrismaClient;

const prisma = new PrismaClient({
  datasourceUrl: "file:./prisma/dev.db",
});

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("MilagrosAtibaDestiny3", 12);
  await prisma.user.upsert({
    where: { username: "atibadesouza" },
    update: {},
    create: {
      username: "atibadesouza",
      email: "cooking@atibadesouza.com",
      hashedPassword,
      name: "Atiba de Souza",
      role: "admin",
    },
  });

  console.log("Created admin user");

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

  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    catMap[cat.slug] = created.id;
  }

  for (const cat of childCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: catMap[cat.parentSlug] },
      create: { name: cat.name, slug: cat.slug, parentId: catMap[cat.parentSlug] },
    });
    catMap[cat.slug] = created.id;
  }

  for (const cat of grandchildCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, parentId: catMap[cat.parentSlug] },
      create: { name: cat.name, slug: cat.slug, parentId: catMap[cat.parentSlug] },
    });
    catMap[cat.slug] = created.id;
  }

  console.log("Created categories");

  // ALL recipes
  const recipes = [
    {
      title: "No Knead Pull Apart Yeast Dinner Rolls",
      slug: "no-knead-pull-apart-yeast-dinner-rolls",
      description: "Soft, fluffy pull-apart dinner rolls that require no kneading. Perfect for holidays and family dinners.",
      prepTime: "4 hours", cookTime: "15 minutes", totalTime: "4 hours 15 minutes",
      servings: "12", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1.50 cups warm water", "2¼ tsp yeast", "2 tsp coarse salt", "3¼ cups all-purpose flour"],
      instructions: ["Combine water, salt, yeast in a large bowl.", "Add flour gradually to achieve pancake batter consistency.", "Add remaining flour and mix until no dry patches appear.", "Cover and let rise for 2 hours at room temperature.", "Punch down dough and shape into rolls, placing them in a greased baking pan.", "Let rise for another 1.5-2 hours until doubled.", "Bake at 375°F for 15 minutes until golden brown."],
      categories: ["bread"],
    },
    {
      title: "Authentic Trini Coconut Sweetbread",
      slug: "authentic-trini-coconut-sweetbread",
      description: "A traditional Trinidad Christmas bread that has become an everyday treat.",
      prepTime: "45 minutes", cookTime: "60 minutes", totalTime: "1 hour 45 minutes",
      servings: "16", difficulty: "Intermediate", cuisine: "Caribbean", cookingMethod: "Baking",
      ingredients: ["3 cups all-purpose flour", "1 tablespoon baking powder", "½ cup butter, softened", "1 cup sugar", "2½ cups grated fresh coconut", "1 cup raisins", "½ cup Paradise cherries, halved", "½ cup Paradise mixed peel", "1 teaspoon allspice", "1 teaspoon nutmeg", "2 teaspoons cinnamon", "¾ cup whole milk", "2 teaspoons vanilla extract", "1 egg, beaten", "3 tablespoons sugar (for glaze)", "1½ tablespoons water (for glaze)"],
      instructions: ["Grate fresh coconut; use white, firm flesh from good coconuts.", "Sift flour and baking powder together.", "Cream softened butter and sugar.", "Add coconut, raisins, cherries, mixed peel, allspice, cinnamon, and nutmeg.", "Combine egg, milk, and vanilla extract.", "Mix wet ingredients into fruit mixture.", "Add flour gradually (¼ cup at a time).", "Grease two 9x5-inch baking pans.", "Divide dough evenly between pans.", "Press dough to even thickness.", "Bake at 325°F for 60 minutes.", "Combine 3 tablespoons sugar and 1½ tablespoons water for glaze.", "Baste cooked bread with sugar-water; return to hot (off) oven for 5 minutes."],
      nutrition: { Calories: "361", Carbohydrates: "64g", Protein: "4g", Fat: "11g", Fiber: "4.4g", Sodium: "70mg", Cholesterol: "27mg" },
      categories: ["bread"],
    },
    {
      title: "Sourdough Baguettes",
      slug: "sourdough-baguettes",
      description: "Crusty, artisan-style sourdough baguettes with a chewy interior and beautiful crust.",
      prepTime: "30 minutes", cookTime: "25 minutes", totalTime: "12 hours",
      servings: "3 baguettes", difficulty: "Advanced", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["200g active sourdough starter", "500g bread flour", "325g water", "10g salt"],
      instructions: ["Mix starter, flour, and water. Autolyse 30 minutes.", "Add salt and mix thoroughly.", "Stretch and fold every 30 min for 2 hours.", "Bulk ferment 4-6 hours until doubled.", "Divide into 3 equal pieces.", "Pre-shape into logs, rest 20 min.", "Final shape into baguettes.", "Cold proof overnight or proof 1 hour.", "Score with a sharp blade.", "Bake at 475°F with steam for 25 minutes."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Bagel",
      slug: "sourdough-bagel",
      description: "Chewy, dense sourdough bagels with that perfect New York-style crust.",
      prepTime: "30 minutes", cookTime: "25 minutes", totalTime: "14 hours",
      servings: "8", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g active sourdough starter", "300g bread flour", "150g water", "30g honey", "8g salt", "1 tablespoon barley malt syrup"],
      instructions: ["Mix starter, flour, water, honey, and salt into a stiff dough.", "Knead 10 minutes until smooth.", "Bulk ferment 4-5 hours.", "Divide into 8 pieces, shape into bagels.", "Cold proof overnight.", "Boil in water with malt syrup, 1 min each side.", "Add toppings.", "Bake at 425°F for 20-25 minutes."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Berry Galette",
      slug: "sourdough-berry-galette",
      description: "A rustic, free-form sourdough pastry filled with mixed berries.",
      prepTime: "30 minutes", cookTime: "35 minutes", totalTime: "2 hours",
      servings: "8", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["100g sourdough discard", "200g all-purpose flour", "100g cold butter, cubed", "50g sugar", "Pinch of salt", "2-3 tbsp ice water", "3 cups mixed berries", "½ cup sugar", "2 tbsp cornstarch", "1 tbsp lemon juice", "1 egg", "Coarse sugar"],
      instructions: ["Combine flour, sugar, salt. Cut in butter.", "Add discard and ice water to form dough.", "Chill 1 hour.", "Mix berries with sugar, cornstarch, lemon juice.", "Roll dough into 12-inch circle.", "Add filling, fold edges over.", "Egg wash and sprinkle sugar.", "Bake at 400°F for 35 minutes."],
      categories: ["desserts", "sourdough"],
    },
    {
      title: "Camella's Hot Harvest Ketchup",
      slug: "camellas-hot-harvest-ketchup",
      description: "A homemade ketchup with a spicy kick.",
      prepTime: "15 minutes", cookTime: "45 minutes", totalTime: "1 hour",
      servings: "2 cups", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["2 lbs ripe tomatoes", "1 onion, diced", "2 cloves garlic", "½ cup apple cider vinegar", "¼ cup brown sugar", "1 tsp smoked paprika", "½ tsp cayenne", "1 tsp mustard powder", "Salt and pepper"],
      instructions: ["Sauté onion and garlic.", "Add tomatoes, cook 15 minutes.", "Add vinegar, sugar, and spices.", "Simmer 30 minutes.", "Blend smooth.", "Cool and store."],
      categories: ["sauces"],
    },
    {
      title: "Sage Jalapeno Cheddar Sourdough Loaf",
      slug: "sage-jalapeno-cheddar-sourdough-loaf",
      description: "Savory sourdough loaded with cheddar, sage, and jalapenos.",
      prepTime: "30 minutes", cookTime: "45 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Advanced", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["200g sourdough starter", "400g bread flour", "100g whole wheat flour", "350g water", "10g salt", "1 cup sharp cheddar", "2 jalapenos, diced", "2 tbsp fresh sage"],
      instructions: ["Mix starter, flours, and water. Autolyse 30 min.", "Add salt.", "Incorporate cheese, jalapenos, sage during stretch and folds.", "4 sets of stretch and folds over 2 hours.", "Bulk ferment 4-6 hours.", "Shape and place in banneton.", "Cold proof overnight.", "Bake in Dutch oven at 500°F covered 20 min, then 450°F uncovered 25 min."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Date Night Shrimp Cocktail",
      slug: "date-night-shrimp-cocktail",
      description: "Elegant shrimp cocktail perfect for date night.",
      prepTime: "15 minutes", cookTime: "5 minutes", totalTime: "20 minutes",
      servings: "2", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["1 lb jumbo shrimp", "1 lemon", "Old Bay seasoning", "½ cup ketchup", "2 tbsp horseradish", "1 tbsp lemon juice", "½ tsp Worcestershire", "Hot sauce"],
      instructions: ["Boil salted water with lemon and Old Bay.", "Cook shrimp 2-3 minutes until pink.", "Ice bath to stop cooking.", "Mix cocktail sauce ingredients.", "Serve chilled with sauce and lemon."],
      categories: ["appetizers", "seafood", "shrimp"],
    },
    {
      title: "Sourdough Ciabatta",
      slug: "sourdough-ciabatta",
      description: "Light, airy ciabatta with large holes and crispy crust.",
      prepTime: "20 minutes", cookTime: "25 minutes", totalTime: "12 hours",
      servings: "2 loaves", difficulty: "Advanced", cuisine: "Italian", cookingMethod: "Baking",
      ingredients: ["200g sourdough starter", "500g bread flour", "400g water", "10g salt", "2 tbsp olive oil"],
      instructions: ["Mix into very wet, shaggy dough.", "Rest 30 min, add salt and olive oil.", "Stretch and fold every 30 min for 3 hours.", "Bulk ferment until tripled.", "Gently divide into 2 pieces.", "Stretch into rectangles.", "Proof 45 minutes.", "Bake at 475°F with steam for 25 minutes."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Sourdough Chocolate Chip Walnut Pancakes",
      slug: "sourdough-chocolate-chip-walnut-pancakes",
      description: "Fluffy sourdough pancakes with chocolate chips and walnuts.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "8 pancakes", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 cup sourdough discard", "1 cup flour", "1 cup milk", "1 egg", "2 tbsp melted butter", "2 tbsp sugar", "1 tsp baking powder", "½ tsp baking soda", "½ cup chocolate chips", "¼ cup chopped walnuts", "Pinch of salt"],
      instructions: ["Whisk discard, milk, egg, and butter.", "Combine dry ingredients separately.", "Fold together until just combined.", "Add chocolate chips and walnuts.", "Cook on greased griddle over medium heat.", "¼ cup per pancake, flip when bubbly.", "Serve with maple syrup."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "Sourdough Cinnamon Raisin Bread",
      slug: "sourdough-cinnamon-raisin-bread",
      description: "Soft sourdough bread swirled with cinnamon sugar and raisins.",
      prepTime: "30 minutes", cookTime: "40 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g sourdough starter", "400g bread flour", "200g milk", "50g butter", "60g sugar", "8g salt", "1 cup raisins", "3 tbsp cinnamon sugar", "2 tbsp melted butter"],
      instructions: ["Mix starter, flour, milk, butter, sugar, and salt.", "Knead 8-10 minutes.", "Fold in raisins.", "Bulk ferment 4-6 hours.", "Roll into rectangle, brush with butter, add cinnamon sugar.", "Roll into log, place in loaf pan.", "Proof 2-3 hours.", "Bake at 350°F for 35-40 minutes.", "Brush with butter while warm."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Shrimp Fried Rice",
      slug: "shrimp-fried-rice",
      description: "Quick and flavorful shrimp fried rice with vegetables.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 lb shrimp", "4 cups cooked rice", "3 eggs", "1 cup mixed vegetables", "3 green onions", "3 cloves garlic", "3 tbsp soy sauce", "1 tbsp sesame oil", "2 tbsp vegetable oil"],
      instructions: ["Heat oil in wok over high heat.", "Cook shrimp 2 min per side, set aside.", "Scramble eggs, set aside.", "Stir-fry garlic and vegetables 2 min.", "Add rice, stir-fry 3-4 min.", "Add soy sauce, sesame oil.", "Return shrimp and eggs, toss.", "Garnish with green onions."],
      categories: ["seafood", "shrimp", "rice"],
    },
    {
      title: "Simple Sourdough Sandwich Loaf",
      slug: "simple-sourdough-sandwich-loaf",
      description: "Soft, pillowy sourdough bread for sandwiches and toast.",
      prepTime: "20 minutes", cookTime: "35 minutes", totalTime: "10 hours",
      servings: "1 loaf", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["150g sourdough starter", "450g bread flour", "240g milk", "30g butter", "30g honey", "9g salt"],
      instructions: ["Mix starter, flour, milk, butter, honey. Autolyse 30 min.", "Add salt, knead until smooth.", "Bulk ferment 4-6 hours with hourly folds.", "Shape into log.", "Place in greased loaf pan.", "Proof 3-4 hours until 1 inch above rim.", "Bake at 375°F for 30-35 minutes.", "Cool completely on wire rack."],
      categories: ["bread", "sourdough"],
    },
    {
      title: "Simple Yellow Split Peas Dhal",
      slug: "simple-yellow-split-peas-dhal",
      description: "Comforting Trinidad-style dhal with yellow split peas.",
      prepTime: "10 minutes", cookTime: "40 minutes", totalTime: "50 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["1 cup yellow split peas", "4 cups water", "1 tbsp oil", "4 cloves garlic", "1 onion", "2 tsp cumin", "1 tsp turmeric", "1 Scotch bonnet pepper", "Salt", "Fresh cilantro"],
      instructions: ["Boil split peas until soft, about 30 min.", "Sauté garlic and onion until golden.", "Add cumin and turmeric, cook 1 min.", "Add spiced mixture to peas.", "Add whole Scotch bonnet, simmer 10 min.", "Season with salt. Remove pepper.", "Garnish with cilantro. Serve with rice or roti."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Sourdough Cheddar Biscuits",
      slug: "sourdough-cheddar-biscuits",
      description: "Flaky, buttery sourdough biscuits loaded with sharp cheddar.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "2 cups flour", "1 tbsp baking powder", "½ tsp baking soda", "½ cup cold butter", "1 cup sharp cheddar", "¾ cup buttermilk", "1 tsp garlic powder", "Salt and pepper", "Melted butter", "Parsley"],
      instructions: ["Combine dry ingredients.", "Cut in cold butter.", "Add discard, cheddar, buttermilk.", "Drop spoonfuls on baking sheet.", "Bake at 425°F for 12-15 minutes.", "Brush with butter and parsley."],
      categories: ["bread", "sourdough", "biscuits"],
    },
    {
      title: "Olive Oil Dip For Sourdough Bread",
      slug: "olive-oil-dip-for-sourdough-bread",
      description: "Simple olive oil dip with herbs and Parmesan.",
      prepTime: "5 minutes", cookTime: "0 minutes", totalTime: "5 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Italian", cookingMethod: "Sautee",
      ingredients: ["½ cup extra virgin olive oil", "2 tbsp balsamic vinegar", "3 cloves garlic, minced", "1 tsp dried oregano", "1 tsp dried basil", "½ tsp red pepper flakes", "2 tbsp Parmesan", "Salt and pepper"],
      instructions: ["Pour olive oil into a shallow bowl.", "Add balsamic vinegar.", "Add garlic and herbs.", "Add Parmesan, season with salt and pepper.", "Serve with sourdough bread."],
      categories: ["appetizers", "sauces"],
    },
    {
      title: "Stewed Pumpkin (Trinidad Style)",
      slug: "stewed-pumpkin-trinidad-style",
      description: "Simple, savory Caribbean-style stewed pumpkin.",
      prepTime: "10 minutes", cookTime: "25 minutes", totalTime: "35 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 lbs Caribbean pumpkin, cubed", "2 tbsp oil", "1 onion", "3 cloves garlic", "1 tbsp brown sugar", "½ cup coconut milk", "Fresh thyme", "Salt and pepper", "1 Scotch bonnet (optional)"],
      instructions: ["Sauté onion and garlic.", "Add brown sugar until dissolved.", "Add pumpkin cubes.", "Add coconut milk, thyme, Scotch bonnet.", "Simmer 20-25 minutes until tender.", "Season and serve."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Sourdough English Muffins",
      slug: "sourdough-english-muffins",
      description: "Classic English muffins with sourdough flavor. Full of nooks and crannies.",
      prepTime: "20 minutes", cookTime: "20 minutes", totalTime: "8 hours",
      servings: "10", difficulty: "Intermediate", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["150g sourdough starter", "300g flour", "150g milk", "30g melted butter", "20g sugar", "5g salt", "Cornmeal"],
      instructions: ["Mix all ingredients except cornmeal.", "Knead 5 minutes.", "Bulk ferment 4-6 hours.", "Roll out ¾ inch thick.", "Cut 3-inch rounds.", "Dust with cornmeal.", "Proof 1-2 hours.", "Cook on dry griddle 7-8 min per side.", "Split with fork to preserve nooks."],
      categories: ["bread", "sourdough", "breakfast"],
    },
    {
      title: "Grilled Honey Cinnamon Apple Wedges",
      slug: "grilled-honey-cinnamon-apple-wedges",
      description: "Sweet, caramelized grilled apple wedges with honey and cinnamon.",
      prepTime: "10 minutes", cookTime: "8 minutes", totalTime: "18 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Grilling",
      ingredients: ["4 large apples, wedged", "2 tbsp honey", "1 tsp cinnamon", "1 tbsp melted butter", "Pinch of nutmeg"],
      instructions: ["Preheat grill to medium-high.", "Toss apples with butter, honey, cinnamon, nutmeg.", "Grill 3-4 min per side.", "Drizzle with extra honey."],
      categories: ["desserts", "snacks"],
    },
    {
      title: "Grilled Honey Cinnamon Pineapple Spears",
      slug: "grilled-honey-cinnamon-pineapple-spears",
      description: "Juicy grilled pineapple with honey-cinnamon glaze.",
      prepTime: "10 minutes", cookTime: "8 minutes", totalTime: "18 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Grilling",
      ingredients: ["1 fresh pineapple, spears", "2 tbsp honey", "1 tsp cinnamon", "1 tbsp melted butter", "Pinch cayenne (optional)"],
      instructions: ["Preheat grill to medium-high.", "Mix honey, butter, cinnamon, cayenne.", "Brush pineapple.", "Grill 3-4 min per side.", "Drizzle remaining mixture on top."],
      categories: ["desserts", "snacks"],
    },
    {
      title: "Cast Iron Cornbread",
      slug: "cast-iron-cornbread",
      description: "Golden, crispy-edged cornbread baked in cast iron.",
      prepTime: "10 minutes", cookTime: "25 minutes", totalTime: "35 minutes",
      servings: "8", difficulty: "Easy", cuisine: "Southern", cookingMethod: "Baking",
      ingredients: ["1 cup yellow cornmeal", "1 cup flour", "¼ cup sugar", "1 tbsp baking powder", "½ tsp salt", "1 cup buttermilk", "⅓ cup melted butter", "2 eggs", "2 tbsp butter for skillet"],
      instructions: ["Preheat oven to 425°F with butter in cast iron skillet.", "Mix dry ingredients.", "Whisk wet ingredients.", "Combine, pour into hot skillet.", "Bake 20-25 minutes until golden.", "Serve with butter and honey."],
      categories: ["bread", "sides"],
    },
    {
      title: "Sriracha Ketchup",
      slug: "sriracha-ketchup",
      description: "Quick spicy ketchup that adds kick to everything.",
      prepTime: "5 minutes", cookTime: "0 minutes", totalTime: "5 minutes",
      servings: "1 cup", difficulty: "Easy", cuisine: "American", cookingMethod: "Sautee",
      ingredients: ["½ cup ketchup", "2 tbsp sriracha", "1 tbsp honey", "1 tsp lime juice", "½ tsp garlic powder"],
      instructions: ["Combine all ingredients.", "Whisk until smooth.", "Adjust sriracha to taste.", "Refrigerate."],
      categories: ["sauces"],
    },
    {
      title: "Butter Fried Swai",
      slug: "butter-fried-swai",
      description: "Pan-fried swai in golden butter with a light coating.",
      prepTime: "10 minutes", cookTime: "10 minutes", totalTime: "20 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["4 swai fillets", "½ cup flour", "1 tsp garlic powder", "1 tsp paprika", "Salt and pepper", "4 tbsp butter", "Lemon wedges", "Fresh parsley"],
      instructions: ["Pat fillets dry.", "Mix seasoned flour.", "Dredge fillets.", "Melt butter in skillet over medium-high.", "Cook 3-4 min per side.", "Squeeze lemon and garnish."],
      categories: ["seafood"],
    },
    {
      title: "Jerk Shrimp",
      slug: "jerk-shrimp",
      description: "Spicy, smoky Caribbean jerk-seasoned shrimp.",
      prepTime: "15 minutes", cookTime: "8 minutes", totalTime: "23 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Grilling",
      ingredients: ["1 lb large shrimp", "2 tbsp jerk seasoning", "2 tbsp olive oil", "1 tbsp lime juice", "2 cloves garlic", "1 tbsp honey", "Fresh cilantro", "Lime wedges"],
      instructions: ["Mix jerk seasoning, oil, lime juice, garlic, honey.", "Toss shrimp in marinade 10 min.", "Cook 2-3 min per side.", "Garnish with cilantro and lime."],
      categories: ["seafood", "shrimp", "appetizers"],
    },
    {
      title: "Pineapple Mango Salsa",
      slug: "pineapple-mango-salsa",
      description: "Fresh tropical fruit salsa for fish, chicken, or chips.",
      prepTime: "15 minutes", cookTime: "0 minutes", totalTime: "15 minutes",
      servings: "4", difficulty: "Easy", cuisine: "Latino", cookingMethod: "Sautee",
      ingredients: ["1 cup pineapple, diced", "1 ripe mango, diced", "½ red onion", "1 jalapeno", "¼ cup cilantro", "2 tbsp lime juice", "Salt"],
      instructions: ["Combine all ingredients.", "Toss gently.", "Chill 30 minutes.", "Serve with chips or grilled proteins."],
      categories: ["sauces", "appetizers"],
    },
    {
      title: "Belgian Waffles",
      slug: "belgian-waffles",
      description: "Light, crispy Belgian waffles with deep pockets for toppings.",
      prepTime: "15 minutes", cookTime: "20 minutes", totalTime: "35 minutes",
      servings: "6", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["2 cups flour", "¾ cup milk", "½ cup melted butter", "2 eggs, separated", "1 tbsp sugar", "2 tsp baking powder", "1 tsp vanilla", "½ tsp salt"],
      instructions: ["Mix dry ingredients.", "Combine milk, butter, yolks, vanilla.", "Mix wet and dry.", "Beat egg whites to stiff peaks.", "Fold in whites.", "Cook in waffle iron until golden.", "Serve with berries and syrup."],
      categories: ["breakfast"],
    },
    {
      title: "Coconut Ice Cream",
      slug: "coconut-ice-cream",
      description: "Creamy homemade coconut ice cream. Dairy-free friendly.",
      prepTime: "15 minutes", cookTime: "0 minutes", totalTime: "4 hours",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 cans coconut milk", "¾ cup sugar", "1 cup shredded coconut, toasted", "1 tsp vanilla", "Pinch of salt"],
      instructions: ["Whisk coconut milk, sugar, vanilla, salt.", "Chill 2 hours.", "Churn in ice cream maker.", "Fold in toasted coconut.", "Freeze until firm, about 2 hours."],
      categories: ["desserts"],
    },
    {
      title: "Easy 4 Ingredient No Knead Rolls",
      slug: "easy-4-ingredient-no-knead-rolls",
      description: "The easiest dinner rolls. 4 ingredients, no kneading.",
      prepTime: "10 minutes", cookTime: "20 minutes", totalTime: "2 hours 30 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["3 cups flour", "1½ cups warm water", "2¼ tsp active dry yeast", "1 tsp salt"],
      instructions: ["Dissolve yeast in warm water 5 minutes.", "Add flour and salt, mix.", "Rise 2 hours.", "Scoop into greased muffin tin.", "Bake at 400°F for 18-20 minutes."],
      categories: ["bread"],
    },
    {
      title: "Stewed Red Beans (Trinidad Style)",
      slug: "stewed-red-beans-trinidad-style",
      description: "Hearty Trinidad-style stewed red beans in rich sauce.",
      prepTime: "10 minutes", cookTime: "45 minutes", totalTime: "55 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Caribbean", cookingMethod: "Sautee",
      ingredients: ["2 cans red kidney beans", "1 tbsp oil", "1 onion", "3 cloves garlic", "1 tbsp brown sugar", "1 cup coconut milk", "Fresh thyme", "1 tsp cumin", "Salt and pepper", "1 Scotch bonnet"],
      instructions: ["Heat oil, caramelize brown sugar.", "Sauté onion and garlic.", "Add beans, coconut milk, thyme, cumin, Scotch bonnet.", "Simmer 30-40 minutes.", "Season, remove Scotch bonnet.", "Serve over rice."],
      categories: ["sides", "vegetarian"],
    },
    {
      title: "Italian Herb Sourdough Discard Crackers",
      slug: "italian-herb-sourdough-discard-crackers",
      description: "Thin, crispy crackers made with sourdough discard.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "30 crackers", difficulty: "Easy", cuisine: "Italian", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "¼ cup olive oil", "1 tsp Italian seasoning", "½ tsp garlic powder", "½ tsp flaky sea salt", "Fresh rosemary"],
      instructions: ["Mix discard, olive oil, seasoning, garlic powder.", "Spread very thinly on parchment.", "Sprinkle with salt and rosemary.", "Bake at 350°F for 12-15 minutes.", "Cool and break into pieces."],
      categories: ["snacks", "sourdough"],
    },
    {
      title: "Sourdough Cranberry Orange Muffins",
      slug: "sourdough-cranberry-orange-muffins",
      description: "Tender muffins with cranberries and orange zest.",
      prepTime: "15 minutes", cookTime: "22 minutes", totalTime: "37 minutes",
      servings: "12", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["1 cup sourdough discard", "1½ cups flour", "½ cup sugar", "1 tsp baking powder", "½ tsp baking soda", "¼ tsp salt", "1 egg", "⅓ cup melted butter", "½ cup milk", "1 tsp vanilla", "Zest of 1 orange", "1 cup cranberries"],
      instructions: ["Preheat 375°F. Line muffin tin.", "Mix dry ingredients.", "Whisk wet ingredients with discard.", "Fold together. Add cranberries.", "Fill muffin cups.", "Bake 20-22 minutes.", "Cool 5 minutes."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "20 min Sourdough Pancakes",
      slug: "20-min-sourdough-pancakes",
      description: "Quick sourdough pancakes ready in 20 minutes.",
      prepTime: "5 minutes", cookTime: "15 minutes", totalTime: "20 minutes",
      servings: "8", difficulty: "Easy", cuisine: "American", cookingMethod: "Frying",
      ingredients: ["1 cup sourdough discard", "1 cup flour", "1 cup milk", "1 egg", "2 tbsp sugar", "2 tbsp melted butter", "1 tsp baking powder", "½ tsp baking soda", "Pinch of salt"],
      instructions: ["Whisk discard, milk, egg, butter.", "Add dry ingredients.", "Mix until just combined.", "Cook on greased griddle.", "¼ cup batter per pancake.", "Flip when bubbly.", "Serve with syrup and fruit."],
      categories: ["breakfast", "sourdough"],
    },
    {
      title: "SMH Biscuits",
      slug: "smh-biscuits",
      description: "Soft, melt-in-your-mouth homemade biscuits.",
      prepTime: "15 minutes", cookTime: "15 minutes", totalTime: "30 minutes",
      servings: "10", difficulty: "Easy", cuisine: "Southern", cookingMethod: "Baking",
      ingredients: ["2 cups flour", "1 tbsp baking powder", "1 tsp sugar", "½ tsp salt", "½ cup cold butter", "¾ cup cold buttermilk", "2 tbsp melted butter"],
      instructions: ["Preheat 450°F.", "Mix dry ingredients.", "Cut in cold butter.", "Add buttermilk.", "Pat to 1-inch, fold 3 times.", "Cut with biscuit cutter.", "Bake 12-15 minutes.", "Brush with melted butter."],
      categories: ["bread", "biscuits"],
    },
    {
      title: "Fragrant Lemon Herb Salmon",
      slug: "fragrant-lemon-herb-salmon",
      description: "Baked salmon with lemon, herbs, and garlic.",
      prepTime: "10 minutes", cookTime: "15 minutes", totalTime: "25 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["4 salmon fillets", "2 lemons", "4 cloves garlic", "2 tbsp olive oil", "1 tbsp fresh dill", "1 tbsp fresh parsley", "Salt and pepper"],
      instructions: ["Preheat 400°F. Line sheet with foil.", "Place salmon, drizzle oil and lemon juice.", "Top with garlic, dill, parsley.", "Season and add lemon slices.", "Bake 12-15 minutes.", "Serve with vegetables or rice."],
      categories: ["seafood", "salmon"],
    },
    {
      title: "Crispy Air Fried Zucchini Fries",
      slug: "crispy-air-fried-zucchini-fries",
      description: "Crunchy outside, tender inside. A healthier fry alternative.",
      prepTime: "15 minutes", cookTime: "12 minutes", totalTime: "27 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Air Frying",
      ingredients: ["3 medium zucchini", "½ cup flour", "2 eggs", "1 cup panko", "½ cup Parmesan", "1 tsp garlic powder", "1 tsp Italian seasoning", "Salt and pepper", "Cooking spray", "Marinara sauce"],
      instructions: ["Set up breading station: flour, eggs, panko-Parmesan mix.", "Dredge, dip, coat zucchini.", "Preheat air fryer 400°F.", "Arrange single layer, spray.", "Air fry 10-12 min, flip halfway.", "Serve with marinara."],
      categories: ["sides", "snacks", "vegetarian"],
    },
    {
      title: "Broiled Sweet Thai Chili Salmon and Spinach",
      slug: "broiled-sweet-thai-chili-salmon-and-spinach",
      description: "Quick broiled salmon with sweet Thai chili glaze on spinach.",
      prepTime: "10 minutes", cookTime: "12 minutes", totalTime: "22 minutes",
      servings: "4", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["4 salmon fillets", "¼ cup sweet Thai chili sauce", "2 tbsp soy sauce", "1 tbsp lime juice", "2 cloves garlic", "1 tbsp ginger", "6 cups spinach", "1 tbsp olive oil", "Sesame seeds", "Green onions"],
      instructions: ["Mix glaze ingredients.", "Place salmon on foil-lined pan, brush with glaze.", "Broil 8-10 minutes.", "Wilt spinach in olive oil.", "Serve salmon over spinach.", "Drizzle remaining glaze, garnish."],
      categories: ["seafood", "salmon"],
    },
    {
      title: "Crispy Chunky Granola",
      slug: "crispy-chunky-granola",
      description: "Crunchy homemade granola with big clusters, nuts, and fruit.",
      prepTime: "10 minutes", cookTime: "30 minutes", totalTime: "40 minutes",
      servings: "8", difficulty: "Easy", cuisine: "American", cookingMethod: "Baking",
      ingredients: ["3 cups oats", "1 cup mixed nuts", "½ cup honey", "¼ cup coconut oil", "½ cup shredded coconut", "¼ cup sunflower seeds", "1 tsp vanilla", "1 tsp cinnamon", "½ tsp salt", "½ cup dried fruit"],
      instructions: ["Preheat 325°F. Line sheet with parchment.", "Mix oats, nuts, coconut, seeds, cinnamon, salt.", "Warm honey and coconut oil, add vanilla.", "Pour over dry, mix well.", "Press firmly onto sheet. Don't stir!", "Bake 25-30 minutes.", "Cool completely. Add dried fruit.", "Break into chunks."],
      categories: ["breakfast", "snacks"],
    },
    {
      title: "Chicken Tinga",
      slug: "chicken-tinga",
      description: "Smoky, spicy shredded chicken in chipotle tomato sauce.",
      prepTime: "15 minutes", cookTime: "30 minutes", totalTime: "45 minutes",
      servings: "6", difficulty: "Easy", cuisine: "Latino", cookingMethod: "Sautee",
      ingredients: ["2 lbs chicken", "1 can fire-roasted tomatoes", "2-3 chipotle peppers in adobo", "1 onion", "3 cloves garlic", "1 tbsp oil", "1 tsp cumin", "1 tsp oregano", "Salt and pepper"],
      instructions: ["Poach and shred chicken.", "Blend tomatoes and chipotles.", "Sauté onion until caramelized.", "Add garlic, cumin, oregano.", "Add chipotle-tomato sauce, simmer.", "Add shredded chicken, cook 5 min.", "Serve on tostadas with avocado."],
      categories: ["chicken", "mexican"],
    },
    {
      title: "The Legit Jamaican Coco Bread Recipe",
      slug: "the-legit-jamaican-coco-bread-recipe",
      description: "Soft, buttery Jamaican coco bread with coconut milk.",
      prepTime: "30 minutes", cookTime: "20 minutes", totalTime: "2 hours 50 minutes",
      servings: "8", difficulty: "Intermediate", cuisine: "Caribbean", cookingMethod: "Baking",
      ingredients: ["3½ cups flour", "¼ cup sugar", "1 tsp salt", "2¼ tsp yeast", "½ cup coconut milk", "½ cup warm water", "3 tbsp melted butter", "Additional butter for folding"],
      instructions: ["Dissolve yeast in warm water 10 min.", "Mix flour, sugar, salt.", "Add yeast mixture, coconut milk, butter.", "Knead 10 minutes.", "Rise 1.5 hours.", "Divide into 8 pieces.", "Roll into ovals.", "Brush with butter, fold in half.", "Rise 30 minutes.", "Bake at 350°F for 18-20 minutes.", "Brush with butter."],
      categories: ["bread"],
    },
  ];

  for (const recipe of recipes) {
    const { categories: recipeCats, nutrition, ...recipeData } = recipe;
    const existing = await prisma.recipe.findUnique({
      where: { slug: recipeData.slug },
    });
    if (existing) continue;

    await prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: JSON.stringify(recipeData.ingredients),
        instructions: JSON.stringify(recipeData.instructions),
        nutrition: nutrition ? JSON.stringify(nutrition) : null,
        categories: {
          create: recipeCats
            .filter((slug) => catMap[slug])
            .map((slug) => ({ categoryId: catMap[slug] })),
        },
      },
    });
    console.log(`  Created: ${recipeData.title}`);
  }

  console.log("\nSeed completed successfully!");
  console.log(`Total recipes: ${recipes.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
