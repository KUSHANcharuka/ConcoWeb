"use client";

import { useEffect, useRef } from "react";

export function DocusealBuilderEmbed({
  scriptUrl,
  token,
  onSave,
  onSend,
}: {
  scriptUrl: string;
  token: string;
  onSave?: (detail: unknown) => void;
  onSend?: (detail: unknown) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptId = `docuseal-builder-script-${btoa(scriptUrl).replace(/=/g, "")}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);
    }

    const element = document.createElement("docuseal-builder");
    element.setAttribute("data-token", token);
    element.className = "block min-h-[760px]";

    const handleSave = (event: Event) => {
      onSave?.((event as CustomEvent).detail);
    };
    const handleSend = (event: Event) => {
      onSend?.((event as CustomEvent).detail);
    };

    element.addEventListener("save", handleSave);
    element.addEventListener("send", handleSend);

    const container = containerRef.current;
    container?.replaceChildren(element);

    return () => {
      element.removeEventListener("save", handleSave);
      element.removeEventListener("send", handleSend);
      container?.replaceChildren();
    };
  }, [onSave, onSend, scriptUrl, token]);

  return <div className="min-h-[760px]" ref={containerRef} />;
}
