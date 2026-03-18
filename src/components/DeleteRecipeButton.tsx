"use client";

import { useRouter } from "next/navigation";

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    const res = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm"
    >
      Delete
    </button>
  );
}
