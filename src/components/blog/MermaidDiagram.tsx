import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
  id: string;
}

export function MermaidDiagram({ code, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            background: "transparent",
            primaryColor: "#1f2937",
            primaryTextColor: "#f3f4f6",
            primaryBorderColor: "#374151",
            lineColor: "#6b7280",
            secondaryColor: "#111827",
            tertiaryColor: "#1f2937",
          },
          flowchart: { htmlLabels: true, curve: "basis" },
        });

        const renderId = `mermaid-${id}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(renderId, code);

        if (!cancelled) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
        <code className="text-xs text-muted-foreground">{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="bg-card/50 border border-border rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        <span className="text-sm text-muted-foreground">Loading diagram…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 bg-card/30 border border-border/50 rounded-lg p-6 overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
