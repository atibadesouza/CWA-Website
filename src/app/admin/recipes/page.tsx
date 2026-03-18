import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Manage Recipes</h1>
        <Link href="/admin/recipes/new" className="btn-teal">
          + New Recipe
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-gray">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                Title
              </th>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                Categories
              </th>
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">
                Status
              </th>
              <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">{recipe.title}</p>
                  <p className="text-xs text-gray-500">{recipe.slug}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {recipe.categories.map((rc) => (
                      <span
                        key={rc.categoryId}
                        className="text-xs bg-light-gray px-2 py-0.5 rounded"
                      >
                        {rc.category.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      recipe.published
                        ? "bg-teal/10 text-teal"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {recipe.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/recipe/${recipe.slug}`}
                      className="text-gray-500 hover:text-teal text-sm"
                      target="_blank"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/recipes/${recipe.id}`}
                      className="text-orange hover:underline text-sm font-bold"
                    >
                      Edit
                    </Link>
                    <DeleteRecipeButton recipeId={recipe.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recipes.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No recipes yet.</p>
            <Link href="/admin/recipes/new" className="btn-teal mt-4 inline-block">
              Create Your First Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
