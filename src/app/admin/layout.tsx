import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-6 hidden md:block">
          <h2 className="font-heading text-xl font-bold mb-6 text-foreground">
            Dashboard
          </h2>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-3 py-2 rounded text-sm font-bold text-gray-700 hover:bg-orange hover:text-white transition"
            >
              Overview
            </Link>
            <Link
              href="/admin/recipes"
              className="block px-3 py-2 rounded text-sm font-bold text-gray-700 hover:bg-orange hover:text-white transition"
            >
              Manage Recipes
            </Link>
            <Link
              href="/admin/recipes/new"
              className="block px-3 py-2 rounded text-sm font-bold text-gray-700 hover:bg-teal hover:text-white transition"
            >
              + New Recipe
            </Link>
            <Link
              href="/admin/messages"
              className="block px-3 py-2 rounded text-sm font-bold text-gray-700 hover:bg-orange hover:text-white transition"
            >
              Messages
            </Link>
            <hr className="my-4" />
            <Link
              href="/"
              className="block px-3 py-2 rounded text-sm text-gray-500 hover:text-orange transition"
            >
              &larr; Back to Site
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
