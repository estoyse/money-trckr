const formatNumber = (amount: number): string => {
  if (amount === 0) return "0 UZS";

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  // Use regular formatting for numbers under 10,000
  if (absAmount < 10_000) {
    return `${sign}${absAmount.toLocaleString("uz-UZ")} UZS`;
  }

  const units = ["", "K", "M", "B", "T"];
  const thresholds = [1, 1_000, 1_000_000, 1_000_000_000, 1_000_000_000_000];

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (absAmount >= thresholds[i]) {
      const shortNum = absAmount / thresholds[i];
      const formatted =
        shortNum >= 100
          ? Math.floor(shortNum).toString()
          : shortNum.toFixed(
              Math.min(2, Math.max(1, 2 - Math.floor(Math.log10(shortNum))))
            );
      const result = formatted.replace(".", ",");

      return `${sign}${result}${units[i]} UZS`;
    }
  }

  return `${sign}${absAmount} UZS`;
};

export default formatNumber;
