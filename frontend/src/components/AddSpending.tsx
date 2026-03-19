import { useForm } from "react-hook-form";
import { useState } from "react";

const STANDARD_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Shopping",
  "Travel",
  "Other",
];

type Form = {
  amount: number;
  category: string;
  customCategory: string;
  description: string;
};

type Props = {
  onAdded: () => void;
};

export default function AddSpending({ onAdded }: Props) {
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ defaultValues: { category: STANDARD_CATEGORIES[0] } });

  const onSubmit = async (data: Form) => {
    const category = useCustomCategory ? data.customCategory : data.category;

    const res = await fetch("http://localhost:3001/spending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        amount: Number(data.amount),
        category,
        description: data.description || undefined,
      }),
    });

    if (!res.ok) {
      alert("Failed to add spending");
      return;
    }

    reset();
    setUseCustomCategory(false);
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (kr)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Must be greater than 0" },
            })}
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {useCustomCategory ? (
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter custom category"
              {...register("customCategory", {
                required: "Category is required",
              })}
            />
          ) : (
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              {...register("category")}
            >
              {STANDARD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            className="mt-1 text-xs text-indigo-600 hover:underline"
            onClick={() => setUseCustomCategory((v) => !v)}
          >
            {useCustomCategory
              ? "← Use standard category"
              : "Use custom category"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          {...register("description")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {isSubmitting ? "Adding..." : "Add spending"}
      </button>
    </form>
  );
}
