export const formatDate = (
  dateString: string,
  withTime: boolean = true,
  timeOnly: boolean = false
) => {
  const date = new Date(dateString);

  // Extract components
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Combine into desired format
  if (withTime && !timeOnly) {
    return `${formattedDate} at ${time}`;
  } else if (timeOnly) {
    return `${time}`;
  }
  return `${formattedDate}`;
};
