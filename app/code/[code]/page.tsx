import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase, Link as LinkModel } from "@/lib/db";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    code: string;
  };
}

export default async function CodeStatsPage({ params }: PageProps) {
  const { code } = params;

  await connectToDatabase();

  const doc = await LinkModel.findOne({ code }).lean().exec();

  if (!doc) {
    notFound();
  }

  const createdAt =
    doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : (doc.createdAt as string);
  const lastClickedAt =
    doc.lastClickedAt instanceof Date
      ? doc.lastClickedAt.toISOString()
      : (doc.lastClickedAt as string | null | undefined) || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Stats for <span className="font-mono text-sky-400">/{doc.code}</span>
          </h1>
          <p className="text-sm text-slate-300">
            Overview of usage for this TinyLink.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${doc.code}`}>Open short URL</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Short code</span>
          <span className="font-mono text-slate-50">/{doc.code}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Target URL</span>
          <a
            href={doc.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:underline break-all text-right"
          >
            {doc.targetUrl}
          </a>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Total clicks</span>
          <span className="font-semibold text-slate-50">{doc.clicks}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Created at</span>
          <span className="text-slate-50">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Last clicked</span>
          <span className="text-slate-50">
            {lastClickedAt
              ? new Date(lastClickedAt).toLocaleString()
              : "Never"}
          </span>
        </div>
      </div>

      <div>
        <Button variant="ghost" asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
