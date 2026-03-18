"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RecipeFormProps {
  categories: Category[];
  initialData?: {
    id?: string;
    title: string;
    description: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    difficulty: string;
    cuisine: string;
    cookingMethod: string;
    imageUrl: string;
    ingredients: string[];
    instructions: string[];
    nutrition: Record<string, string>;
    categoryIds: string[];
    published: boolean;
  };
}

const defaultData = {
  title: "",
  description: "",
  prepTime: "",
  cookTime: "",
  totalTime: "",
  servings: "",
  difficulty: "Easy",
  cuisine: "",
  cookingMethod: "",
  imageUrl: "",
  ingredients: [""],
  instructions: [""],
  nutrition: {} as Record<string, string>,
  categoryIds: [] as string[],
  published: true,
};

export default function RecipeForm({
  categories,
  initialData,
}: RecipeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addIngredient() {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  }

  function removeIngredient(index: number) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }

  function updateIngredient(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  }

  function addInstruction() {
    setForm((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  }

  function removeInstruction(index: number) {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  }

  function updateInstruction(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? value : inst
      ),
    }));
  }

  function toggleCategory(catId: string) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      ingredients: form.ingredients.filter((i) => i.trim()),
      instructions: form.instructions.filter((i) => i.trim()),
    };

    try {
      const url = initialData?.id
        ? `/api/recipes/${initialData.id}`
        : "/api/recipes";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/recipes");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save recipe");
      }
    } catch {
      setError("Failed to save recipe");
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="font-heading text-xl font-bold">Basic Information</h2>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:border-orange focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:border-orange focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:border-orange focus:outline-none"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Prep Time
            </label>
            <input
              type="text"
              value={form.prepTime}
              onChange={(e) => updateField("prepTime", e.target.value)}
              placeholder="30 minutes"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cook Time
            </label>
            <input
              type="text"
              value={form.cookTime}
              onChange={(e) => updateField("cookTime", e.target.value)}
              placeholder="1 hour"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Total Time
            </label>
            <input
              type="text"
              value={form.totalTime}
              onChange={(e) => updateField("totalTime", e.target.value)}
              placeholder="1 hour 30 min"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Servings
            </label>
            <input
              type="text"
              value={form.servings}
              onChange={(e) => updateField("servings", e.target.value)}
              placeholder="4"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cuisine
            </label>
            <input
              type="text"
              value={form.cuisine}
              onChange={(e) => updateField("cuisine", e.target.value)}
              placeholder="American, Caribbean..."
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cooking Method
            </label>
            <input
              type="text"
              value={form.cookingMethod}
              onChange={(e) => updateField("cookingMethod", e.target.value)}
              placeholder="Baking, Grilling..."
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1 rounded text-sm font-bold transition ${
                form.categoryIds.includes(cat.id)
                  ? "bg-orange text-white"
                  : "bg-light-gray text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold mb-4">Ingredients</h2>
        <div className="space-y-2">
          {form.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={ing}
                onChange={(e) => updateIngredient(i, e.target.value)}
                placeholder={`Ingredient ${i + 1}`}
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 text-teal font-bold text-sm hover:underline"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold mb-4">Instructions</h2>
        <div className="space-y-2">
          {form.instructions.map((inst, i) => (
            <div key={i} className="flex gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm mt-1">
                {i + 1}
              </span>
              <textarea
                value={inst}
                onChange={(e) => updateInstruction(i, e.target.value)}
                placeholder={`Step ${i + 1}`}
                rows={2}
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:border-orange focus:outline-none text-sm resize-none"
              />
              <button
                type="button"
                onClick={() => removeInstruction(i)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-3 text-teal font-bold text-sm hover:underline"
        >
          + Add Step
        </button>
      </div>

      {/* Publish Toggle */}
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField("published", e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="font-bold text-sm">Published</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="btn-orange disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : initialData?.id
            ? "Update Recipe"
            : "Create Recipe"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
