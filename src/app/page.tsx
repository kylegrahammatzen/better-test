import { LoginButton } from "./components/LoginButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Better-Auth Demo</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Demonstrates better-auth using generic OAuth to add Steam OAuth support.
      </p>
      <LoginButton variant="steam" />
    </div>
  );
}
