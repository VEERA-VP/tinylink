import { NextResponse } from "next/server";

export function GET() {
  const uptimeSeconds = process.uptime();
  const now = new Date();

  return NextResponse.json(
    {
      ok: true,
      version: "1.1.0",
      timestamp: now.toISOString(),
      uptimeSeconds,
      uptimeHuman: `${Math.floor(uptimeSeconds)}s`,
      environment: process.env.NODE_ENV ?? "development",
      nodeVersion: process.version
    },
    { status: 200 }
  );
}
