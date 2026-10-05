const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Formats a rupee amount with Indian digit grouping, e.g. 1284500 → "₹12,84,500". */
export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Short form for chart axes, e.g. 245000 → "₹2.5L". */
export function formatINRCompact(amount: number): string {
  return `₹${compactFormatter.format(amount)}`;
}
