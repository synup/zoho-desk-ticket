/**
 * Define React Refresh globals when missing (e.g. when widget is loaded as a plain script
 * without Vite's dev server). Prevents "$RefreshSig$ is not defined" in production or
 * when dist/ticket-widget.js is loaded from test.html.
 */
if (typeof window !== 'undefined') {
  (window as any).$RefreshSig$ = (window as any).$RefreshSig$ ?? (() => (type: unknown) => type);
  (window as any).$RefreshReg$ = (window as any).$RefreshReg$ ?? (() => {});
}
