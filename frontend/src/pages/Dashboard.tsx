import { authClient } from "../auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AddSpending from "../components/AddSpending";

type Spending = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [spendings, setSpendings] = useState<Spending[]>([]);

  const fetchSpendings = async () => {
    const res = await fetch("http://localhost:3001/spending", {
      credentials: "include",
    });
    if (res.ok) {
      setSpendings(await res.json());
    }
  };

  useEffect(() => {
    fetchSpendings();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3001/spending/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setSpendings((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  const total = spendings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          Spending tracker
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session?.user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors hover:border-gray-400"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Add spending */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Add spending
          </h2>
          <AddSpending onAdded={fetchSpendings} />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total spent</span>
          <span className="text-2xl font-semibold text-gray-900">
            {(total / 100).toFixed(2)} kr
          </span>
        </div>

        {/* Spending list */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {spendings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No spendings yet. Add one above!
            </p>
          ) : (
            spendings.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.category}
                  </p>
                  {s.description && (
                    <p className="text-xs text-gray-400">{s.description}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {(s.amount / 100).toFixed(2)} kr
                  </span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
