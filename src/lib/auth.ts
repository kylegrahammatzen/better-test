import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { linear } from "./plugins/linear";
import { LinearLoginCodeEmail } from "../../emails/linear-code";
import { resend } from "./resend";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [
    linear({
      sendLinearAuth: async ({ email, magicLink, otp, type }, request) => {
        const { data, error } = await resend.emails.send({
          from: "Kyle from BetterAuth <hello@kylegm.com>",
          to: email,
          subject:
            type === "sign-in"
              ? "Sign in to BetterAuth"
              : "Verify your email for BetterAuth",
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
