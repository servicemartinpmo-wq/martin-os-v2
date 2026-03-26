import "@testing-library/jest-dom";

// jsdom (Vitest) does not implement AbortSignal.timeout (Node 18+ / browsers do)
if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout !== "function") {
  (AbortSignal as unknown as { timeout(ms: number): AbortSignal }).timeout = function timeout(ms: number) {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), ms);
    return ctrl.signal;
  };
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
