import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!recipe) return notFound();

  const ingredients: string[] = JSON.parse(recipe.ingredients);
  const instructions: string[] = JSON.parse(recipe.instructions);
  const nutrition: Record<string, string> | null = recipe.nutrition
    ? JSON.parse(recipe.nutrition)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange">
          Home
        </Link>{" "}
        &rsaquo;{" "}
        <Link href="/browse-recipes" className="hover:text-orange">
          Recipes
        </Link>{" "}
        &rsaquo; <span className="text-foreground">{recipe.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          {recipe.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {recipe.categories.length > 0 && (
            <span>
              <strong>Category:</strong>{" "}
              {recipe.categories.map((rc) => rc.category.name).join(", ")}
            </span>
          )}
          {recipe.cuisine && (
            <span>
              <strong>Cuisine:</strong> {recipe.cuisine}
            </span>
          )}
          {recipe.cookingMethod && (
            <span>
              <strong>Method:</strong> {recipe.cookingMethod}
            </span>
          )}
          {recipe.difficulty && (
            <span>
              <strong>Difficulty:</strong>{" "}
              <span className="bg-orange text-white px-2 py-0.5 rounded text-xs font-bold">
                {recipe.difficulty}
              </span>
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-gray-600 leading-relaxed text-lg">
            {recipe.description}
          </p>
        )}
      </div>

      {/* Image */}
      {recipe.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Time & Servings Bar */}
      <div className="bg-light-gray rounded-lg p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {recipe.prepTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Prep Time
            </p>
            <p className="text-lg font-bold text-foreground">
              {recipe.prepTime}
            </p>
          </div>
        )}
        {recipe.cookTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Cook Time
            </p>
            <p className="text-lg font-bold text-foreground">
              {recipe.cookTime}
            </p>
          </div>
        )}
        {recipe.totalTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Total Time
            </p>
            <p className="text-lg font-bold text-foreground">
              {recipe.totalTime}
            </p>
          </div>
        )}
        {recipe.servings && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Servings
            </p>
            <p className="text-lg font-bold text-foreground">
              {recipe.servings}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="font-heading text-2xl font-bold mb-4 text-orange">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="w-2 h-2 rounded-full bg-orange mt-1.5 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <h2 className="font-heading text-2xl font-bold mb-6 text-teal">
            Instructions
          </h2>
          <ol className="space-y-6">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Nutrition */}
      {nutrition && Object.keys(nutrition).length > 0 && (
        <div className="mt-10 bg-light-gray rounded-lg p-6">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Nutrition Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(nutrition).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  {key}
                </p>
                <p className="text-lg font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Button */}
      <div className="mt-8 flex gap-4">
        <PrintButton />
      </div>
    </div>
  );
}
