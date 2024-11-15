import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { schema } from "./db/schema";
import { linear } from "./plugins/linear";
import { resend } from "./resend";
import { LinearLoginCodeEmail } from "./emails/linear-code";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  plugins: [
    linear({
      sendLinearAuth: async ({ email, magicLink, otp, type }, request) => {
        const { data, error } = await resend.emails.send({
          from: "Kyle from Linear <hello@kylegm.com>",
          to: email,
          subject:
            type === "sign-in"
              ? "Sign in to Linear"
              : "Verify your email for Linear",
          react: LinearLoginCodeEmail({ validationCode: otp, magicLink, type }),
        });

        if (error) {
          console.error("Failed to send email:", error);
          throw new Error("Failed to send email");
        }

        console.log("Email sent:", data);
      },
      otpLength: 6,
      disableSignUp: false,
      expiresIn: 300,
    }),
  ],
});
