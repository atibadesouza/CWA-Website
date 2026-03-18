const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "prisma", "dev.db"));

const update = db.prepare(`
  UPDATE Recipe SET instructions = ?, gallery = ? WHERE slug = ?
`);

const recipes = [
  // === BATCH 1 ===
  {
    slug: "sourdough-baguettes",
    gallery: [],
    instructions: [
      "Build Levain",
      "Autolyse - 1 hr",
      "Add Salt and Levain",
      "2 hr Warm Bulk Ferment 3 folds 30 min apart",
      "Cold Ferment 16-19 hrs",
      "Divide into 6 balls approx 350g with flour on the board and hands",
      "Rest 30 min",
      "Shape https://youtu.be/QUu9ReGQOq0",
      "1:45 min proof",
      "Heat oven 500 with steam 1 hr",
      "Turn Down to 450 - emile henry - 20 min covered, 10 uncovered open oven - 22 min"
    ],
  },
  {
    slug: "sourdough-bagel",
    gallery: [],
    instructions: [
      "Dissolve water, starter, salt, yeast, and sugar in your stand mixer's mixing bowl",
      "Start the mixer using the dough hook attachment on a low setting (typically I set my Kitchen Aide mixer to# 2)",
      "Slowly add the flour (I typically add 3-4 heaping spoonfuls at a time).",
      "Turn the mixer up to #3 or #4 to help all of the flour get incorporated. Typically this takes a minute or 2",
      "Reduce the mixer speed to #2 and let the dough kneed for 3 minutes",
      "Take the mixing bowl off the machine and gently kneed the dough by hand in the bowl for 1 minute.",
      "Drizzle 1 teaspoon of oil on the dough and gently rub the oil on the outside of the entire dough surface",
      "Cover the bowl and place in a warm area for 3-4 hours until the dough has doubled in size.",
      "Turn dough out onto a non floured surface.",
      "Cut the Dough in half",
      "Shape each cut half into an approximate log",
      "Cut each half into 4 making 8 pieces total",
      "Shape each piece of dough into a ball ensuring that you seal the bottom well",
      "Using your finger, pierce a hole in the middle of each dough ball and then gently start to stretch the dough to shape a bagel.",
      "Cover the bagels with a damp paper towel or kitchen cloth and allow the bagels to rest for 30 min",
      "Preheat your oven to 425 Degree F",
      "Bring 4 quarts (1 gallon) of water to boil in a large pot",
      "Add 2 tbs of honey to the water as its heating up",
      "Add bagels to boiling water.",
      "Boil each side of the bagels for 30 seconds.",
      "Remove the bagels from the boiling water and place on a cooling rack.",
      "Generously egg wash the bagels.",
      "Boil the remainder of your bagels and eggwash them",
      "Place the bagels onto a parchment-lined baking sheet",
      "Bake 425 F for 20 min or until golden brown",
      "Let them rest on the baking sheet for 10 minutes then remove them to a cooling rack"
    ],
  },
  {
    slug: "sourdough-berry-galette",
    gallery: [],
    instructions: [
      "Whisk together all the dry ingredients in a large bowl. 1. 240g Flour 2. 15g Sugar 3. 5g Salt",
      "Cut the butter into 12-16 cubes",
      "Add half of the butter to the dry ingredients and using a pastry blender cut the butter into the dry ingredients. The butter will look like pellets in the dough",
      "Add the remaining butter and continue to cut it in with the pastry blender",
      "Add the sourdough starter and combine well",
      "Add the cold water and the dough will begin to come together. it is important to work to combine as much of the flour into the dough as possible at this stage. The dough will be shaggy and messy",
      "Dump all the dough out onto a clean surface and press it all together to form a ball. Once all the dough bits have been combined press the ball flat to make a \"disc\" shape. It is imperative that this step takes no more than 1 minute",
      "Wrap the dough in plastic and refrigerate for a minimum of 1 hour",
      "Cut the leaves off the strawberries and chop them to roughly the same size as your raspberries.",
      "Add chopped strawberries and raspberries to a bowl with 1. 150g Brown sugar 2. 30g Corn starch 3. Pinch of salt 4. Zest of a lemon 5. Juice of half a lemon",
      "Gently mix together until you can no longer see the corn starch",
      "Cover and refrigerate until the dough is ready. While in the fridge the filling will naturally spring some juices. we will use that liquid later to make a GLAZE!!!",
      "Grease a large baking sheet. I prefer to line my baking sheet with foil and then generously spray it with olive oil",
      "Make an egg wash from 1 egg",
      "Remove the fruit filling from the fridge and drain off any liquid that has been created. Remember to reserve this precious juice. 1. it tastes amazing 2. we will use it as glaze later",
      "On a small plate or in a bowl pour a few tablespoons of turbinado sugar. I use the packets!!!! For me it's much more efficient. Each galette \"gets\" its own packet.",
      "Preheat Oven to 375 Degrees F",
      "Remove the dough from the fridge and cut into 4 parts. I typically use my dough scraper to cut the cold dough",
      "Return 3 of the dough parts to the fridge.",
      "Lightly flour your board and the dough. Using your hand quickly shape the dough into a ball.",
      "Using a rolling pin roll the dough out. The dough will be cold and still and we want to roll it out until it large enough that an 8-inch plate can easily fit in the middle of it. It WILL be necessary to add a bit of flour to the surface of the dough every few rolls. I also pick the dough up and turn it to ensure it does not stick.",
      "Once the dough is rolled out enough, place an 8-inch plate in the middle of it and use a pizza cutter to cut the edges leaving a perfect circle.",
      "Take all the dough scraps and press them together and return them to the fridge",
      "Transfer your galette dough to your baking sheet.",
      "Generously egg wash the dough. The egg wash helps create a barrier between the natural juices of the fruit and the dough. without it your galette will be very soggy.",
      "Add filling to the middle of the dough. Try not to add much of the extra juice.",
      "Grab an side of the dough and fold it over the fruit filling. Then take your other hand and fold another side of the dough over the filling. where the 2 sides \"meet\" they will over lap. Gently press that over lap together to form a crease. Continue this all the way round your galette.",
      "Egg wash the dough edges of your galette and then sprinkle the entire top of the galette with turbinado sugar.",
      "Gently move your galette to the corner of your baking tray.",
      "Spray with olive oil the area just vacated by the galette",
      "Return to the fridge and repeat this process with the next piece of dough.",
      "After making 4 you will have a bunch of scrap dough. Gently press all of them together to make a 5th galette (typically its the biggest and its MINE)",
      "Bake at 375 degrees F for 30 minutes or until the edges of your pastry are golden brown",
      "This step is OPTIONAL 20 or so minutes into your baking time you can add the reserved fruit syrup to a small saucepan and begin to reduce it over low heat. You can also modify the taste of your glaze at this point if you would like.",
      "Once the galettes are finished baking dress them with your glaze."
    ],
  },
  {
    slug: "camellas-hot-harvest-ketchup",
    gallery: ["/images/recipes/camellas-hot-harvest-ketchup/gallery-1.jpg"],
    instructions: [
      "Mix all the ingredients to ensuring to blend in the brown sugar well."
    ],
  },
  {
    slug: "sage-jalapeno-cheddar-sourdough-loaf",
    gallery: [],
    instructions: [
      "Build your levain and allow it to mature (double in size). This typically takes about 4-5 hours at 78 degrees F.",
      "Once your levain is near or at doubled in size create your autolyse. Mix 255 g flour with 260 g of water Allow your autolyse to rest for 30-90 minutes.",
      "Add Levain to autolyse using the stretch and fold method. I suggest performing a minimum of 16 stretch and folds.",
      "Allow to rest for 30 min",
      "Sprinkle the salt over your dough and perform 16 more stretches and folds to combine the salt into the dough",
      "Allow to rest for 30 minutes",
      "Laminate the dough. While the dough is fully stretched out drizzle on the olive oil. Then sprinkle on the 1. Sage 2. Jalapenos 3. Cheddar Carefully fold up your lamination using the thirds method.",
      "Allow the dough to rest for 60 minutes",
      "Perform First Coil Pull.",
      "Allow the dough to rest for 60 minutes",
      "Perform 2nd Coil Pull",
      "Allow the dough to rest for 60 minutes",
      "Perform 3rd Coil pull",
      "Allow the dough to rest for 90 minutes",
      "Shape your dough. Placing the whole Sage leaf in the middle of your banneton and adorned with jalapenos slices around it.",
      "Cold retard for 16-24 hours",
      "Heat oven for 60 minutes at 500 degrees",
      "Remove dough from the fridge and place on rice floured parchment paper.",
      "Bake in a dark cast iron pot for 40 minutes."
    ],
  },
  {
    slug: "authentic-trini-coconut-sweetbread",
    gallery: [],
    instructions: [
      "Grate the coconut. By far this is the hardest step in making a coconut sweet bread. An authentic sweet bread must have freshly grated coconut. Typically a whole coconut will give me almost 3 cups of grated coconut. Be careful with your knuckles in this step as you grate the coconut, I have grated my knuckles a few times. I typically buy 2 coconuts to ensure that at least 1 is good. Some local international or Caribbean stores will break the coconut open for you in the store so you can ensure you are buying a good coconut. A good coconut will have flesh that is WHITE and firm. If the flesh nearest the hist is mushy at all, do not use that coconut. Also, your coconut MUST have water inside of it. A dry coconut is BAD. Use a hammer to crack open the coconut. Once you have the coconut cracked open a butter knife is the best tool for prying the flesh away from the husk. The flesh of coconuts spoils quickly so after you crack it open do not leave it out on the counter for more than 60-90 minutes.",
      "Sift together flour and baking powder in a large bowl. Coconut Sweetbread is a heavy bread. sifting your flour will help with the density of your final product.",
      "In a separate bowl cream the butter and sugar. Creaming butter is the process of combining softened butter and sugar using a fork or the back of a spoon. Growing up I used to cream butter and sugar and just eat it when I was being too lazy to make cookies.",
      "Add Fruit and Spice Mix to the creamed butter and sugar: 1. Coconut 2. Raisins 3. Cherries 4. Mixed peel 5. All Spice 6. Cinnamon 7. Nutmeg Mix thoroughly",
      "In a Third bowl combine the wet ingredients: 1. Egg 2. Milk 3. Vanilla Extract",
      "Add the Wet Ingredients to the Fruit and Spice mix and combine.",
      "1/4 cup at a time add and mix the flour into the Wet Ingredient and Fruit Mix. This will seem like a bad idea. You will feel that there is not enough liquid. I feel this way EVERYTIME I make this recipe. Just keep adding the flour and mixing it all together. Sweetbread is a dense bread.",
      "Grease two 9x5 inch baking pans",
      "Divide the dough \"evenly\" between the two pans",
      "Using the back of a spoon press the dough into an even thickness covering the base of the pan",
      "Bake at 325 degrees F for 60 min The bread is baked when a toothpick returns clean after sticking the middle of the bread. If your toothpick does not return clean, bake the bread for an additional 5 minutes and check again. Continue adding 5 minutes until the toothpick returns clean. NOTE: use a new toothpick each time you stick the bread",
      "TURN OFF THE OVEN",
      "Combine 3 tbs of sugar and 1 1/2 tbs of water. The sugar will not fully dissolve (we dont want it to).",
      "Once your bread is fully cooked generously baste it with the sugar water and return it to the oven for 5 minutes. The oven should be hot from baking but not turned on."
    ],
  },
  {
    slug: "date-night-shrimp-cocktail",
    gallery: ["/images/recipes/date-night-shrimp-cocktail/gallery-1.jpg"],
    instructions: [
      "In a medium-sized bowl combine 1. Ketchup 2. Dijon Horseradish mustard 3. Worcestershire Sauce 4. Lemon juice 5. Garlic 6. Camella's Kitchen Pumpkin Spice Pepper Sauce Each ingredient's quantity can be adjusted to achieve the desired flavor. If you want your cocktail sauce sweeter then add more ketchup. If you like tangy then definitely experiment with the Dijon Horseradish mustard. I like it spicier so I double up on Camella's Kitchen Pumpkin Spice Pepper Sauce.",
      "Dry shrimp and lay them out flat",
      "Spray one side of your shrimp with olive oil",
      "Mix together: 1. Old Bay 2. Cayenne 3. Black Pepper 4. Garlic powder 5. Thyme (optional)",
      "sprinkle on the seasoning on one side of the shrimp",
      "Place in a steam basket and steam until the shrimp turn pink. I typically steam my shrimp without a lid for approximately 5 minutes. I do not turn the shrimp during steaming.",
      "Remove for the steam basket and serve at room temperature or on ice"
    ],
  },
  {
    slug: "sourdough-ciabatta",
    gallery: [],
    instructions: [
      "Build a 200-gram Levain and allow to fully ripen",
      "Autolyse Flour and water for 60 minutes",
      "Add Salt using 60 stretch and folds",
      "Add Levain to Autolyse using 60 stretch and folds",
      "Allow dough to rest for 60 minutes in the oven with the light turned on",
      "Allow dough to rest for 60 minutes in the oven with the light turned on",
      "Laminate the dough",
      "Allow to rest for 30 minutes in the oven with the light turned on",
      "Perform the First Stretch and fold",
      "Allow to rest for 30 minutes in the oven with the light turned on",
      "Perform second Stretch and fold",
      "Allow to rest for 30 minutes in the oven with the light turned on",
      "Perform 3rd Stretch and fold",
      "Allow to rest for 60 minutes in the oven with the light turned on",
      "Perform 4th Stretch and fold. The dough should have almost doubled in size by this time",
      "Allow to rest for 60 minutes in the oven with the light turned on",
      "Line a baking sheet or pizza peel with floured parchment paper",
      "Dump the dough out onto a well floured surface and divide it into 2 equal parts",
      "Gently but firmly stretch each half into a rectangular shape roughly 6 inches wide by 18 inches long. Achieving a perfect rectangle is not the goal, just something close to it. Attempting to have the shape with a roughly even thickness is far more important.",
      "Transfer one rectangle to your floured and parchment lined baking sheet or pizza peel.",
      "Stack the 2nd rectangle on top of the first. If one side of my first rectangle is thicker the other I will stack the thick side of my second rectangle ontop the thin side of the first. This helps even out my overall thickness.",
      "Cover and allow to rest for 45 minutes to 2 hours. The longer you allow the dough to proof in this stage is the better your crump will turn out.",
      "30 minutes into the final rest, 1. Place a pan with 3-4 cups of water at the bottom shelf of your oven 2. Place a pizza stone, Tawa, or upside-down baking sheet on the middle rack in your over 3. Preheat your oven to 450 degrees for 45 min (or until the water starts to steam)",
      "Transfer the dough on the parchment paper to the pizza stone/Tawa/upside-down baking sheet",
      "Bake for 26-29 minutes Baking time is based upon your desired crust color for your ciabatta.",
      "Remove from the oven and place on a cooling rack"
    ],
  },
  {
    slug: "sourdough-chocolate-chip-walnut-pancakes",
    gallery: ["/images/recipes/sourdough-chocolate-chip-walnut-pancakes/gallery-1.jpg"],
    instructions: [
      "Add all the dry ingredients into a bowl and mix together. 1. Flour 2. Baking Powder 3. Baking Soda 4. Sugar 5. Salt",
      "Add all wet ingredients to the dry ingredients and whisk together thoroughly. 1. Sourdough discard 2. Milk 3. eggs 4. Vanilla extract 5. Butter 6. Sour cream",
      "Once the batter is made add crushed walnuts. The size that you crush the walnuts to is totally a matter of individual preference.",
      "Using a ladle pour batter onto a hot griddle and make pancakes that are 5-6 inches in diameter.",
      "As soon as you pour batter for each pancake drop 8-12 chocolate chips on each pancake",
      "Cook until bubbles form in the batter and then flip and cook for an additional minute or two.",
      "Pile pancakes up in a stack and top them with more crushed walnuts and chocolate chips. Then Finish with whipped cream"
    ],
  },
  {
    slug: "sourdough-cinnamon-raisin-bread",
    gallery: [],
    instructions: [
      "Soak the raisins in a bowl with the vanilla extract.",
      "With your hands combine 1. Flour 2. Butter 3. Salt 4. Sugar Keep working the mixture until the butter looks like pea sized crumbs.",
      "Add Starter and warm milk and mix well until the flour has been completely absorbed. The dough will be sticky and shaggy",
      "Cover and let rest for 30 minutes",
      "Turn the dough out on a lightly floured surface and kneed for 10 minutes. You will get tired.... it's expected...take a break for 15-20 seconds and continue kneading. This step is crucial to the final texture of your bread.",
      "Place in a lightly oiled bowl and cover for 30 minutes",
      "After 30 minutes Laminate the dough and add the raisins",
      "Allow to rest for 30 minutes",
      "Perform a coil pull",
      "Allow to rest for 30 minutes",
      "Perform a coil pull",
      "Allow to rest for 1 hour",
      "Perform a coil Pull",
      "Allow to rest for 60 minutes",
      "Turn the dough out on a lightly floured surface and shape it into a rectangle",
      "Using a rolling pin roll the dough into a rectangle that is no more than 6 inches wide. Roll the dough to approximately 1/4 inch thickness",
      "egg wash the dough",
      "sprinkle the cinnamon-sugar mixture across the dough leaving a 1-inch edge at the tops and 1/2 inch edge at the sides",
      "Roll the dough into a log.",
      "Place in a well greased 9x5 baking pan",
      "Allow to rise for 90 minutes",
      "Preheat oven to 375 F and Bake for 50-55 minutes. Using a toothpick check the bread for doneness. The toothpick should come out of the loaf looking clean with no dough attached to it. If the bread is not done, bake for another five minutes and check again.",
      "Allow to rest for exactly 5 minutes and then remove from the baking pan to a cooling rack. This loaf must cool before you cut it. It will smell amazing and you will want to cut it right away but it is actually finishing its cooking process as it cools."
    ],
  },

  // === BATCH 2 ===
  {
    slug: "shrimp-fried-rice",
    gallery: [
      "/images/recipes/shrimp-fried-rice/gallery-1.jpg",
      "/images/recipes/shrimp-fried-rice/gallery-2.jpg",
      "/images/recipes/shrimp-fried-rice/gallery-3.jpg",
    ],
    instructions: [
      "Add soy sauce, chicken broth, and sugar to a bowl and mix to combine. This is the base of the flavor for our fried rice",
      "On a large burner heat a large wok with 3-4 tablespoons of olive oil over medium heat",
      "Stirring continuously Sautee onions and whites of the green onion for 3-4 minutes until the onion starts to become tender",
      "Add Garlic and continue to stir for 2 minutes while turning the heat up to medium-high.",
      "Turn the temperature up to high and add the shrimp. Spread the shrimp 1 layer deep across the sides of the wok and stir constantly. The shrimp should cook quickly. You want to cook the shrimp until they just begin to turn pink on either side.",
      "Remove the shrimp from the wok and set aside",
      "Add 1 tablespoon of olive oil to the wok and turn the temperature back down to medium",
      "Add the frozen vegetables and season with salt and pepper. Use the moisture of the vegetables to incorporate the \"drippings\" left behind from the shrimp. Cook until the vegetables and thoroughly hot.",
      "Remove the vegetables from the wok and set them aside",
      "Add 1 tsp of olive oil to the wok and turn the heat up to medium-high",
      "Sprinkle thyme into the olive oil as its heating up. The smell of thyme frying in the oil is amazing!!!",
      "Add 2 beaten eggs to the wok and scramble them hard",
      "Remove the egg from the wok and set aside",
      "Turn the temperature on the wok up to medium-high",
      "Add all of the cold white rice to the wok. We want to begin heating the rice and also breaking it up as it tends to clump when it's cold. The best practice is to use 2 spatulas and constantly stir the rice from the bottom up for 3-5 minutes.",
      "Add Sesame oil about 2 minutes into stirring the rice. I like to wait until I see the steam coming off of rice I dug up from the bottom to mix before I add the sesame oil.",
      "Add vegetables and egg and continue mixing. By this time most if not all of the rice should be pretty warm. Continue mixing for another 3-5 minutes until the rice is hot",
      "Add the Chicken broth, soy sauce, and sugar mixtures. The aroma of the sesame oil and the soy sauce will be intoxicating but don't get sucked into enjoying it...keep mixing your rice from the bottom of the wok to the top.",
      "Continue mixing for 3-5 more minutes until all the rice has taken on that wonderful fried rice color. At this point feel free to taste the rice and adjust with soy sauce, black pepper, or sesame oil to your taste.",
      "Add bean sprouts",
      "When you are happy with the taste add the shrimp and green of the green onion and stir for another 3-5 minutes until the shrimp are hot again.",
      "Serve over a bed of bean sprouts"
    ],
  },
  {
    slug: "simple-sourdough-sandwich-loaf",
    gallery: [],
    instructions: [
      "Warm milk and butter to 90-100 Degrees F",
      "In a large bowl add: 1. milk 2. butter 3. salt 4. sugar 5. starter",
      "Add in 1 1/2 cups of flour and mix together. The consistency will be close to a pancake batter.",
      "Slowly add the remaining flour until a dough ball begins to form.",
      "Turn the dough onto a floured surface and kneed until the dough is smooth",
      "place the dough into a greased bowl and cover with plastic wrap",
      "Perform 4 coil pulls 30 mins apart",
      "Perform 2 coil pulls 60 mins apart",
      "turn the dough out onto a lightly floured surface and shape into a rectangle",
      "roll the dough into a log and place in greased 9x5pan.",
      "Plastic wrap and refridgerate overnight for at least 12 hours",
      "Remove the loaf pan from the fridge and allow the dough to rise for 4-6 hours or until it doubles. The length of time will be determined by the warms and humidity of your kitchen",
      "Preheat oven to 350 Degrees F",
      "Prepare an Egg wash",
      "Generously egg wash the dough",
      "Cut a half-inch deep slit through the middle of the dough length wise",
      "Bake for 45-50 min at 350 Degrees F",
      "allow to rest for 5 min in the baking pan before removing to a cooling rack"
    ],
  },
  {
    slug: "simple-yellow-split-peas-dhal",
    gallery: [],
    instructions: [
      "Add 1. 2 quarts of water, 2. 1 1/2 tbs of Garlic 3. 2 tbs of olive oil to a large stockpot",
      "Rinse split peas and add to the stock pot. Boil over medium heat for 1 hour.",
      "Sautee over a medium heat in 3-4 tablespoons of olive oil: 1. Onion 2. Cumin 3. Cinnamon sticks 4. Cloves sautee until the onion becomes translucent",
      "Carefully remove the cloves",
      "Turn the heat back on the peas and bring to a simmer",
      "Add and continue to sautee 1. Tomato 2. Ginger 3. Garlic 4. Tumeric 5. Cardamom 6. Coriander 7. Paprika 8. Cayenne 9. Cilantro 10. Thyme 11. Salt 12. Black pepper 13. Lemon juice",
      "Sautee until the tomatoes are fully cooked (typically 8-12 min). You will need to stir the pot once a minute or so.",
      "Add sauteed spices to the peas and mix well",
      "Allow to simmer for 5 minutes",
      "Taste the Dhal and adjust the salt, turmeric, and cardamom to your desire."
    ],
  },
  {
    slug: "sourdough-cheddar-biscuits",
    gallery: [],
    instructions: [
      "Whisk together dry ingredients to a large bowl 1. Flour 2. Garlic Powder 3. Baking soda 4. Baking Powder 5. Sugar 6. Salt",
      "Grate frozen butter directly into the dry ingredients",
      "Toss the grated butter and dry ingredients",
      "Cover bowl and place in the fridge",
      "Grate all the cheddar cheese in a separate bowl. Reserve 1/3 cup of grated cheddar cheese into a separate bowl for later. You should end up with 2 bowls: 1 bowl with about 1 cup of grated cheddar and 1 bowl with about 1/3 cup of grated cheddar.",
      "Add buttermilk and Sourdough discard to the bowl with 1 cup of grated cheddar cheese and mix them together well.",
      "Cover wet ingredients and place them in the fridge for at least 20 min (the colder the better but not frozen)",
      "Preheat the oven to 475",
      "Foil line a baking sheet and grease it well",
      "Remove Wet and dry ingredients from the fridge",
      "Add wet ingredients to the dry ingredient's bowl",
      "Using a spoon quickly but gently cut and fold the wet ingredients into the dry ingredients. The dough will naturally feel dry and look scruffy. Typically about 90% of the flour gets incorporated into the dough",
      "Turn the dough out onto a floured surface and gather all of its loose bits and form a dough ball.",
      "Using a floured rolling pin roll the dough to 1 to 1.5 inches in thickness",
      "Cut the dough in half and stack in on itself",
      "Rotate the dough 90 degrees",
      "Using a floured rolling pin roll the dough to 1 to 1.5 inches in thickness",
      "Cut the dough in half and stack in on itself",
      "Roll out the dough to about 1 inch thickness",
      "Using a circle cookie cutter (or and another clean circular device) cut biscuits from your dough. Typically I make biscuits that are either 2 inches in diameter or 3 inches in diameter.",
      "Transfer biscuits to your greased and lined baking sheet. Placing them about 1 inch apart",
      "Gather any remaining scrap dough into a ball and roll it out to a 1 inch thickness and cut more biscuits. Remember the key is to do this quickly. We do not want this dough warming up. If your dough does get warm place your baking sheet in the fridge for 10 minutes",
      "Using your thumb press down and make an indention in the middle of each biscuit.",
      "Fill each indention with grated cheddar cheese from the 1/3 cup we reserved earlier.",
      "Turn the Temp in the oven DOWN to 450 Degrees",
      "Bake for 10 minutes and then check for doneness. If they are not done bake for an additional 2 min. Check them every 1-2 minutes until they are done. Your biscuits are done when they have a beautiful golden brown color."
    ],
  },
  {
    slug: "olive-oil-dip-for-sourdough-bread",
    gallery: [
      "/images/recipes/olive-oil-dip-for-sourdough-bread/gallery-1.jpg",
      "/images/recipes/olive-oil-dip-for-sourdough-bread/gallery-2.jpg",
    ],
    instructions: [
      "Add all ingredients into a bowl and mix well",
      "enjoy with freshly baked sourdough bread"
    ],
  },
  {
    slug: "stewed-pumpkin-trinidad-style",
    gallery: [
      "/images/recipes/stewed-pumpkin-trinidad-style/gallery-1.jpg",
      "/images/recipes/stewed-pumpkin-trinidad-style/gallery-2.jpg",
      "/images/recipes/stewed-pumpkin-trinidad-style/gallery-3.jpg",
    ],
    instructions: [
      "Cut pumpkin into pieces approximately 2 inches by 1 inch and 1 inch thick",
      "Heat oil over a medium heat",
      "Sautee Onions ad garlic until onions are translucent",
      "Add 1. Pumpkin 2. Thyme 3. Black Pepper 4. Salt 5. Brown sugar 6. water",
      "Cover and tell simmer for 10 minutes then stir. The pumpkin should be cooked in 20-25 minutes depending on the size of your pieces.",
      "Serve hot as a side dish"
    ],
  },
  {
    slug: "sourdough-english-muffins",
    gallery: [],
    instructions: [
      "Add all Dry Ingredients to a very large bowl and whisk together 1. Flour 2. Dry powder milk 3. Salt 4. Sugar 5. Yeast",
      "Add Wet Ingredients and mix by hand. Once all of the dry ingredients and wet ingredients have been combined, knead the dough in the bowl for 4-5 minutes. This dough is designed to be a tacky/sticky dough after you have completed kneading it but it should knead into a solid dough ball. 1. Sourdough Starter 2. Water 3. Butter",
      "Lightly grease another large bowl with oil and turn the dough into the greased bowl and let rest covered at room temp for 2-3 hours. The dough will double to triple in size depending on your room temperature.",
      "Sprinkle three (3) foil-lined baking sheets with cornmeal",
      "Flour a large surface",
      "Turn the dough out onto the floured surface",
      "Cut the dough in half. Return one half to the bowl",
      "Shape the dough on your floured surface into a rough rectangle and pull the dough out with a rolling pin until it is 1/4 inch thick",
      "Using a 2 inch round cookie cutter cut as many English muffins as possible. Transfer each muffin to the baking sheet leaving an inch between each muffin",
      "After all the muffins are removed take remaining dough and gently knead it back into a ball and roll it out to 1/2 inch thick and cut more muffins.",
      "Repeat this process until you have cut muffins out of all of the dough",
      "Sprinkle cornmeal on top of the muffins",
      "Cover all your baking sheets with plastic wrap and let rise for 1 hour",
      "Heat a large non-stick frying pan over a medium low heat",
      "Place each muffin in the frying pan and cook on each side for 6 minutes",
      "Remove from the heat and let cool completely",
      "ENJOY!!!"
    ],
  },
  {
    slug: "grilled-honey-cinnamon-apple-wedges",
    gallery: [],
    instructions: [
      "If you are using wooden skewers, soak the skewers in water for 1 hour",
      "Place apple wedges in a flat dish",
      "Sprinkle on cinnamon evenly",
      "Drizzle on honey evenly",
      "Drizzle on oil",
      "Gently mix to coat all the sides of the apple",
      "Skewer each apple",
      "Grill on each cut side of the fruit for 4-5 minutes or until grill marks appear and darken"
    ],
  },
  {
    slug: "grilled-honey-cinnamon-pineapple-spears",
    gallery: [],
    instructions: [
      "If you are using wooden skewers, soak the skewers in water for 1 hour",
      "Place Pineapple spears in a flat dish",
      "Sprinkle on cinnamon evenly",
      "Drizzle on honey evenly",
      "Drizzle on oil",
      "Gently mix to coat all the sides of the pineapple",
      "Skewer each pineapple",
      "Grill on each side for 3-4 minutes or until grill marks appear and darken"
    ],
  },
  {
    slug: "cast-iron-cornbread",
    gallery: [
      "/images/recipes/cast-iron-cornbread/gallery-1.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-2.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-3.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-4.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-5.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-6.jpg",
      "/images/recipes/cast-iron-cornbread/gallery-7.jpg",
    ],
    instructions: [
      "Preheat oven to 425 degrees",
      "Grease and flour 10-inch cast iron pan (bakers pan spray with flour will also work well)",
      "Whisk together all of the dry ingredients in a large bowl",
      "In a separate bowl whisk the 2 eggs",
      "To the eggs add and whisk together: 1. Milk 2. Vanilla extract 3. Butter",
      "Add wet ingredients to the dry ingredients and fold to combine. Do not over mix.",
      "Scrape all the batter into your cast iron pan evenly",
      "Bake for 23 minutes or until a toothpick comes out clean after sticking the middle of the cornbread"
    ],
  },

  // === BATCH 3 ===
  {
    slug: "sriracha-ketchup",
    gallery: [],
    instructions: [
      "Combine all ingredients in a bowl. Enjoy with fries, chicken, fish, or just about anything. It can be stored in the fridge in an airtight container for up to a week."
    ],
  },
  {
    slug: "butter-fried-swai",
    gallery: [
      "/images/recipes/butter-fried-swai/gallery-1.jpg",
      "/images/recipes/butter-fried-swai/gallery-2.jpg",
    ],
    instructions: [
      "Season fish with 1.5 tsp salt and 1 tsp black pepper",
      "Mix all dry ingredients in a shallow long dish: 1. Flour 2. Corn meal 3. Onion powder 4. Thyme 5. Cayenne 6. Old bay",
      "Heat a large frying pan over medium heat. Once the pan is hot add butter and oil.",
      "Dredge swai filet in the breading one filet at a time.",
      "Fry swai on each side for 3-4 minutes",
      "Remove swai from the oil and place on paper towels to drain excess oil"
    ],
  },
  {
    slug: "jerk-shrimp",
    gallery: [],
    instructions: [
      "Season shrimp with 1. Jerk seasoning 2. Thyme 3. Old bay 4. Salt 5. Black pepper 6. Honey",
      "Sautee Garlic for 2-3 minutes",
      "Add shrimp to sauteed garlic ad cook until they turn pink",
      "Serve hot"
    ],
  },
  {
    slug: "pineapple-mango-salsa",
    gallery: [
      "/images/recipes/pineapple-mango-salsa/gallery-1.jpg",
      "/images/recipes/pineapple-mango-salsa/gallery-2.jpg",
    ],
    instructions: [
      "Cut pineapple into 1/4 inch cubes",
      "Cut mangoes into 1/4 inch cubes",
      "Combine all ingredients and mix well",
      "Chill overnight and serve cold"
    ],
  },
  {
    slug: "belgian-waffles",
    gallery: [],
    instructions: [
      "Melt 1/2 cup (2 sticks) of butter and allow to cool to 80-90 degrees",
      "In a large bowl whisk together: 1. Flour 2. Baking Powder 3. Sugar 4. Salt",
      "In a sperate bowl whisk the 3 eggs",
      "To the Eggs add and whisk: 1. Milk 2. Vanilla Extract",
      "Add Butter to eggs, milk, and vanilla extract and whisk together",
      "Add wet ingredients to dry ingredients and fold together using a large spoon. Do not over mix your batter.",
      "Using a ladle scoop batter into waffle iron and cook until golden brown",
      "Serve hot with your favorite toppings"
    ],
  },
  {
    slug: "coconut-ice-cream",
    gallery: [],
    instructions: [
      "Crack your coconut and remove all the flesh from the husk. If possible reserve the coconut water.",
      "Chop coconut into thin strips",
      "Blend thoroughly all of the coconut with the coconut water or 1 1/2 cup of water.",
      "Strain and squeeze the coconut milk out of your blended mixture",
      "Add all ingredients to your Ice cream maker and mix them thouroughly 1. Coconut milk 2. Condensed milk 3. Evaporated milk",
      "Chill the mixture for 2 hours",
      "Follow your ice cream makers instructions."
    ],
  },
  {
    slug: "easy-4-ingredient-no-knead-rolls",
    gallery: [
      "/images/recipes/easy-4-ingredient-no-knead-rolls/gallery-1.jpg",
      "/images/recipes/easy-4-ingredient-no-knead-rolls/gallery-2.jpg",
    ],
    instructions: [
      "Add warm water, salt and yeast to a large bowl",
      "Add all 6.5 cups of flour to the bowl",
      "Mix with a wooden spoon until there are no patches or pockets of dry flour. It may take 3-5 minutes to mix in all the flour. You may be tempted to add more water, DO NOT, just keep mixing until all the flour is absorbed",
      "Cover the dough with damp paper towels or kitchen towel and allow the dough to rise for 2-3 hours.",
      "Generously flour 2 baking sheets",
      "Turn the dough out on a floured surface. The dough will be sticky",
      "Using a knife divide dough into 2 equal parts using a sharp knife.",
      "Continue dividing the dough until you have 24 roughly equal-sized pieces",
      "Generously flour each of your hands",
      "Pick up one of the 24 portions of dough",
      "Stretch the edges of the dough around to the bottom and middle of the dough ball on all sides, rotating the dough in your hands as you do so. (The bottom of the ball will look like a bunch of bunched ends.) Do this until the top of the dough ball is smooth.",
      "Place dough ball on floured baking sheet",
      "Repeat this process with all the dough balls placing the 2 inches apart",
      "Cover with damp paper towels and allow them to rest for 40-45 minutes.",
      "Place a pizza stone sprinkled with cornmeal or heavy metal baking surface on the center rack",
      "Place a roasting pan with 6-8 cups of water on the bottom rack of your oven.",
      "Preheat oven to 450 degrees",
      "Once water in your roasting pan begins to steam transfer the bread to your pizza stone. For pull-apart rolls place rolls next to each other For regular rolls place rolls 2 inches apart",
      "Bake for 15 minutes or until golden brown"
    ],
  },
  {
    slug: "stewed-red-beans-trinidad-style",
    gallery: [
      "/images/recipes/stewed-red-beans-trinidad-style/gallery-1.jpg",
      "/images/recipes/stewed-red-beans-trinidad-style/gallery-2.jpg",
    ],
    instructions: [
      "Chop 1. Carrots 2. Cilantro (if not using dried) 3. Parsley (if not using dried) 4. Green Onion (optional) 5. Green Pepper (optional) 6. Pumpkin (optional)",
      "In a medium-sized stockpot sautee onion and garlic in olive oil over medium heat for 5-7 minutes or until onions are translucent",
      "Drain and rines your cans of beans",
      "Add beans, bouillon cube, and water to sauteed onions and garlic",
      "Add all your chopped and dried seasonings to your pot and stir together well. Base Seasonings: 1. Thyme 2. Parsley 3. Cilantro 4. Carrots 5. Salt 6. Black Pepper Optional Seasonings: 1. Pumpkin 2. Green Pepper 3. Green onion 4. Bay leaf",
      "Add 1 scotch bonnet pepper. Drop the pepper into the pot and do not stir the pot again until you remove the pepper",
      "Let simmer over medium-low to medium heat for 15 min or until your carrots and pumpkin are cooked",
      "Once your carrots and pumpkin are cooked remove your scotch bonnet pepper"
    ],
  },
  {
    slug: "italian-herb-sourdough-discard-crackers",
    gallery: [],
    instructions: [
      "Preheat over to 325 degrees",
      "Parchment or foil line a baking sheet and spray with olive oil",
      "Melt and cool 2 tablespoons of butter",
      "Combine 1. sourdough discard 2. butter 3. herb blend, and 4. 1/2 teaspoon of salt",
      "Spread mixture thinly over a greased and lined baking sheet",
      "Bake for 10 min",
      "Remove from the oven, score and fork your crackers and sprinkle with 1/2 teaspoon of salt",
      "Bake for an additional 23 minutes or until golden",
      "Remove from the oven and transfer the parchment/foil with crackers to a cooling rack immediately"
    ],
  },
  {
    slug: "sourdough-cranberry-orange-muffins",
    gallery: [],
    instructions: [
      "Pre-heat your oven to 400 degrees.",
      "In a small bowl mix together: 1. brown sugar, 2. 1/3 cup flour, and 3. cold butter until crumbly. Cover and place in the refrigerator or freezer.",
      "In another bowl whisk together: 1. egg 2. vanilla extract 3. melted butter, and 4. grated orange peel.",
      "Gently fold in your sourdough starter until blended.",
      "In a large bowl whisk together: 1. sugar, 2. baking powder, 3. baking soda, 4. salt, and 5. 1 1/2 cups flour.",
      "Add the bowl of wet ingredients to the dry ingredients and stir until everything is just combined.",
      "Add the cranberries and apples and fold until blended.",
      "Evenly divide the batter among the cavities of a paper lined muffin tin. Sprinkle the tops with the streusel.",
      "Bake the muffins for 16 to 20 minutes, until a toothpick comes out clean. Let the muffins cool in the pan for 5 minutes. Let them cool completely in a wire rack."
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
    console.log(`  Updated: ${recipe.slug} (${recipe.gallery.length} gallery)`);
  }
}

console.log(`\nUpdated ${updated} recipes with exact original instructions and gallery.`);
db.close();
