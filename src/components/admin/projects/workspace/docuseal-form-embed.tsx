"use client";

import { useEffect, useRef } from "react";

export function DocusealFormEmbed({
  scriptUrl,
  src,
  email,
}: {
  scriptUrl: string;
  src: string;
  email?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptId = `docuseal-form-script-${btoa(scriptUrl).replace(/=/g, "")}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);
    }

    const element = document.createElement("docuseal-form");
    element.setAttribute("data-src", src);
    if (email) {
      element.setAttribute("data-email", email);
    }
    element.className = "block min-h-[760px]";

    const container = containerRef.current;
    container?.replaceChildren(element);

    return () => {
      container?.replaceChildren();
    };
  }, [email, scriptUrl, src]);

  return <div className="min-h-[760px]" ref={containerRef} />;
}
