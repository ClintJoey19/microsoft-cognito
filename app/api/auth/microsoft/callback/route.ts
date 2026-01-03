import {
  APP_DOMAIN,
  COGNITO_CLIENT_ID,
  COGNITO_URL,
} from "@/lib/environments/env.local";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const cognito_url = `${COGNITO_URL}/oauth2/token`;
    const client_id = COGNITO_CLIENT_ID;
    const grant_type = "authorization_code";
    const redirect_uri = `${APP_DOMAIN}/api/auth/microsoft/callback`;
    const code = req.nextUrl.searchParams.get("code");

    const link = `${cognito_url}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`;

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokens = await response.json();

    // set cookies here
    res.cookies.set("id_token", tokens.id_token);
    res.cookies.set("access_token", tokens.access_token);
    res.cookies.set("refresh_token", tokens.refresh_token);

    res = NextResponse.json({ success: true }, { status: 200 });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
