import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { authClient } from "./auth";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout route for unauthenticated pages (login, signup)
// Redirects to /dashboard if user is already logged in
const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authLayout",
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});

// Layout route for protected pages
// Redirects to /login if user is NOT logged in
const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "_protectedLayout",
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data?.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    const session = await authClient.getSession();
    throw redirect({ to: session.data?.user ? "/dashboard" : "/login" });
  },
});

const signUpRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/signup",
  component: SignUp,
});

const loginRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/login",
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayout.addChildren([signUpRoute, loginRoute]),
  protectedLayout.addChildren([dashboardRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
