import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { createSteamAuth } from "./plugins/steam-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { schema } from "./db/schema";

const steamConfig = {
  clientSecret: process.env.STEAM_API_KEY!,
  redirectUri: `${process.env.BETTER_AUTH_URL}/api/auth/oauth2/callback/steam`,
  allowedHosts: ["steamcommunity.com"],
  forceHttps: true,
};

export const steamProvider = createSteamAuth(steamConfig);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: steamProvider.id,
          clientId: "steam",
          clientSecret: process.env.STEAM_API_KEY!,
          type: "oauth2",
          authorizationUrl: steamProvider.createAuthorizationURL(),
          tokenUrl: "https://steamcommunity.com/openid/login",
          userInfoUrl:
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
          redirectURI: steamConfig.redirectUri,
          scopes: [],
          pkce: false,
          getUserInfo: steamProvider.getUserInfo,
        },
      ],
    }),
  ],
});
