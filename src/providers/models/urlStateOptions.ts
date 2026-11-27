export interface UrlStateOptions {
  /** Committed choices push by default; replace is for transient normalization. */
  replace?: boolean;
  /** Reset dependent view parameters in the same history entry. */
  clearParams?: readonly string[];
}
