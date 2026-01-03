import { NextRequest, NextResponse } from "next/server";

export const POST = (req: NextRequest, res: NextResponse) => {
  try {
    res = NextResponse.json({ success: true });

    res.cookies.delete("id_token");
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unable to logout" },
      { status: 500, statusText: "Internal server error" }
    );
  }
};
