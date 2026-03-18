import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ category?: string; cuisine?: string; method?: string; sort?: string; page?: string }>;
}

export default async function BrowseRecipesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 18;

  const where: Record<string, unknown> = { published: true };

  if (params.category) {
    where.categories = {
      some: {
        category: { slug: params.category },
      },
    };
  }

  if (params.cuisine) {
    where.cuisine = params.cuisine;
  }

  if (params.method) {
    where.cookingMethod = params.method;
  }

  const orderBy: Record<string, string> = {};
  switch (params.sort) {
    case "oldest":
      orderBy.createdAt = "asc";
      break;
    case "az":
      orderBy.title = "asc";
      break;
    case "za":
      orderBy.title = "desc";
      break;
    default:
      orderBy.createdAt = "desc";
  }

  const [recipes, total, categories, cuisines, methods] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        categories: { include: { category: true } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.recipe.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.recipe.findMany({
      where: { cuisine: { not: null }, published: true },
      select: { cuisine: true },
      distinct: ["cuisine"],
    }),
    prisma.recipe.findMany({
      where: { cookingMethod: { not: null }, published: true },
      select: { cookingMethod: true },
      distinct: ["cookingMethod"],
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  function buildUrl(overrides: Record<string, string>) {
    const p = { ...params, ...overrides };
    const qs = Object.entries(p)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join("&");
    return `/browse-recipes${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">
        Browse Recipes
      </h1>

      {/* Filters */}
      <div className="bg-light-gray rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildUrl({ category: "", page: "1" })}
                className={`text-xs px-2 py-1 rounded ${
                  !params.category
                    ? "bg-orange text-white"
                    : "bg-white text-gray-700 hover:bg-orange hover:text-white"
                } transition`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug, page: "1" })}
                  className={`text-xs px-2 py-1 rounded ${
                    params.category === cat.slug
                      ? "bg-orange text-white"
                      : "bg-white text-gray-700 hover:bg-orange hover:text-white"
                  } transition`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cuisine
            </label>
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildUrl({ cuisine: "", page: "1" })}
                className={`text-xs px-2 py-1 rounded ${
                  !params.cuisine
                    ? "bg-teal text-white"
                    : "bg-white text-gray-700 hover:bg-teal hover:text-white"
                } transition`}
              >
                All
              </Link>
              {cuisines.map((r) => (
                <Link
                  key={r.cuisine}
                  href={buildUrl({ cuisine: r.cuisine!, page: "1" })}
                  className={`text-xs px-2 py-1 rounded ${
                    params.cuisine === r.cuisine
                      ? "bg-teal text-white"
                      : "bg-white text-gray-700 hover:bg-teal hover:text-white"
                  } transition`}
                >
                  {r.cuisine}
                </Link>
              ))}
            </div>
          </div>

          {/* Method Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cooking Method
            </label>
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildUrl({ method: "", page: "1" })}
                className={`text-xs px-2 py-1 rounded ${
                  !params.method
                    ? "bg-teal text-white"
                    : "bg-white text-gray-700 hover:bg-teal hover:text-white"
                } transition`}
              >
                All
              </Link>
              {methods.map((r) => (
                <Link
                  key={r.cookingMethod}
                  href={buildUrl({ method: r.cookingMethod!, page: "1" })}
                  className={`text-xs px-2 py-1 rounded ${
                    params.method === r.cookingMethod
                      ? "bg-teal text-white"
                      : "bg-white text-gray-700 hover:bg-teal hover:text-white"
                  } transition`}
                >
                  {r.cookingMethod}
                </Link>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Sort By
            </label>
            <div className="flex flex-wrap gap-1">
              {[
                { value: "", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "az", label: "A-Z" },
                { value: "za", label: "Z-A" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={buildUrl({ sort: opt.value, page: "1" })}
                  className={`text-xs px-2 py-1 rounded ${
                    (params.sort || "") === opt.value
                      ? "bg-foreground text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  } transition`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-500 text-sm mb-4">
        Showing {recipes.length} of {total} recipes
      </p>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            slug={recipe.slug}
            imageUrl={recipe.imageUrl}
            difficulty={recipe.difficulty}
            totalTime={recipe.totalTime}
            categories={recipe.categories.map((rc) => rc.category.name)}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No recipes found matching your filters.</p>
          <Link href="/browse-recipes" className="btn-orange mt-4 inline-block">
            Clear Filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildUrl({ page: String(p) })}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                p === page
                  ? "bg-orange text-white"
                  : "bg-light-gray text-gray-700 hover:bg-orange hover:text-white"
              } transition font-bold`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
