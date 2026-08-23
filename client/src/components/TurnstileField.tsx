import { useEffect, useId, useRef } from "react";
import { turnstileSiteKey } from "@/lib/staticEnquiry";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<TurnstileApi> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileLoader) {
    turnstileLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not initialise.")));
      script.onerror = () => reject(new Error("Unable to load verification."));
      document.head.appendChild(script);
    });
  }
  return turnstileLoader;
}

type TurnstileFieldProps = {
  onToken: (token: string) => void;
  onError?: () => void;
  resetKey: string | number;
};

export function TurnstileField({ onToken, onError, resetKey }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const instanceId = useId();

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onError, onToken]);

  useEffect(() => {
    let active = true;
    let api: TurnstileApi | undefined;

    loadTurnstile()
      .then((loadedApi) => {
        if (!active || !containerRef.current) return;
        api = loadedApi;
        widgetIdRef.current = loadedApi.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => {
            onTokenRef.current("");
            onErrorRef.current?.();
          },
        });
      })
      .catch(() => onErrorRef.current?.());

    return () => {
      active = false;
      if (api && widgetIdRef.current) api.remove(widgetIdRef.current);
    };
  }, [instanceId, resetKey]);

  return <div aria-label="Spam protection" className="min-h-[65px]" ref={containerRef} data-testid="turnstile-widget" />;
}
