import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  "openid.ns": z.string().optional(),
  "openid.mode": z.string().optional(),
  "openid.error": z.string().optional(),
  "openid.claimed_id": z.string().optional(),
  state: z.string().optional(),
});

export async function GET(request: NextRequest) {
  console.log("Received Steam OAuth callback request");

  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    console.log("Received query parameters:", queryParams);

    // Validate and parse the query parameters
    const result = QuerySchema.safeParse(queryParams);

    if (!result.success) {
      console.error("Invalid query parameters:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.errors },
        { status: 400 }
      );
    }

    const {
      "openid.mode": mode,
      "openid.error": error,
      "openid.claimed_id": claimedId,
      state,
    } = result.data;

    // Handle error mode
    if (mode === "error") {
      console.error("Steam authentication error:", error);
      return NextResponse.json(
        { error: "Steam authentication failed", details: error },
        { status: 400 }
      );
    }

    // Handle missing state (which was the original error)
    if (!state) {
      console.warn("Missing state parameter");
    }

    // Handle successful authentication
    if (claimedId) {
      console.log("Successful authentication. Claimed ID:", claimedId);

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        steamId: claimedId,
      });
    }

    // If we reach here, it's an unexpected scenario
    console.warn("Unexpected authentication result");
    return NextResponse.json(
      { error: "Unexpected authentication result" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Unexpected error in Steam OAuth callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
