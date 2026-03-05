import { useState } from "react";

interface TinDisplayProps {
  tin: string;
}

export default function TinDisplay({ tin }: TinDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = tin;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border-2 border-cu-red bg-white px-8 py-6 text-center shadow-card-md print:shadow-none">
      <p className="text-xs font-semibold uppercase tracking-widest text-cu-muted mb-2">
        Your Tax Identification Number
      </p>
      <p
        className="text-4xl font-bold tracking-widest text-cu-red font-mono select-all"
        aria-label={`TIN: ${tin}`}
      >
        {tin}
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-md border border-cu-border px-4 py-2 text-sm font-medium text-cu-text hover:bg-gray-50 transition-colors"
          aria-label="Copy TIN to clipboard"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 text-cu-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md border border-cu-border px-4 py-2 text-sm font-medium text-cu-text hover:bg-gray-50 transition-colors"
          aria-label="Print TIN"
        >
          <svg className="h-4 w-4 text-cu-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}
