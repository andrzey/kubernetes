import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";
import { TextField } from "../components/TextField";
import { Select } from "../components/Select";
import { Button } from "../components/Button";

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

export default function AddSpending() {
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ defaultValues: { category: STANDARD_CATEGORIES[0] } });

  const mutation = useMutation({
    mutationFn: async (data: Form) => {
      const category = useCustomCategory ? data.customCategory : data.category;
      return apiFetch("/spending", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(data.amount),
          category,
          description: data.description || undefined,
        }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spendings"] }),
  });

  const onSubmit = (data: Form) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setUseCustomCategory(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Amount (kr)"
          type="number"
          step="0.01"
          min="0.01"
          error={errors.amount?.message}
          disabled={isSubmitting}
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Must be greater than 0" },
          })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {useCustomCategory ? (
            <TextField
              label="Custom category"
              placeholder="Enter custom category"
              error={errors.customCategory?.message}
              disabled={isSubmitting}
              {...register("customCategory", {
                required: "Category is required",
              })}
            />
          ) : (
            <Select
              disabled={isSubmitting}
              {...register("category")}
              className="bg-white"
            >
              {STANDARD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          )}
          <button
            type="button"
            className="mt-1 text-xs text-indigo-600 hover:underline"
            onClick={() => setUseCustomCategory((v) => !v)}
            disabled={isSubmitting}
          >
            {useCustomCategory
              ? "← Use standard category"
              : "Use custom category"}
          </button>
        </div>
      </div>

      <TextField
        label={
          <>
            Description <span className="text-gray-400">(optional)</span>
          </>
        }
        error={errors.description?.message}
        disabled={isSubmitting}
        {...register("description")}
      />

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {mutation.isPending ? "Adding..." : "Add spending"}
      </Button>
    </form>
  );
}
