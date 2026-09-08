import { format } from "date-fns";

/**
 * The only sanctioned Date -> "yyyy-MM-dd" conversion.
 *
 * Every Date in Pikul is local midnight. `toISOString()` converts to UTC
 * first, so anywhere east of Greenwich — Malaysia included — it hands back
 * yesterday, and every event happening today silently vanishes from the
 * calculation. Reach for this instead.
 */
export const toISODate = (d: Date): string => format(d, "yyyy-MM-dd");
