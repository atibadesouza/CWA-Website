import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#28292b] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl mb-4">Cooking With Atiba</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delicious recipes from sourdough breads to Caribbean classics.
              Tried and tested recipes for every occasion.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Contact:{" "}
              <a
                href="mailto:cooking@atibadesouza.com"
                className="text-orange hover:underline"
              >
                cooking@atibadesouza.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse-recipes"
                  className="text-gray-400 hover:text-orange transition"
                >
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-orange transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xl mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-3">
              Stay up to date with our latest recipes.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-700 text-white px-3 py-2 rounded text-sm flex-1"
              />
              <button className="btn-orange text-sm">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AtibadeSouza.com. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
