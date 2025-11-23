import { notFound, redirect } from "next/navigation";
import { connectToDatabase, Link } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    code: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = params;

  await connectToDatabase();

  const doc = await Link.findOne({ code }).exec();

  if (!doc) {
    notFound();
  }

  try {
    doc.clicks += 1;
    doc.lastClickedAt = new Date();
    await doc.save();
  } catch (error) {
    console.error("Failed to update click stats for code:", code, error);
  }

  redirect(doc.targetUrl);
}
