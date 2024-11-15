import { z } from "zod";
import { createAuthEndpoint } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { APIError } from "better-call";
import { setSessionCookie } from "better-auth/cookies";
import { alphabet, generateRandomString } from "better-auth/crypto";
import type { Session, User } from "better-auth/types";

interface LinearOptions {
  expiresIn?: number;
  otpLength?: number;
  sendLinearAuth: (data: {
    email: string;
    magicLink: string;
    otp: string;
    type: "sign-in" | "email-verification";
  }, request?: Request) => Promise<void> | void;
  disableSignUp?: boolean;
  rateLimit?: {
    window: number;
    max: number;
  };
}

export const linear = (options: LinearOptions): BetterAuthPlugin => {
  const opts = {
    expiresIn: 300,
    otpLength: 6,
    ...options,
  };

  return {
    id: "linear",
    endpoints: {
      signInLinear: createAuthEndpoint(
        "/sign-in/linear",
        {
          method: "POST",
          requireHeaders: true,
          body: z.object({
            email: z.string().email(),
            type: z.enum(["sign-in", "email-verification"]),
            callbackURL: z.string().optional(),
          }),
        },
        async (ctx) => {
          const { email, type, callbackURL } = ctx.body;

          if (opts.disableSignUp) {
            const user = await ctx.context.internalAdapter.findUserByEmail(email);
            if (!user) {
              throw new APIError("BAD_REQUEST", { message: "User not found" });
            }
          }

          const token = generateRandomString(32, alphabet("a-z", "A-Z"));
          const otp = generateRandomString(opts.otpLength, alphabet("0-9"));

          await ctx.context.internalAdapter.createVerificationValue({
            identifier: `magic-link-${token}`,
            value: JSON.stringify({ email, type }),
            expiresAt: new Date(Date.now() + opts.expiresIn * 1000),
          });

          await ctx.context.internalAdapter.createVerificationValue({
            identifier: `otp-${email}`,
            value: otp,
            expiresAt: new Date(Date.now() + opts.expiresIn * 1000),
          });

          const magicLink = `${ctx.context.baseURL}/linear/verify-magic-link?token=${token}&callbackURL=${callbackURL || "/"}`;

          try {
            await opts.sendLinearAuth(
              { email, magicLink, otp, type },
              ctx.request
            );
          } catch (e) {
            ctx.context.logger.error("Failed to send linear auth", e);
            throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to send linear auth" });
          }

          return ctx.json({ status: true });
        }
      ),
      verifyMagicLink: createAuthEndpoint(
        "/linear/verify-magic-link",
        {
          method: "GET",
          query: z.object({
            token: z.string(),
            callbackURL: z.string().optional(),
          }),
          requireHeaders: true,
        },
        async (ctx) => {
          const { token, callbackURL } = ctx.query;
          const tokenValue = await ctx.context.internalAdapter.findVerificationValue(`magic-link-${token}`);

          if (!tokenValue || tokenValue.expiresAt < new Date()) {
            throw new APIError("BAD_REQUEST", { message: "Invalid or expired token" });
          }

          const { email, type } = JSON.parse(tokenValue.value);

          await ctx.context.internalAdapter.deleteVerificationValue(tokenValue.id);

          const user = await handleUserCreationOrUpdate(ctx, email, type as "sign-in" | "email-verification");
          const session = await ctx.context.internalAdapter.createSession(user.id, ctx.headers);
          await setSessionCookie(ctx, { session, user });

          if (callbackURL) {
            throw ctx.redirect(callbackURL);
          }

          return ctx.json({ status: true, user, session });
        }
      ),
      verifyOTP: createAuthEndpoint(
        "/linear/verify-otp",
        {
          method: "POST",
          body: z.object({
            email: z.string().email(),
            otp: z.string(),
            type: z.enum(["sign-in", "email-verification"]),
          }),
          requireHeaders: true,
        },
        async (ctx) => {
          const { email, otp, type } = ctx.body;
          const otpValue = await ctx.context.internalAdapter.findVerificationValue(`otp-${email}`);

          if (!otpValue || otpValue.expiresAt < new Date() || otpValue.value !== otp) {
            throw new APIError("BAD_REQUEST", { message: "Invalid or expired OTP" });
          }

          await ctx.context.internalAdapter.deleteVerificationValue(otpValue.id);

          const user = await handleUserCreationOrUpdate(ctx, email, type);
          const session = await ctx.context.internalAdapter.createSession(user.id, ctx.headers);
          await setSessionCookie(ctx, { session, user });

          return ctx.json({ status: true, user, session });
        }
      ),
    },
    rateLimit: [
      {
        pathMatcher(path) {
          return path.startsWith("/sign-in/linear") || path.startsWith("/linear/verify");
        },
        window: opts.rateLimit?.window || 60,
        max: opts.rateLimit?.max || 5,
      },
    ],
  };
};

async function handleUserCreationOrUpdate(ctx: any, email: string, type: "sign-in" | "email-verification"): Promise<User> {
  let user = await ctx.context.internalAdapter.findUserByEmail(email);
  if (!user) {
    if (ctx.options.disableSignUp) {
      throw new APIError("BAD_REQUEST", { message: "User not found" });
    }
    user = await ctx.context.internalAdapter.createUser({
      email,
      emailVerified: type === "email-verification",
      name: email,
    });
  } else if (type === "email-verification") {
    user = await ctx.context.internalAdapter.updateUser(user.id, {
      emailVerified: true,
    });
  }
  return user;
}