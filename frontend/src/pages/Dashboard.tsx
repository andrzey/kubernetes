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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user.name}!</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
