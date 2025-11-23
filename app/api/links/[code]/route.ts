import { NextResponse } from "next/server";
import { connectToDatabase, Link } from "@/lib/db";

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

interface RouteContext {
  params: {
    code: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  await connectToDatabase();
  const { code } = context.params;

  const doc = await Link.findOne({ code }).lean().exec();

  if (!doc) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ link: toDto(doc) }, { status: 200 });
}

export async function DELETE(_request: Request, context: RouteContext) {
  await connectToDatabase();
  const { code } = context.params;

  const result = await Link.deleteOne({ code }).exec();

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
