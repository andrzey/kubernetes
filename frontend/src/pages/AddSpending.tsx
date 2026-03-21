import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";
import { TextField } from "../components/TextField";
import { Select } from "../components/Select";
import { Button } from "../components/Button";

const useAddSpending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Form) => {
      const category = data.useCustomCategory
        ? data.customCategory
        : data.category;

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
};

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
  useCustomCategory: boolean;
};

export default function AddSpending() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      category: STANDARD_CATEGORIES[0],
      useCustomCategory: false,
    },
  });

  const { mutate, isPending } = useAddSpending();

  const onSubmit = (data: Form) =>
    mutate(data, {
      onSuccess: () => reset(),
    });

  const useCustomCategory = watch("useCustomCategory");

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
              label="Category"
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
            onClick={() => setValue("useCustomCategory", !useCustomCategory)}
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add spending"}
      </Button>
    </form>
  );
}
