import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;

  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!recipe) return notFound();

  const initialData = {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description || "",
    prepTime: recipe.prepTime || "",
    cookTime: recipe.cookTime || "",
    totalTime: recipe.totalTime || "",
    servings: recipe.servings || "",
    difficulty: recipe.difficulty || "Easy",
    cuisine: recipe.cuisine || "",
    cookingMethod: recipe.cookingMethod || "",
    imageUrl: recipe.imageUrl || "",
    ingredients: JSON.parse(recipe.ingredients) as string[],
    instructions: JSON.parse(recipe.instructions) as string[],
    nutrition: recipe.nutrition
      ? (JSON.parse(recipe.nutrition) as Record<string, string>)
      : {},
    categoryIds: recipe.categories.map((rc) => rc.categoryId),
    published: recipe.published,
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">
        Edit: {recipe.title}
      </h1>
      <RecipeForm categories={categories} initialData={initialData} />
    </div>
  );
}
