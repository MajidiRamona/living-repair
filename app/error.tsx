'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <header className="hero">
      <div className="container">
        <div className="eyebrow">Error</div>
        <h1>Something went wrong.</h1>
        <p className="lede">
          That was unexpected on our end, not yours. Try again, and if it keeps happening, let us know.
        </p>
        <div className="cta">
          <button className="btn" onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </header>
  );
}
