import { OAuth2Tokens } from "better-auth/oauth2";
import { CommunityVisibilityState, PersonaState } from "./constants";

type SteamConfig = {
  clientSecret: string;
  redirectUri: string;
  allowedHosts: string[];
  forceHttps?: boolean;
};

export interface SteamProfile extends Record<string, any> {
  steamid: string;
  communityvisibilitystate: CommunityVisibilityState;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: PersonaState;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  commentpermission: boolean;
}

type SteamUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
};

export class SteamAuth {
  private static readonly OPENID_URL =
    "https://steamcommunity.com/openid/login";
  private static readonly STEAM_API_URL =
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";
  private static readonly OPENID_NS = "http://specs.openid.net/auth/2.0";

  constructor(private config: SteamConfig) {}

  public getAuthorizationUrl(): string {
    const callbackUrl = new URL(this.config.redirectUri);
    const realm = callbackUrl.origin;
    const returnTo = this.config.redirectUri;

    const params = new URLSearchParams({
      "openid.ns": SteamAuth.OPENID_NS,
      "openid.mode": "checkid_setup",
      "openid.return_to": returnTo,
      "openid.realm": realm,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    });

    return `${SteamAuth.OPENID_URL}?${params.toString()}`;
  }

  public async validateAuthorizationCode(
    params: URLSearchParams
  ): Promise<OAuth2Tokens> {
    const validationParams = new URLSearchParams(params);
    validationParams.set("openid.mode", "check_authentication");

    const response = await fetch(SteamAuth.OPENID_URL, {
      method: "POST",
      body: validationParams,
    });

    const responseText = await response.text();
    if (!responseText.includes("is_valid:true")) {
      throw new Error("Failed to validate OpenID response");
    }

    const steamId = this.extractSteamId(params.get("openid.claimed_id") || "");
    if (!steamId) {
      throw new Error("Failed to extract Steam ID");
    }

    return {
      accessToken: steamId,
      tokenType: "Bearer",
    };
  }

  public async getUserInfo(tokens: OAuth2Tokens): Promise<SteamUser | null> {
    const steamId = tokens.accessToken;
    if (!steamId) {
      return null;
    }

    const response = await fetch(
      `${SteamAuth.STEAM_API_URL}?key=${this.config.clientSecret}&steamids=${steamId}`
    );
    const data = await response.json();
    const playerInfo: SteamProfile = data.response.players[0];

    if (!playerInfo) {
      return null;
    }

    const now = new Date();
    return {
      id: playerInfo.steamid,
      name: playerInfo.personaname,
      email: `${playerInfo.steamid}@steamcommunity.com`, // Steam doesn't provide email, so we create a placeholder
      emailVerified: false, // Steam doesn't verify emails
      image: playerInfo.avatarfull,
      createdAt: new Date(playerInfo.timecreated * 1000), // Convert Unix timestamp to Date
      updatedAt: now,
    };
  }

  private extractSteamId(claimedId: string): string | null {
    const matches = claimedId.match(
      /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/
    );
    return matches ? matches[1] : null;
  }
}

export const createSteamAuth = (config: SteamConfig) => {
  const steamAuth = new SteamAuth(config);

  return {
    id: "steam",
    name: "Steam",
    createAuthorizationURL: () => steamAuth.getAuthorizationUrl(),
    validateAuthorizationCode: async ({ code }: { code: string }) => {
      const params = new URLSearchParams(code);
      return steamAuth.validateAuthorizationCode(params);
    },
    getUserInfo: steamAuth.getUserInfo.bind(steamAuth),
  };
};
