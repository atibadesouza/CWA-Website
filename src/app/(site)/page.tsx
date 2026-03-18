import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";

export default async function HomePage() {
  const featuredRecipes = await prisma.recipe.findMany({
    where: { published: true },
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      recipes: true,
    },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange/10 via-white to-teal/10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cooking <span className="text-orange">With</span> Atiba
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-body">
            Delicious recipes from sourdough breads to Caribbean classics.
            Tried and tested recipes for every occasion.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/browse-recipes" className="btn-orange text-lg">
              Browse Recipes
            </Link>
            <Link
              href="/contact"
              className="btn-teal text-lg"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">
            Recipe Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse-recipes?category=${cat.slug}`}
                className="group relative bg-light-gray rounded-lg p-6 text-center hover:bg-orange hover:text-white transition-all duration-300"
              >
                <h3 className="font-heading text-lg font-bold group-hover:text-white">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/80 mt-1">
                  {cat.recipes.length} recipe{cat.recipes.length !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">
            Latest Recipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
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
          <div className="text-center mt-10">
            <Link href="/browse-recipes" className="btn-orange text-lg">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">
            About Cooking With Atiba
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
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
