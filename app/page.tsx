"use client";

import { useState, useEffect } from "react";
import { CATEGORIES, CONDITIONS } from "@/lib/listings";
import type { Listing } from "@/lib/listings";

const ICONS: Record<string, string> = {
  excavator: "⛏️", tractor: "🚜", crane: "🏗️",
  dozer: "🚧", telehandler: "🦺", compressor: "⚙️", roller: "🛞",
};

function conditionBadge(c: string) {
  const map: Record<string, string> = {
    "New": "badge badge-new",
    "Like New": "badge badge-likenew",
    "Used": "badge badge-used",
    "Parts Only": "badge badge-parts",
  };
  return map[c] || "badge badge-used";
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function Home() {
  const [response, setResponse] = useState<{ key: string; listings: Listing[]; total: number; error: string | null } | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 280);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (category !== "All") params.set("category", category);
  if (condition !== "All") params.set("condition", condition);
  const queryKey = params.toString();

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`/api/listings?${queryKey}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data.listings) || typeof data.total !== "number") {
          throw new Error("Invalid listing response");
        }
        if (!controller.signal.aborted) setResponse({ key: queryKey, listings: data.listings, total: data.total, error: null });
      } catch {
        if (!controller.signal.aborted) {
          setResponse({ key: queryKey, listings: [], total: 0, error: "Unable to load equipment. Please try again." });
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [queryKey, retry]);

  const loading = response?.key !== queryKey;
  const listings = response?.listings ?? [];
  const total = response?.total ?? 0;
  const error = loading ? null : response?.error;

  return (
    <div className="noise min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <a className="skip-link" href="#listings">Skip to equipment listings</a>
      <header className="market-header" style={{ borderBottom: "1px solid var(--border)", background: "rgba(14,14,14,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏗️</span>
            <span className="font-display" style={{ fontSize: 26, color: "var(--text-primary)" }}>MachineryFind</span>
            <span style={{ background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em", marginLeft: 4, textTransform: "uppercase" }}>Beta</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="font-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{total} listings</span>
            <a href="https://github.com/malavikakashireddy/machinery-find" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 6, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "48px 24px 40px", background: "linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 100%)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 className="font-display fade-up" style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 1, margin: "0 0 8px", color: "var(--text-primary)" }}>
            Find Heavy Equipment<br />
            <span style={{ color: "var(--accent)" }}>That Works As Hard</span><br />
            As You Do
          </h1>
          <p className="fade-up" style={{ color: "var(--text-secondary)", fontSize: 16, marginTop: 16, animationDelay: "0.1s", maxWidth: 520 }}>
            Explore sample machinery listings across the Midwest. This is a browsing demo with fictional inventory. Excavators, tractors, cranes, and more.
          </p>

          {/* Search */}
          <div className="fade-up" style={{ marginTop: 28, animationDelay: "0.15s", maxWidth: 560, position: "relative" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              aria-label="Search equipment by name, type, or location"
              maxLength={100}
              className="search-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search by name, type, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "rgba(22,22,22,0.8)", backdropFilter: "blur(8px)", position: "sticky", top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", gap: 24, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Category</span>
            {CATEGORIES.map(c => (
              <button key={c} className={`chip ${category === c ? "active" : ""}`} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Condition</span>
            {CONDITIONS.map(c => (
              <button key={c} className={`chip ${condition === c ? "active" : ""}`} aria-pressed={condition === c} onClick={() => setCondition(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <main id="listings" aria-busy={loading} style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        <p className="sr-only" role="status" aria-live="polite">{loading ? "Loading equipment" : error ? "Equipment could not be loaded" : `${total} results`}</p>
        {error ? (
          <div role="alert"><p>{error}</p><button className="chip" onClick={() => { setResponse(null); setRetry(value => value + 1); }}>Retry</button></div>
        ) : loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, height: 220, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-secondary)" }}>No equipment found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20, fontFamily: "DM Mono, monospace" }}>
              Showing <span style={{ color: "var(--accent)" }}>{total}</span> result{total !== 1 ? "s" : ""}
              {debouncedSearch && <> for &ldquo;<span style={{ color: "var(--text-secondary)" }}>{debouncedSearch}</span>&rdquo;</>}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 310px), 1fr))", gap: 16 }}>
              {listings.map((listing, i) => (
                <article
                  key={listing.id}
                  className="listing-card fade-up"
                  style={{ padding: 20, animationDelay: `${i * 0.05}s` }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 44, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        {ICONS[listing.image] || "⚙️"}
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{listing.category}</span>
                        <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{listing.year}</div>
                      </div>
                    </div>
                    <span className={conditionBadge(listing.condition)}>{listing.condition}</span>
                  </div>

                  {/* Name */}
                  <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.3, color: "var(--text-primary)" }}>
                    {listing.name}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
                    {listing.description.length > 90 ? listing.description.slice(0, 90) + "…" : listing.description}
                  </p>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    {listing.horsepower && (
                      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", fontSize: 12 }}>
                        <span style={{ color: "var(--text-muted)" }}>HP </span>
                        <span className="font-mono" style={{ color: "var(--text-primary)", fontWeight: 500 }}>{listing.horsepower}</span>
                      </div>
                    )}
                    {listing.hours !== undefined && (
                      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", fontSize: 12 }}>
                        <span style={{ color: "var(--text-muted)" }}>Hrs </span>
                        <span className="font-mono" style={{ color: "var(--text-primary)", fontWeight: 500 }}>{listing.hours.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ color: "var(--text-secondary)" }}>{listing.location}</span>
                    </div>
                  </div>

                  <details>
                    <summary>Equipment details</summary>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{listing.description}</p>
                  </details>
                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <span className="font-display" style={{ fontSize: 22, color: "var(--text-primary)" }}>{formatPrice(listing.price)}</span>
                    <span className="sample-label">Sample inventory</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center" }}>
        <p className="font-mono" style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Built with Next.js + TypeScript · REST API · Tailwind CSS ·{" "}
          <a href="https://github.com/malavikakashireddy/machinery-find" style={{ color: "var(--accent)", textDecoration: "none" }}>
            github.com/malavikakashireddy/machinery-find
          </a>
        </p>
      </footer>
    </div>
  );
}
