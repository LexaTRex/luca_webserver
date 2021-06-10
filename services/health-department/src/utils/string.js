export const truncateString = (string, maxLength) => {
  const maxLengthValue = maxLength == null ? 10 : maxLength;
  return string.length > maxLengthValue
    ? `${string.slice(0, maxLengthValue)}...`
    : string;
};
