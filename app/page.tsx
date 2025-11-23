"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UrlCard } from "@/components/url-card";

interface LinkResponse {
  id: string;
  code: string;
  url: string;
  createdAt: string;
  lastClickedAt: string | null;
  clicks: number;
}

interface LinksListResponse {
  links: LinkResponse[];
}

interface LinkSingleResponse {
  link: LinkResponse;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkResponse[]>([]);

  async function loadLinks() {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) {
        return;
      }
      const data = (await res.json()) as LinksListResponse;
      setLinks(data.links);
    } catch {
    }
  }

  useEffect(() => {
    void loadLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return links;
    }
    return links.filter((link) => {
      return (
        link.code.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
      );
    });
  }, [links, search]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          code: code || undefined
        })
      });

      const payload = (await res.json()) as
        | { error: string }
        | LinkSingleResponse;

      if (!res.ok) {
        const message =
          "error" in payload ? payload.error : "Unexpected error occurred";
        setError(message);
        return;
      }

      if ("link" in payload) {
        setUrl("");
        setCode("");
        await loadLinks();
      }
    } catch (err) {
      console.error(err);
      setError("Network error while creating TinyLink");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(deleteCode: string) {
    setError(null);
    try {
      const res = await fetch(`/api/links/${encodeURIComponent(deleteCode)}`, {
        method: "DELETE"
      });

      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => null);
        const message =
          payload?.error ?? "Failed to delete link. Please try again.";
        setError(message);
        return;
      }

      await loadLinks();
    } catch (err) {
      console.error(err);
      setError("Network error while deleting TinyLink");
    }
  }

  const latestCreated = links.length > 0 ? links[0].code : null;

  const latestShortUrl =
    latestCreated && typeof window !== "undefined"
      ? `${window.location.origin}/${latestCreated}`
      : latestCreated
        ? `/${latestCreated}`
        : null;

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <section className="space-y-3 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 text-transparent bg-clip-text">
          TinyLink – URL Shortener
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Transform long URLs into short, trackable links. Paste a URL, optionally choose a custom code, and share your TinyLink instantly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/20 px-5 sm:px-6 py-6 space-y-5 animate-slide-up">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          autoComplete="off"
        >
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="url" className="text-slate-200 font-medium">Long URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/very/long/path..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500">
              The destination URL that users will be redirected to
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor="code" className="text-slate-200 font-medium">
              Custom short code{" "}
              <span className="text-slate-500 font-normal">(optional)</span>
            </Label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-lg bg-slate-800/50 px-3 text-sm text-slate-400 border border-slate-700/50 font-mono">
                /
              </span>
              <Input
                id="code"
                placeholder="e.g. mylink"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-slate-500">
              Codes must be 6–8 characters (letters and digits only). Leave empty for auto-generation.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-800/50 bg-red-950/30 backdrop-blur-sm px-4 py-3 animate-fade-in">
              <p className="text-sm text-red-300 flex items-center gap-2">
                <span className="text-red-500">⚠</span>
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "Create TinyLink"
              )}
            </Button>
            {latestShortUrl && (
              <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                <span>Latest:</span>
                <a
                  href={latestShortUrl}
                  className="font-mono text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                >
                  {latestShortUrl}
                </a>
              </div>
            )}
          </div>
        </form>

        
      </section>

      <section className="space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">
            Your TinyLinks
          </h2>
          
          {filteredLinks.length > 0 && (
            <span className="text-xs text-slate-500 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
              {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2.5 border-t border-slate-800/50 pt-5">
          <Label htmlFor="search" className="text-slate-200 font-medium">Search</Label>
          <Input
            id="search"
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Filter your links by typing part of a code or destination URL
          </p>
        </div>
        {filteredLinks.length === 0 ? (
          <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm px-6 py-8 text-center">
            <p className="text-sm text-slate-400">
              {links.length === 0
                ? "No links created yet. Use the form above to create your first TinyLink."
                : "No links match your search. Try a different filter."}
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-3">
          {filteredLinks.map((link, index) => (
            <div key={link.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
              <UrlCard
                code={link.code}
                url={link.url}
                createdAt={link.createdAt}
                lastClickedAt={link.lastClickedAt}
                clicks={link.clicks}
                onDelete={() => {
                  void handleDelete(link.code);
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
