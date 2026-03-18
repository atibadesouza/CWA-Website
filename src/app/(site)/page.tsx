import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import HeroCarousel from "@/components/HeroCarousel";

export default async function HomePage() {
  const featuredRecipes = await prisma.recipe.findMany({
    where: { published: true },
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const carouselRecipes = featuredRecipes.slice(0, 4).map((r) => ({
    title: r.title,
    slug: r.slug,
    imageUrl: r.imageUrl,
    description: r.description,
  }));

  const latestRecipes = await prisma.recipe.findMany({
    where: { published: true },
    include: {
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { recipes: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselRecipes} />

      {/* Latest Recipes */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-2">
            Latest Recipes
          </h2>
          <div className="w-12 h-0.5 bg-orange mx-auto mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRecipes.map((recipe) => (
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

          <div className="text-center mt-10">
            <Link href="/browse-recipes" className="btn-orange">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-2">
            Browse by Category
          </h2>
          <div className="w-12 h-0.5 bg-orange mx-auto mb-10" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse-recipes?category=${cat.slug}`}
                className="bg-white border border-border py-4 px-3 text-center hover:border-orange transition group"
              >
                <h3 className="font-heading text-base font-bold group-hover:text-orange transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {cat.recipes.length} recipe{cat.recipes.length !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            About Cooking With Atiba
          </h2>
          <p className="text-text-muted leading-relaxed">
            Welcome to Cooking With Atiba! Here you&apos;ll find a collection of
            my favorite recipes, from artisan sourdough breads to authentic
            Caribbean dishes passed down through generations. Every recipe is
            tested in my kitchen and shared with love. Whether you&apos;re a
            beginner or a seasoned cook, there&apos;s something here for
            everyone.
          </p>
        </div>
      </section>
    </>
  );
}
