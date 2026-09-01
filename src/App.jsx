import { useState } from "react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { countWords } from "./countWords";
import { authClient } from "./auth-client";

const MAX_WORDS = 1000;

const SCORE_LABELS = {
  audienceClarity: "Audience clarity",
  problemClarity: "Problem clarity",
  value: "Value",
  differentiation: "Differentiation",
  credibility: "Credibility",
  emotionalFit: "Emotional fit",
};

const BrandMark = () => (
  <div className="brand-mark" aria-hidden="true">
    <span>N</span>
  </div>
);

function AuthScreen() {
  const [mode, setMode] = useState("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const isSignUp = mode === "signUp";

  const handleAuth = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password, rememberMe: true });

    if (result.error) {
      setAuthError(result.error.message || "We couldn’t complete that request.");
    }
    setIsSubmitting(false);
  };

  const switchMode = () => {
    setMode(isSignUp ? "signIn" : "signUp");
    setAuthError("");
  };

  return (
    <main className="auth-page">
      <a className="brand auth-brand" href="/" aria-label="Narrative Desk home">
        <BrandMark />
        <span>Narrative Desk</span>
      </a>
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Your private narrative workspace</p>
        <h1 id="auth-title">{isSignUp ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-intro">
          {isSignUp
            ? "Create an account to start shaping stronger product stories."
            : "Sign in to continue working on your product narrative."}
        </p>

        <form className="auth-form" onSubmit={handleAuth}>
          {isSignUp ? (
            <div className="field-group">
              <label htmlFor="auth-name">Name</label>
              <input
                id="auth-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
          ) : null}
          <div className="field-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              required
            />
            {isSignUp ? <small>Use at least 8 characters.</small> : null}
          </div>

          {authError ? <p className="auth-error" role="alert">{authError}</p> : null}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New to Narrative Desk?"}{" "}
          <button type="button" onClick={switchMode}>
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}

function NarrativeDesk() {
  const [view, setView] = useState("analyzer");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [marketType, setMarketType] = useState("");
  const [audience, setAudience] = useState("");
  const [emotion, setEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copyErrorIndex, setCopyErrorIndex] = useState(null);
  const saveAnalysis = useMutation(api.analyses.save);
  const savedAnalyses = useQuery(api.analyses.list);
  const wordCount = countWords(narrative);
  const isOverLimit = wordCount > MAX_WORDS;
  const isFormValid =
    narrative.trim() !== "" &&
    marketType !== "" &&
    audience.trim() !== "" &&
    emotion !== "" &&
    !isOverLimit;

  const runAnalysis = async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis(null);
    setCopiedIndex(null);
    setCopyErrorIndex(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrative, marketType, audience, emotion }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      await saveAnalysis({
        narrative,
        marketType,
        audience,
        emotion,
        scores: result.scores,
        alternatives: result.alternatives,
      });
      setAnalysis(result);
    } catch {
      setError("We couldn’t analyze this narrative. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runAnalysis();
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyErrorIndex(null);
      setCopiedIndex(index);
      window.setTimeout(() => {
        setCopiedIndex((currentIndex) =>
          currentIndex === index ? null : currentIndex,
        );
      }, 2000);
    } catch {
      setCopiedIndex(null);
      setCopyErrorIndex(index);
    }
  };

  const handleHeaderNavigation = () => {
    if (view === "detail") {
      setView("history");
      return;
    }
    setView(view === "history" ? "analyzer" : "history");
  };

  const openSavedAnalysis = (savedAnalysis) => {
    setSelectedAnalysis(savedAnalysis);
    setView("detail");
  };

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Narrative Desk home">
          <BrandMark />
          <span>Narrative Desk</span>
        </a>
        <div className="account-actions">
          <span className="stage-label">Private working draft</span>
          <button
            className="header-action-button"
            type="button"
            onClick={handleHeaderNavigation}
          >
            {view === "detail"
              ? "Back to history"
              : view === "history"
                ? "Back to analyzer"
                : "History"}
          </button>
          <button className="sign-out-button" type="button" onClick={() => authClient.signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {view === "history" ? (
        <section className="history-section" aria-labelledby="history-title">
          <p className="eyebrow">Your saved work</p>
          <h1 id="history-title">Analysis history</h1>
          <p className="history-intro">Your latest narrative reviews appear first.</p>

          {savedAnalyses === undefined ? (
            <p className="history-state" role="status">Loading your history…</p>
          ) : savedAnalyses.length === 0 ? (
            <div className="history-state">
              <h2>No saved analyses yet</h2>
              <p>Your next completed analysis will appear here automatically.</p>
              <button type="button" onClick={() => setView("analyzer")}>Analyze a narrative</button>
            </div>
          ) : (
            <div className="history-list">
              {savedAnalyses.map((item) => (
                <button
                  className="history-card"
                  type="button"
                  key={item._id}
                  onClick={() => openSavedAnalysis(item)}
                >
                  <div className="history-date-row">
                    <time dateTime={new Date(item.createdAt).toISOString()}>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(item.createdAt)}
                    </time>
                  </div>
                  <div className="history-card-context">
                    <strong>{item.marketType}</strong>
                    <span>{item.audience}</span>
                  </div>
                  <span className="history-narrative">{item.narrative}</span>
                  <span className="history-card-footer">
                    <span className="history-emotion">Designed for {item.emotion.toLowerCase()}</span>
                    <span className="history-arrow" aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : view === "detail" && selectedAnalysis ? (
        <section className="saved-detail" aria-labelledby="saved-detail-title">
          <div className="saved-detail-heading">
            <div>
              <p className="eyebrow">Saved analysis</p>
              <h1 id="saved-detail-title">Narrative review</h1>
            </div>
            <time dateTime={new Date(selectedAnalysis.createdAt).toISOString()}>
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(selectedAnalysis.createdAt)}
            </time>
          </div>

          <div className="saved-context">
            <div><span>Market type</span><strong>{selectedAnalysis.marketType}</strong></div>
            <div><span>Industry and persona</span><strong>{selectedAnalysis.audience}</strong></div>
            <div><span>Desired emotion</span><strong>{selectedAnalysis.emotion}</strong></div>
          </div>

          <article className="saved-narrative">
            <p className="step-label">Original narrative</p>
            <p>{selectedAnalysis.narrative}</p>
          </article>

          <div className="results-heading saved-results-heading">
            <p className="eyebrow">AI narrative review</p>
            <h2>Your narrative scorecard</h2>
          </div>
          <div className="score-grid">
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const item = selectedAnalysis.scores[key];
              return (
                <article className="score-card" key={key}>
                  <div className="score-card-heading">
                    <h3>{label}</h3>
                    <span className="score-number">{item.score}<small>/5</small></span>
                  </div>
                  <p>{item.explanation}</p>
                </article>
              );
            })}
          </div>

          <div className="alternatives-heading">
            <p className="eyebrow">Three directions</p>
            <h2>Alternate narratives</h2>
          </div>
          <div className="alternatives-list">
            {selectedAnalysis.alternatives.map((alternative, index) => (
              <article className="alternative-card" key={`${alternative.title}-${index}`}>
                <div className="alternative-card-heading">
                  <span>Option {index + 1}</span>
                  <span>{countWords(alternative.narrative).toLocaleString()} words</span>
                </div>
                <h3>{alternative.title}</h3>
                <p>{alternative.narrative}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Product narrative review</p>
        <h1 id="page-title">
          Find the story your
          <br />
          product is trying to tell.
        </h1>
        <p className="intro-copy">
          Bring your draft. See what works, fix what doesn’t, and shape it into
          the perfect product narrative.
        </p>
      </section>

      <section className="workspace" aria-labelledby="workspace-title">
        <aside className="margin-note">
          <span className="note-rule" aria-hidden="true" />
          <p>Start with the version you would share today—not the perfect one.</p>
        </aside>

        <form className="editor-card" onSubmit={handleSubmit} aria-busy={isLoading}>
          <div className="editor-heading">
            <div>
              <p className="step-label">Your draft</p>
              <h2 id="workspace-title">Paste your product narrative</h2>
            </div>
            <span className="limit-label">Up to 1,000 words</span>
          </div>

          <label className="sr-only" htmlFor="narrative">
            Product narrative
          </label>
          <textarea
            id="narrative"
            value={narrative}
            onChange={(event) => setNarrative(event.target.value)}
            placeholder="Paste the narrative you’re preparing for launch…"
            disabled={isLoading}
            aria-invalid={isOverLimit}
            aria-describedby="narrative-count narrative-limit-message"
          />

          <div
            id="narrative-count"
            className={`word-count${isOverLimit ? " word-count-over" : ""}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{wordCount.toLocaleString()} / 1,000 words</span>
          </div>

          <p
            id="narrative-limit-message"
            className={`limit-message${isOverLimit ? " limit-message-visible" : ""}`}
            role={isOverLimit ? "alert" : undefined}
          >
            Shorten your narrative to 1,000 words or fewer before analyzing it.
          </p>

          <div className="context-fields">
            <div className="field-group">
              <label htmlFor="market-type">Market type</label>
              <select
                id="market-type"
                value={marketType}
                onChange={(event) => setMarketType(event.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Choose one</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
              </select>
            </div>

            <div className="field-group field-group-wide">
              <label htmlFor="audience">Industry and target persona</label>
              <input
                id="audience"
                type="text"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="e.g. Healthcare CFOs"
                disabled={isLoading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="emotion">Desired emotion</label>
              <select
                id="emotion"
                value={emotion}
                onChange={(event) => setEmotion(event.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Choose one</option>
                <option value="Trust">Trust</option>
                <option value="Urgency">Urgency</option>
                <option value="Excitement">Excitement</option>
                <option value="Curiosity">Curiosity</option>
                <option value="Confidence">Confidence</option>
                <option value="Aspiration">Aspiration</option>
              </select>
            </div>
          </div>

          <div className="editor-footer">
            <p>
              {isFormValid
                ? "Ready for a narrative review."
                : "Complete the draft and audience details to continue."}
            </p>
            <button
              className="analyze-button"
              type="submit"
              disabled={!isFormValid || isLoading}
              aria-disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Reading narrative…
                </>
              ) : (
                <>
                  Analyze narrative
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <span className="loading-line" aria-hidden="true" />
              <p>Reading for clarity, differentiation, and emotional fit…</p>
            </div>
          ) : null}

          {error ? (
            <div className="analysis-error" role="alert">
              <div>
                <strong>Analysis didn’t finish</strong>
                <p>{error}</p>
              </div>
              <button
                className="retry-button"
                type="button"
                onClick={runAnalysis}
                disabled={isLoading}
              >
                Retry
                <span aria-hidden="true">↻</span>
              </button>
            </div>
          ) : null}
        </form>
      </section>

      {analysis ? (
        <section className="results-section" aria-labelledby="scorecard-title">
          <div className="results-heading">
            <p className="eyebrow">AI narrative review</p>
            <h2 id="scorecard-title">Your narrative scorecard</h2>
          </div>
          <div className="score-grid">
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const item = analysis.scores[key];
              return (
                <article className="score-card" key={key}>
                  <div className="score-card-heading">
                    <h3>{label}</h3>
                    <span className="score-number">{item.score}<small>/5</small></span>
                  </div>
                  <p>{item.explanation}</p>
                </article>
              );
            })}
          </div>

          <div className="alternatives-heading">
            <p className="eyebrow">Three directions</p>
            <h2>Alternate narratives</h2>
            <p>
              Each version keeps your product facts and stays close to your
              original {wordCount.toLocaleString()}-word length.
            </p>
          </div>
          <div className="alternatives-list">
            {analysis.alternatives.map((alternative, index) => (
              <article className="alternative-card" key={`${alternative.title}-${index}`}>
                <div className="alternative-card-heading">
                  <span>Option {index + 1}</span>
                  <span>{countWords(alternative.narrative).toLocaleString()} words</span>
                </div>
                <h3>{alternative.title}</h3>
                <p>{alternative.narrative}</p>
                <div className="copy-row">
                  <button
                    className={`copy-button${copiedIndex === index ? " copy-button-success" : ""}`}
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `${alternative.title}\n\n${alternative.narrative}`,
                        index,
                      )
                    }
                  >
                    {copiedIndex === index ? "Copied" : "Copy narrative"}
                    <span aria-hidden="true">{copiedIndex === index ? "✓" : "⧉"}</span>
                  </button>
                  <span className="copy-status" role="status" aria-live="polite">
                    {copyErrorIndex === index
                      ? "Couldn’t copy. Please try again."
                      : copiedIndex === index
                        ? "Ready to paste anywhere."
                        : ""}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
        </>
      )}
    </main>
  );
}

function App() {
  return (
    <>
      <AuthLoading>
        <main className="auth-page auth-loading" role="status">
          <BrandMark />
          <p>Opening Narrative Desk…</p>
        </main>
      </AuthLoading>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>
      <Authenticated>
        <NarrativeDesk />
      </Authenticated>
    </>
  );
}

export default App;
