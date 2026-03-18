import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import GallerySlider from "@/components/GallerySlider";

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
  const gallery: string[] = recipe.gallery
    ? JSON.parse(recipe.gallery)
    : [];
  const instructionImages: Record<string, string> = recipe.instructionImages
    ? JSON.parse(recipe.instructionImages)
    : {};

  // Combine cover + gallery for slider
  const allImages = [
    ...(recipe.imageUrl ? [recipe.imageUrl] : []),
    ...gallery,
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-orange">Home</Link>
        {" / "}
        <Link href="/browse-recipes" className="hover:text-orange">Recipes</Link>
        {" / "}
        <span className="text-foreground">{recipe.title}</span>
      </nav>

      {/* Title & Meta */}
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {recipe.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
          {recipe.categories.length > 0 && (
            <span>
              {recipe.categories.map((rc, i) => (
                <span key={rc.categoryId}>
                  {i > 0 && ", "}
                  <Link href={`/browse-recipes?category=${rc.category.slug}`} className="text-orange hover:underline">
                    {rc.category.name}
                  </Link>
                </span>
              ))}
            </span>
          )}
          {recipe.cuisine && <span>Cuisine: <strong>{recipe.cuisine}</strong></span>}
          {recipe.cookingMethod && <span>Method: <strong>{recipe.cookingMethod}</strong></span>}
          {recipe.difficulty && (
            <span className="bg-orange text-white text-xs font-bold px-2 py-0.5 rounded">
              {recipe.difficulty}
            </span>
          )}
        </div>
      </header>

      {/* Photo Gallery Slider */}
      {allImages.length > 0 && (
        <GallerySlider images={allImages} title={recipe.title} />
      )}

      {/* Description */}
      {recipe.description && (
        <p className="text-text-muted leading-relaxed mb-8 text-lg italic">
          {recipe.description}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mb-8 no-print">
        <PrintButton />
        <a href="#ingredients" className="btn-teal text-sm">Jump to Recipe</a>
      </div>

      {/* Time & Servings Bar */}
      <div className="recipe-meta-bar mb-10">
        {recipe.prepTime && (
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Prep Time</p>
            <p className="text-base font-bold text-foreground mt-1">{recipe.prepTime}</p>
          </div>
        )}
        {recipe.cookTime && (
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Cook Time</p>
            <p className="text-base font-bold text-foreground mt-1">{recipe.cookTime}</p>
          </div>
        )}
        {recipe.totalTime && (
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Total Time</p>
            <p className="text-base font-bold text-foreground mt-1">{recipe.totalTime}</p>
          </div>
        )}
        {recipe.servings && (
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Servings</p>
            <p className="text-base font-bold text-foreground mt-1">{recipe.servings}</p>
          </div>
        )}
      </div>

      {/* Two-column layout for ingredients + instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Ingredients */}
        <div id="ingredients" className="lg:col-span-1">
          <div className="bg-light-gray p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-4 pb-3 border-b-2 border-orange">
              Ingredients
            </h2>
            <div>
              {ingredients.map((ing, i) => (
                <div key={i} className="ingredient-item">
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <h2 className="font-heading text-xl font-bold mb-4 pb-3 border-b-2 border-orange">
            Instructions
          </h2>
          <div>
            {instructions.map((step, i) => (
              <div key={i}>
                <div className="instruction-step">
                  <div className="step-number">{i + 1}</div>
                  <p className="text-foreground leading-relaxed pt-1 flex-1">{step}</p>
                </div>
                {/* Inline image after this step */}
                {instructionImages[String(i)] && (
                  <div className="ml-12 mb-4">
                    <img
                      src={instructionImages[String(i)]}
                      alt={`Step ${i + 1}`}
                      className="w-full max-w-md h-auto rounded shadow-sm"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nutrition */}
      {nutrition && Object.keys(nutrition).length > 0 && (
        <div className="mt-10 border border-border p-6">
          <h2 className="font-heading text-xl font-bold mb-4 pb-3 border-b border-border">
            Nutrition Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(nutrition).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-text-muted uppercase font-bold">{key}</p>
                <p className="text-base font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
