import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_URL,
  NODE_ENV,
} from "@/lib/environments/env.local";

const tokenUrl = `${COGNITO_URL}/oauth2/token`;

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return Response.json(
        {
          error: "Missing refresh token",
        },
        { status: 401, statusText: "Bad request" }
      );
    }

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: COGNITO_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const authorization = Buffer.from(
      `${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authorization}`,
      },
      body: body.toString(),
    });

    const tokens = await response.json();

    if (!response.ok) return Response.json(tokens, { status: response.status });

    res = NextResponse.json({ success: true });

    res.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in,
      path: "/",
    });

    if (tokens.id_token) {
      res.cookies.set("id_token", tokens.id_token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
        path: "/",
      });
    }

    return res;
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
