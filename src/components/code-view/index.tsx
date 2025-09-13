import * as Prism from "prismjs";
(globalThis as any).Prism = Prism;
import { useEffect, useRef } from "react";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

import "./code-theme.css";

interface Props {
  code: string;
  lang: string; // e.g. "typescript" | "tsx" | "js"
}

export const CodeView = ({ code, lang }: Props) => {
  const codeRef = useRef<HTMLElement>(null);

  // optional: short → full mapping
  const LANG_MAP: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    py: "python",
  };

  const actualLang = LANG_MAP[lang] || lang;

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, actualLang]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code ref={codeRef} className={`language-${actualLang}`}>
        {code}
      </code>
    </pre>
  );
};
