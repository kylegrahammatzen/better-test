import type { BetterAuthClientPlugin } from "better-auth/client";
import type { linear } from ".";

export const linearClient = (): BetterAuthClientPlugin => {
  return {
    id: "linear",
    getActions: ($fetch) => ({
      signIn: async (
        data: {
          email: string;
          type: "sign-in" | "email-verification";
          callbackURL?: string;
        },
        options = {}
      ) => {
        return await $fetch("/sign-in/linear", {
          method: "POST",
          body: data,
          ...options,
        });
      },
      verifyMagicLink: async (
        data: {
          token: string;
          callbackURL?: string;
        },
        options = {}
      ) => {
        return await $fetch(
          `/linear/verify-magic-link?token=${data.token}&callbackURL=${
            data.callbackURL || ""
          }`,
          {
            method: "GET",
            ...options,
          }
        );
      },
      verifyOTP: async (
        data: {
          email: string;
          otp: string;
          type: "sign-in" | "email-verification";
        },
        options = {}
      ) => {
        return await $fetch("/linear/verify-otp", {
          method: "POST",
          body: data,
          ...options,
        });
      },
    }),
    $InferServerPlugin: {} as ReturnType<typeof linear>,
  };
};
