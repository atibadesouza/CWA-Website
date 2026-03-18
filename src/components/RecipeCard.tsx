import Link from "next/link";

interface RecipeCardProps {
  title: string;
  slug: string;
  imageUrl?: string | null;
  difficulty?: string | null;
  totalTime?: string | null;
  categories?: string[];
}

export default function RecipeCard({
  title,
  slug,
  imageUrl,
  difficulty,
  totalTime,
  categories = [],
}: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 bg-light-gray overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange/20 to-teal/20">
            <svg
              className="w-16 h-16 text-orange/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        {difficulty && (
          <span className="absolute top-3 right-3 bg-orange text-white text-xs font-bold px-2 py-1 rounded">
            {difficulty}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-orange transition line-clamp-2">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
          {totalTime && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {totalTime}
            </span>
          )}
        </div>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-xs bg-light-gray text-gray-600 px-2 py-0.5 rounded"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
