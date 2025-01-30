export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Extract components
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Combine into desired format
  return `${formattedDate} at ${time}`;
};
