import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, User, FileText, Clock, AlertCircle, Sparkles } from "lucide-react";

/* ─── STYLES ─────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:            #080b14;
    --bg2:           #0d1220;
    --surface:       rgba(255,255,255,0.045);
    --surface-hover: rgba(255,255,255,0.08);
    --border:        rgba(255,255,255,0.09);
    --border-focus:  rgba(212,175,55,0.6);
    --text:          #f0eee8;
    --muted:         rgba(240,238,232,0.45);
    --gold:          #d4af37;
    --gold-lt:       rgba(212,175,55,0.12);
    --gold-glow:     rgba(212,175,55,0.25);
    --teal:          #4ecdc4;
    --teal-lt:       rgba(78,205,196,0.12);
    --red:           #ff5e5e;
    --radius:        18px;
    --shadow-card:   0 4px 24px rgba(0,0,0,0.3);
    --shadow-gold:   0 0 30px rgba(212,175,55,0.15);
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 72px 16px 120px;
    color: var(--text);
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: -180px; left: -120px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  body::after {
    content: '';
    position: fixed;
    bottom: -200px; right: -150px;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(78,205,196,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .wrapper {
    width: 100%;
    max-width: 580px;
    position: relative;
    z-index: 1;
  }

  /* ─── Header ─── */
  .header { margin-bottom: 36px; text-align: center; }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--gold-lt);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 40px;
    padding: 5px 14px;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--gold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.4rem;
    font-weight: 300;
    letter-spacing: -1px;
    line-height: 1.1;
    background: linear-gradient(135deg, #f0eee8 0%, #d4af37 50%, #f0eee8 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-text 4s linear infinite;
  }

  @keyframes shimmer-text {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  .header p {
    margin-top: 10px;
    font-size: 0.88rem;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  /* ─── Search Box ─── */
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--shadow-card);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .search-box.focused {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--gold-glow), var(--shadow-gold);
  }

  .search-icon {
    position: absolute; left: 20px;
    color: var(--muted);
    transition: color 0.25s;
    pointer-events: none; flex-shrink: 0;
  }
  .search-box.focused .search-icon { color: var(--gold); }

  .search-input {
    width: 100%; border: none; outline: none;
    background: transparent;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem; font-weight: 400;
    color: var(--text);
    padding: 20px 54px 20px 56px;
    caret-color: var(--gold);
    letter-spacing: 0.01em;
  }
  .search-input::placeholder { color: var(--muted); }

  .clear-btn {
    position: absolute; right: 16px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer; width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    opacity: 0; transform: scale(0.6) rotate(90deg);
    transition: opacity 0.22s, transform 0.22s, background 0.15s;
    pointer-events: none;
  }
  .clear-btn.visible {
    opacity: 1; transform: scale(1) rotate(0deg);
    pointer-events: auto;
  }
  .clear-btn:hover { background: rgba(255,255,255,0.14); color: var(--text); }

  /* ─── Filter Tabs ─── */
  .filters { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .filter-tab {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 40px; padding: 7px 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem; font-weight: 500;
    color: var(--muted); cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
    letter-spacing: 0.02em;
  }
  .filter-tab:hover {
    border-color: rgba(212,175,55,0.4);
    color: var(--gold); background: var(--gold-lt);
  }
  .filter-tab.active {
    background: linear-gradient(135deg, #c9991f, #d4af37, #e8c84a);
    border-color: transparent; color: #080b14;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(212,175,55,0.3);
  }

  /* ─── Results Panel ─── */
  .results-panel { margin-top: 18px; }

  /* ─── Skeleton ─── */
  .skeleton-list { display: flex; flex-direction: column; gap: 10px; }
  .skeleton-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px; display: flex; gap: 14px;
    align-items: flex-start;
    backdrop-filter: blur(16px);
  }
  .skel {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    border-radius: 6px;
  }
  .skel-avatar { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; }
  .skel-lines  { flex: 1; display: flex; flex-direction: column; gap: 9px; }
  .skel-line   { height: 10px; }
  .skel-line.w80 { width: 80%; }
  .skel-line.w55 { width: 55%; }
  .skel-line.w95 { width: 95%; }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ─── Result Cards ─── */
  .card-list { display: flex; flex-direction: column; gap: 10px; }

  .result-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    display: flex; gap: 16px;
    align-items: flex-start;
    cursor: pointer;
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s, background 0.22s;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    opacity: 0; transform: translateY(14px);
    animation: card-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
    position: relative; overflow: hidden;
  }
  .result-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.25s;
  }
  .result-card:hover {
    border-color: rgba(212,175,55,0.35);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1);
    transform: translateY(-2px);
    background: var(--surface-hover);
  }
  .result-card:hover::before { opacity: 1; }

  @keyframes card-in {
    to { opacity: 1; transform: translateY(0); }
  }

  .card-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-weight: 600; font-size: 0.85rem;
    letter-spacing: 0.03em; position: relative; z-index: 1;
  }
  .avatar-user {
    background: linear-gradient(135deg, #1a2540, #243060);
    border: 1px solid rgba(212,175,55,0.3);
    color: var(--gold);
    box-shadow: 0 0 16px rgba(212,175,55,0.12);
  }
  .avatar-post {
    background: linear-gradient(135deg, #1a2530, #0f2535);
    border: 1px solid rgba(78,205,196,0.3);
    color: var(--teal);
    box-shadow: 0 0 16px rgba(78,205,196,0.1);
  }

  .card-body { flex: 1; min-width: 0; position: relative; z-index: 1; }
  .card-title {
    font-size: 0.92rem; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    line-height: 1.3; margin-bottom: 5px;
    color: var(--text); letter-spacing: 0.01em;
  }
  .card-meta {
    font-size: 0.75rem; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 7px; font-weight: 400;
  }
  .card-meta svg { flex-shrink: 0; opacity: 0.7; }
  .card-excerpt {
    font-size: 0.8rem; color: rgba(240,238,232,0.38);
    display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; line-height: 1.6; font-weight: 300;
  }

  .card-badge {
    position: absolute; top: 18px; right: 18px;
    font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 40px; z-index: 1;
  }
  .badge-user {
    background: var(--gold-lt); color: var(--gold);
    border: 1px solid rgba(212,175,55,0.2);
  }
  .badge-post {
    background: var(--teal-lt); color: var(--teal);
    border: 1px solid rgba(78,205,196,0.2);
  }

  mark {
    background: rgba(212,175,55,0.18);
    color: var(--gold); border-radius: 3px;
    padding: 0 2px; font-weight: 600;
  }

  .section-label {
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin: 16px 0 8px 2px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border);
  }

  .result-count {
    font-size: 0.78rem; color: var(--muted);
    margin-bottom: 12px; padding-left: 2px;
    font-weight: 300; letter-spacing: 0.02em;
    animation: card-in 0.3s ease forwards; opacity: 0;
  }
  .result-count strong { color: var(--gold); font-weight: 500; }

  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 56px 20px; text-align: center; gap: 10px;
    animation: card-in 0.35s ease forwards; opacity: 0;
  }
  .empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,94,94,0.08);
    border: 1px solid rgba(255,94,94,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); margin-bottom: 8px;
    box-shadow: 0 0 24px rgba(255,94,94,0.1);
  }
  .empty-state h3 { font-size: 1rem; font-weight: 500; color: var(--text); }
  .empty-state p  { font-size: 0.83rem; color: var(--muted); max-width: 240px; line-height: 1.6; font-weight: 300; }

  .idle-hint {
    display: flex; flex-direction: column;
    align-items: center; gap: 14px; padding: 48px 0;
    animation: card-in 0.4s ease forwards; opacity: 0;
  }
  .idle-orb {
    width: 72px; height: 72px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, rgba(212,175,55,0.12), rgba(212,175,55,0.02));
    border: 1px solid rgba(212,175,55,0.15);
    display: flex; align-items: center; justify-content: center;
    color: rgba(212,175,55,0.4);
    animation: pulse-orb 3s ease-in-out infinite;
  }
  @keyframes pulse-orb {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.15); }
    50%       { box-shadow: 0 0 0 14px rgba(212,175,55,0.0); }
  }
  .idle-hint p { font-size: 0.84rem; color: var(--muted); font-weight: 300; letter-spacing: 0.03em; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
`;

/* ─── HELPERS ──────────────────────────────────────── */
function highlight(text, query) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? <mark key={i}>{p}</mark> : p
  );
}

function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/* ─── SKELETON ─────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skel skel-avatar" />
      <div className="skel-lines">
        <div className="skel skel-line w80" />
        <div className="skel skel-line w55" />
        <div className="skel skel-line w95" />
      </div>
    </div>
  );
}

/* ─── RESULT CARD ──────────────────────────────────── */
function ResultCard({ item, query, index, type }) {
  const delay = `${index * 60}ms`;
  if (type === "users") {
    return (
      <div className="result-card" style={{ animationDelay: delay }}>
        <div className="card-avatar avatar-user">{initials(item.name)}</div>
        <div className="card-body">
          <div className="card-title">{highlight(item.name, query)}</div>
          <div className="card-meta">
            <User size={11} />
            @{highlight(item.username, query)} · {item.email}
          </div>
          <div className="card-excerpt">{item.company?.name} · {item.address?.city}</div>
        </div>
        <span className="card-badge badge-user">User</span>
      </div>
    );
  }
  return (
    <div className="result-card" style={{ animationDelay: delay }}>
      <div className="card-avatar avatar-post"><FileText size={18} /></div>
      <div className="card-body">
        <div className="card-title">{highlight(item.title, query)}</div>
        <div className="card-meta"><Clock size={11} /> Post #{item.id}</div>
        <div className="card-excerpt">{highlight(item.body, query)}</div>
      </div>
      <span className="card-badge badge-post">Post</span>
    </div>
  );
}

/* ─── MAIN APP ─────────────────────────────────────── */
export default function App() {
  const [query, setQuery]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [filter, setFilter]     = useState("all");
  const [results, setResults]   = useState({ users: [], posts: [] });
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) { setResults({ users: [], posts: [] }); setSearched(false); return; }
    setLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users"),
        fetch("https://jsonplaceholder.typicode.com/posts"),
      ]);
      const [users, posts] = await Promise.all([usersRes.json(), postsRes.json()]);
      const lq = q.toLowerCase();
      setResults({
        users: users.filter(u =>
          u.name.toLowerCase().includes(lq) ||
          u.username.toLowerCase().includes(lq) ||
          u.email.toLowerCase().includes(lq)
        ).slice(0, 4),
        posts: posts.filter(p =>
          p.title.toLowerCase().includes(lq) ||
          p.body.toLowerCase().includes(lq)
        ).slice(0, 5),
      });
      setSearched(true);
    } catch {
      setResults({ users: [], posts: [] });
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchResults(query), 350);
    return () => clearTimeout(timerRef.current);
  }, [query, fetchResults]);

  const displayedUsers = filter === "posts" ? [] : results.users;
  const displayedPosts = filter === "users" ? [] : results.posts;
  const total   = displayedUsers.length + displayedPosts.length;
  const isEmpty = searched && !loading && total === 0 && query.trim();
  const listKey = query + filter;

  return (
    <>
      <style>{css}</style>
      <div className="wrapper">

        <div className="header">
          <div className="header-badge"><Sparkles size={11} /> Elite Search</div>
          <h1>Find anything i meann anythingg.</h1>
          <p>Search users and posts instantly in a click.</p>
        </div>

        <div className={`search-box${focused ? " focused" : ""}`}>
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Justtt searchhh...."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className={`clear-btn${query ? " visible" : ""}`}
            onClick={() => { setQuery(""); inputRef.current.focus(); }}
            tabIndex={-1}
            aria-label="Clear"
          >
            <X size={13} />
          </button>
        </div>

        {query.trim() && !loading && (
          <div className="filters">
            {["all", "users", "posts"].map(f => (
              <button
                key={f}
                className={`filter-tab${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "users" && results.users.length ? ` (${results.users.length})` : ""}
                {f === "posts" && results.posts.length ? ` (${results.posts.length})` : ""}
              </button>
            ))}
          </div>
        )}

        <div className="results-panel">
          {loading && (
            <div className="skeleton-list">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {isEmpty && (
            <div className="empty-state">
              <div className="empty-icon"><AlertCircle size={26} /></div>
              <h3>No results for "{query}"</h3>
              <p>Try a different keyword or check your spelling.</p>
            </div>
          )}

          {!loading && total > 0 && (
            <div key={listKey}>
              <div className="result-count" style={{ opacity: 1 }}>
                <strong>{total}</strong> result{total !== 1 ? "s" : ""} for "<strong>{query}</strong>"
              </div>

              {displayedUsers.length > 0 && (
                <>
                  <div className="section-label"><User size={11} /> People</div>
                  <div className="card-list">
                    {displayedUsers.map((u, i) => (
                      <ResultCard key={`u-${u.id}`} item={u} query={query} index={i} type="users" />
                    ))}
                  </div>
                </>
              )}

              {displayedPosts.length > 0 && (
                <>
                  <div className="section-label" style={{ marginTop: displayedUsers.length ? 20 : 0 }}>
                    <FileText size={11} /> Posts
                  </div>
                  <div className="card-list">
                    {displayedPosts.map((p, i) => (
                      <ResultCard key={`p-${p.id}`} item={p} query={query} index={displayedUsers.length + i} type="posts" />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!query && (
            <div className="idle-hint">
              <div className="idle-orb"><Search size={26} /></div>
              <p>Start typing to explore…</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

