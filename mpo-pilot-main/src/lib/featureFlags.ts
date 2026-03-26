/** Show Miiddle in sidebar when VITE_ENABLE_MIIDDLE is true or 1 */
export function isMiiddleNavEnabled(): boolean {
  const v = import.meta.env.VITE_ENABLE_MIIDDLE;
  return v === "true" || v === "1";
}
