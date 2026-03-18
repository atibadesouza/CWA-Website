import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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

  // Remove existing categories
  await prisma.recipeCategory.deleteMany({ where: { recipeId: id } });

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
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
      ingredients: ingredients ? JSON.stringify(ingredients) : undefined,
      instructions: instructions ? JSON.stringify(instructions) : undefined,
      nutrition: nutrition ? JSON.stringify(nutrition) : null,
      published: published ?? true,
      categories: categoryIds
        ? {
            create: categoryIds.map((catId: string) => ({
              categoryId: catId,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(recipe);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.recipe.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
