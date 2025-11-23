import { NextResponse } from "next/server";
import { connectToDatabase, Link } from "@/lib/db";
import { generateCode, normalizeUrl, isValidCode } from "@/lib/url";

function toDto(doc: any) {
  return {
    id: doc._id.toString(),
    code: doc.code,
    url: doc.targetUrl,
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : doc.createdAt,
    lastClickedAt: doc.lastClickedAt
      ? doc.lastClickedAt instanceof Date
        ? doc.lastClickedAt.toISOString()
        : doc.lastClickedAt
      : null,
    clicks: doc.clicks
  };
}

export async function GET() {
  await connectToDatabase();

  const docs = await Link.find().sort({ createdAt: -1 }).lean().exec();
  return NextResponse.json({
    links: docs.map(toDto)
  });
}

export async function POST(request: Request) {
  await connectToDatabase();

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const rawUrl =
    typeof body?.url === "string"
      ? body.url
      : typeof body?.targetUrl === "string"
        ? body.targetUrl
        : null;
  const rawCode = typeof body?.code === "string" ? body.code : undefined;

  if (!rawUrl) {
    return NextResponse.json(
      { error: "Field 'url' is required." },
      { status: 400 }
    );
  }

  let normalizedUrl: string;
  try {
    normalizedUrl = normalizeUrl(rawUrl);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "URL is invalid." },
      { status: 400 }
    );
  }

  let code = (rawCode ?? "").trim();

  if (code.length > 0) {
    if (!isValidCode(code)) {
      return NextResponse.json(
        {
          error:
            "Code must match pattern [A-Za-z0-9]{6,8} (letters and digits only, length 6–8)."
        },
        { status: 400 }
      );
    }

    const existing = await Link.findOne({ code }).lean().exec();
    if (existing) {
      return NextResponse.json(
        { error: "This code is already in use." },
        { status: 409 }
      );
    }
  } else {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = generateCode();
      const existing = await Link.findOne({ code: candidate }).lean().exec();
      if (!existing) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      return NextResponse.json(
        { error: "Failed to generate a unique code." },
        { status: 500 }
      );
    }
  }

  const created = await Link.create({
    code,
    targetUrl: normalizedUrl
  });

  return NextResponse.json(
    {
      link: toDto(created)
    },
    { status: 201 }
  );
}
