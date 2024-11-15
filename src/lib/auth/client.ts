import { createAuthClient } from "better-auth/react";
import { linearClient } from "../plugins/linear/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [linearClient()],
});

export const { signIn, useSession } = authClient;
