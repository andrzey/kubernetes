import { useForm } from "react-hook-form";
import { authClient } from "../auth";

type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const { handleSubmit } = useForm<Form>();

  const onSubmit = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email: "test@test.com",
        password: "detteermittpassord",
        name: "Andrzej",
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          console.log("Loading auth");
        },
        onSuccess: () => {
          console.log("OnSuccess auth");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );

    console.log({ data, error });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <p>This is the sign-up page.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <button>Sign Up</button>
      </form>
    </div>
  );
}
