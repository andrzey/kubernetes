import { authClient } from "../auth";
import { useNavigate } from "@tanstack/react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
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

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Welcome back, {session?.user.name}!
          </h2>
          <p className="text-sm text-gray-500">
            You're successfully logged in.
          </p>
        </div>
      </main>
    </div>
  );
}
