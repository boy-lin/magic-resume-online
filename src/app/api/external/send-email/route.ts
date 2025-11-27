import crypto from "node:crypto";
import { NextResponse } from "next/server";

const host = process.env.EMAIL_BASE_API;
const path = "/api/external/emails/send";
const apiKey = process.env.EMAIL_API_KEY;
const secret = process.env.EMAIL_API_SECRET;

function hmacHex(input: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

export async function POST(request: Request) {
  const { to, subject, text } = await request.json();

  if (!to || !subject || !text) {
    return NextResponse.json(
      { error: "Invalid email payload" },
      { status: 400 }
    );
  }

  const body = JSON.stringify({ to, subject, text });
  const ts = Math.floor(Date.now() / 1000).toString();
  const canonical = ["POST", path, ts, body].join("\n");
  const signature = hmacHex(canonical, secret);

  const res = await fetch(host + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "x-timestamp": ts,
      "x-signature": signature,
    },
    body,
  });

  const textRes = await res.text();

  return NextResponse.json(
    {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body: textRes,
    },
    { status: res.ok ? 200 : 500 }
  );
}
