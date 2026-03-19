import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, "seed-data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("seed-data.json not found.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Seed users
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        hashedPassword: user.hashedPassword,
        name: user.name,
        role: user.role,
      },
    });
    console.log(`  User: ${user.username}`);
  }

  // Seed categories (parents first, then children)
  const parentCats = data.categories.filter((c: { parentId: string | null }) => !c.parentId);
  const childCats = data.categories.filter((c: { parentId: string | null }) => c.parentId);

  for (const cat of [...parentCats, ...childCats]) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId,
      },
    });
  }
  console.log(`  Categories: ${data.categories.length}`);

  // Seed recipes
  for (const recipe of data.recipes) {
    await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: {
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        totalTime: recipe.totalTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        cookingMethod: recipe.cookingMethod,
        imageUrl: recipe.imageUrl,
        gallery: recipe.gallery,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        instructionImages: recipe.instructionImages,
        nutrition: recipe.nutrition,
        published: recipe.published === 1 || recipe.published === true,
        featured: recipe.featured === 1 || recipe.featured === true,
      },
    });
  }
  console.log(`  Recipes: ${data.recipes.length}`);

  // Seed recipe-category relationships
  for (const rc of data.recipeCategories) {
    await prisma.recipeCategory.upsert({
      where: {
        recipeId_categoryId: {
          recipeId: rc.recipeId,
          categoryId: rc.categoryId,
        },
      },
      update: {},
      create: {
        recipeId: rc.recipeId,
        categoryId: rc.categoryId,
      },
    });
  }
  console.log(`  RecipeCategories: ${data.recipeCategories.length}`);

  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
