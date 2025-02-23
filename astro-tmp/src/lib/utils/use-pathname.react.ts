import { useSyncExternalStore } from "react";

export function usePathname(): string {
  return useSyncExternalStore(
    (onChange) => {
      const abortController = new AbortController();

      window.addEventListener(
        "astro:page-load",
        () => {
          onChange();
        },
        { signal: abortController.signal },
      );

      return () => {
        abortController.abort();
      };
    },
    () => window.location.pathname,
    () => "",
  );
}
