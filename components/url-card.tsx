"use client";

import { ExternalLinkIcon, Trash2Icon, BarChart3Icon, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface UrlCardProps {
  code: string;
  url: string;
  createdAt: string;
  lastClickedAt: string | null;
  clicks: number;
  onDelete?: () => void;
}

export function UrlCard(props: UrlCardProps) {
  const { code, url, createdAt, lastClickedAt, clicks, onDelete } = props;
  const [copied, setCopied] = useState(false);

  const shortUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${code}`
      : `/${code}`;

  const lastClickedText = lastClickedAt
    ? new Date(lastClickedAt).toLocaleString()
    : "Never";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-sm px-5 py-4 text-sm flex flex-col gap-3 hover:border-slate-700/50 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-semibold text-sky-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
              /{code}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 px-2 py-1 rounded-md hover:bg-slate-800/50 transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-400 text-xs hover:text-sky-300 hover:underline transition-colors font-mono break-all"
          >
            {shortUrl}
            <ExternalLinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
          </a>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            <span className="font-medium">{clicks}</span>
            <span className="text-slate-500">clicks</span>
          </div>
          <span className="text-slate-500">Created {new Date(createdAt).toLocaleDateString()}</span>
          <span className="text-slate-500">Last: {lastClickedText === "Never" ? "Never" : new Date(lastClickedAt!).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="truncate text-xs text-slate-300 bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-700/30">
        <span className="mr-2 text-slate-500">→</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-200 hover:underline break-all transition-colors"
        >
          {url}
        </a>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/50">
        <Button variant="outline" size="sm" asChild>
          <a href={`/code/${code}`} className="inline-flex items-center gap-1.5">
            <BarChart3Icon className="h-3.5 w-3.5" />
            <span>Stats</span>
          </a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5"
        >
          <Trash2Icon className="h-3.5 w-3.5" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}
