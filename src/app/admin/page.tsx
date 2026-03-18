import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [recipeCount, messageCount, categoryCount] = await Promise.all([
    prisma.recipe.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.category.count(),
  ]);

  const recentRecipes = await prisma.recipe.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">My Account</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-3xl font-bold text-orange">{recipeCount}</p>
          <p className="text-sm text-gray-500 font-bold uppercase mt-1">
            Total Recipes
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-3xl font-bold text-teal">{categoryCount}</p>
          <p className="text-sm text-gray-500 font-bold uppercase mt-1">
            Categories
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-3xl font-bold text-foreground">{messageCount}</p>
          <p className="text-sm text-gray-500 font-bold uppercase mt-1">
            Unread Messages
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-10">
        <Link href="/admin/recipes/new" className="btn-teal">
          + New Recipe
        </Link>
        <Link href="/admin/recipes" className="btn-orange">
          Manage Recipes
        </Link>
      </div>

      {/* Recent Recipes */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold mb-4">
          Recently Updated Recipes
        </h2>
        <div className="space-y-3">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-bold text-sm">{recipe.title}</p>
                <p className="text-xs text-gray-500">
                  Updated {recipe.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/admin/recipes/${recipe.id}`}
                className="text-orange hover:underline text-sm font-bold"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
