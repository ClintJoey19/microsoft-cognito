"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const cognito_url =
  "https://ap-southeast-14waonkuxt.auth.ap-southeast-1.amazoncognito.com/login";
const response_type = "code";
const client_id = "54t6a4ee2v2m4mt7cl08il17dg";
const redirect_uri = "http://localhost:3000/api/auth/microsoft/callback";
const identity_provider = "EntraId";

const SIGNIN_LINK = `${cognito_url}?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&identity_provider=${identity_provider}`;

export default function Home() {
  return (
    <div>
      <Button>
        <Link href={SIGNIN_LINK}>SSO Login</Link>
      </Button>
    </div>
  );
}
