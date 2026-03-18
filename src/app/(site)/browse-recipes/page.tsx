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
      some: { category: { slug: params.category } },
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
    case "oldest": orderBy.createdAt = "asc"; break;
    case "az": orderBy.title = "asc"; break;
    case "za": orderBy.title = "desc"; break;
    default: orderBy.createdAt = "desc";
  }

  const [recipes, total, categories, cuisines, methods] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { categories: { include: { category: true } } },
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Browse Recipes</h1>
      <div className="w-12 h-0.5 bg-orange mb-8" />

      {/* Filters */}
      <div className="border border-border p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
            <div className="flex flex-wrap gap-1">
              <Link href={buildUrl({ category: "", page: "1" })} className={`text-xs px-2 py-1 border ${!params.category ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>All</Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={buildUrl({ category: cat.slug, page: "1" })} className={`text-xs px-2 py-1 border ${params.category === cat.slug ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>{cat.name}</Link>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Cuisine</label>
            <div className="flex flex-wrap gap-1">
              <Link href={buildUrl({ cuisine: "", page: "1" })} className={`text-xs px-2 py-1 border ${!params.cuisine ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>All</Link>
              {cuisines.map((r) => (
                <Link key={r.cuisine} href={buildUrl({ cuisine: r.cuisine!, page: "1" })} className={`text-xs px-2 py-1 border ${params.cuisine === r.cuisine ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>{r.cuisine}</Link>
              ))}
            </div>
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Method</label>
            <div className="flex flex-wrap gap-1">
              <Link href={buildUrl({ method: "", page: "1" })} className={`text-xs px-2 py-1 border ${!params.method ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>All</Link>
              {methods.map((r) => (
                <Link key={r.cookingMethod} href={buildUrl({ method: r.cookingMethod!, page: "1" })} className={`text-xs px-2 py-1 border ${params.method === r.cookingMethod ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition`}>{r.cookingMethod}</Link>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Sort</label>
            <div className="flex flex-wrap gap-1">
              {[{ value: "", label: "Newest" }, { value: "oldest", label: "Oldest" }, { value: "az", label: "A-Z" }, { value: "za", label: "Z-A" }].map((opt) => (
                <Link key={opt.value} href={buildUrl({ sort: opt.value, page: "1" })} className={`text-xs px-2 py-1 border ${(params.sort || "") === opt.value ? "bg-foreground text-white border-foreground" : "border-border text-text-muted hover:border-foreground"} transition`}>{opt.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-text-muted text-sm mb-6">Showing {recipes.length} of {total} recipes</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            slug={recipe.slug}
            imageUrl={recipe.imageUrl}
            difficulty={recipe.difficulty}
            totalTime={recipe.totalTime}
            servings={recipe.servings}
            categories={recipe.categories.map((rc) => rc.category.name)}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg">No recipes found.</p>
          <Link href="/browse-recipes" className="btn-orange mt-4 inline-block">Clear Filters</Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildUrl({ page: String(p) })} className={`w-10 h-10 flex items-center justify-center border ${p === page ? "bg-orange text-white border-orange" : "border-border text-text-muted hover:border-orange hover:text-orange"} transition font-bold text-sm`}>{p}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
