import { prisma } from "@/lib/prisma";
import RecipeForm from "@/components/RecipeForm";

export default async function NewRecipePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">New Recipe</h1>
      <RecipeForm categories={categories} />
    </div>
  );
}
