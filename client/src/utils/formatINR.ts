export function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000)    return `₹${(amount / 1_00_000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPricePerSqft(totalPrice: number, areaSqft: number): string {
  const perSqft = Math.round(totalPrice / areaSqft);
  return `₹${perSqft.toLocaleString('en-IN')}/sq.ft`;
}
