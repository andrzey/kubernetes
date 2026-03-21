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
import VerifyEmail from "./pages/VerifyEmail";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout route for unauthenticated pages (login, signup, verify-email)
// Redirects to /dashboard if user is already logged in
const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authLayout",
  beforeLoad: async (ctx) => {
    const session = await authClient.getSession();

    if (ctx.location.pathname.includes("/verify-email") && !session.data) {
      throw redirect({ to: "/login" });
    }

    if (session.data?.user.emailVerified == true) {
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

    if (!session.data.user.emailVerified) {
      throw redirect({ to: "/verify-email" });
    }
  },
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
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

const verifyEmailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/verify-email",
  component: VerifyEmail,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([signUpRoute, loginRoute, verifyEmailRoute]),
  protectedLayout.addChildren([indexRoute, dashboardRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
