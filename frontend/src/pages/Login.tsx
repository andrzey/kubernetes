import { useForm } from "react-hook-form";
import { authClient } from "../auth";
import { useNavigate } from "@tanstack/react-router";

type Form = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate({ to: "/dashboard" });
  };

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
