import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const cognito_url =
      "https://ap-southeast-14waonkuxt.auth.ap-southeast-1.amazoncognito.com/oauth2/token";
    const client_id = "54t6a4ee2v2m4mt7cl08il17dg";
    const grant_type = "authorization_code";
    const redirect_uri = "http://localhost:3000/api/auth/microsoft/callback";
    const code = req.nextUrl.searchParams.get("code");

    const link = `${cognito_url}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`;

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const token = await response.json();

    console.log({ token });

    return Response.json({
      data: token,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      message: error,
    });
  }
};
