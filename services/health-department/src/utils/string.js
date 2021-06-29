export const truncateString = (string, maxLength) => {
  const maxLengthValue = maxLength == null ? 10 : maxLength;
  return string.length > maxLengthValue
    ? `${string.slice(0, maxLengthValue)}...`
    : string;
};

export const sortByNameAsc = locations =>
  locations.sort((location1, location2) => {
    if (location1.name === location2.name) return 0;
    return location1.name > location2.name ? 1 : -1;
  });
