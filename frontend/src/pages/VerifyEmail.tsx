import { Link } from "@tanstack/react-router";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify your email
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          We have sent a verification link to your email address.
          <br />
          Please check your inbox and click the link to activate your account.
        </p>
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Didn't receive the email?</p>
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            // onClick={handleResend} // Implement resend logic if needed
            disabled
          >
            Resend verification email
          </button>
        </div>
        <div className="mt-6">
          <Link to="/login" className="text-indigo-600 hover:underline text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
