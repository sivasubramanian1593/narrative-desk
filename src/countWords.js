export function countWords(text) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    return 0;
  }

  return trimmedText.split(/\s+/u).length;
}
