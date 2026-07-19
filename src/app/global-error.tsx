"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main id="main-content" className="system-page">
          <div className="container container--narrow">
            <p className="eyebrow">Application error</p>
            <h1>The site could not load.</h1>
            <p>Please try again.</p>
            <button className="button" type="button" onClick={reset}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
