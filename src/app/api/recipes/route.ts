import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    prepTime,
    cookTime,
    totalTime,
    servings,
    difficulty,
    cuisine,
    cookingMethod,
    imageUrl,
    ingredients,
    instructions,
    nutrition,
    categoryIds,
    published,
  } = body;

  if (!title || !ingredients || !instructions) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = slugify(title);

  const recipe = await prisma.recipe.create({
    data: {
      title,
      slug,
      description,
      prepTime,
      cookTime,
      totalTime,
      servings,
      difficulty,
      cuisine,
      cookingMethod,
      imageUrl,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      nutrition: nutrition ? JSON.stringify(nutrition) : null,
      published: published ?? true,
      categories: categoryIds
        ? {
            create: categoryIds.map((id: string) => ({ categoryId: id })),
          }
        : undefined,
    },
  });

  return NextResponse.json(recipe);
}
