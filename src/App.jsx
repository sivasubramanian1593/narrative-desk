import { useState } from "react";
import { countWords } from "./countWords";

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

function App() {
  const [narrative, setNarrative] = useState("");
  const [marketType, setMarketType] = useState("");
  const [audience, setAudience] = useState("");
  const [emotion, setEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copyErrorIndex, setCopyErrorIndex] = useState(null);
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

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Narrative Desk home">
          <BrandMark />
          <span>Narrative Desk</span>
        </a>
        <span className="stage-label">Private working draft</span>
      </header>

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
    </main>
  );
}

export default App;
