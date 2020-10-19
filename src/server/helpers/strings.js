export function collapseWhitespace(text) {
  return text
    .replace(/^ +/gm, '')
    .replace(/ +$/gm, '')
    .replace(/ +/, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
