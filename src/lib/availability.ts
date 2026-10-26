export interface AvailabilityFreshness {
  label: string;
  isStale: boolean;
  dateLabel: string;
}

export function getAvailabilityFreshness(
  updatedAt: string,
): AvailabilityFreshness {
  const timestamp = Date.parse(updatedAt);

  if (!Number.isFinite(timestamp)) {
    return {
      label: "Update date unavailable",
      isStale: true,
      dateLabel: "Date not provided",
    };
  }

  const ageInDays = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000)),
  );
  const dateLabel = new Date(timestamp).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });

  if (ageInDays === 0) {
    return { label: "Updated today", isStale: false, dateLabel };
  }

  if (ageInDays === 1) {
    return { label: "Updated yesterday", isStale: false, dateLabel };
  }

  if (ageInDays <= 7) {
    return {
      label: `Updated ${ageInDays} days ago`,
      isStale: false,
      dateLabel,
    };
  }

  return {
    label: `Last updated ${dateLabel}`,
    isStale: true,
    dateLabel,
  };
}
