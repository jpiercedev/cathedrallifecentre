"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="system-page">
      <Container size="narrow">
        <p className="eyebrow">Application error</p>
        <h1>Something went wrong.</h1>
        <p>Please try loading this page again.</p>
        <button className="button" type="button" onClick={reset}>
          Try again
        </button>
      </Container>
    </main>
  );
}
