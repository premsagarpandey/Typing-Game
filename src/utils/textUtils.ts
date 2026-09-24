/**
 * Sanitizes and normalizes arbitrary text (such as custom pasted text,
 * quotes from external sources, or web articles) into clean, typable text.
 *
 * - Replaces newlines (\r\n, \r, \n) and tabs (\t) with spaces so paragraphs flow seamlessly.
 * - Converts typographic / smart curly quotes (‘ ’ “ ”) into standard ASCII quotes (' ").
 * - Converts em-dashes and en-dashes (— –) into standard hyphens (-).
 * - Removes zero-width characters and non-breaking spaces.
 * - Collapses multiple consecutive spaces into a single space.
 * - Trims leading and trailing whitespace.
 */
export function sanitizeCustomText(raw: string): string {
  if (!raw) return '';

  return raw
    // Normalize line breaks & tabs to single spaces
    .replace(/\r\n/g, ' ')
    .replace(/[\r\n\t]/g, ' ')
    // Replace typographic / curly quotes with standard ASCII
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace em-dash and en-dash with standard hyphen
    .replace(/[\u2013\u2014]/g, '-')
    // Replace non-breaking spaces and zero-width characters
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Collapse multiple spaces into one
    .replace(/ {2,}/g, ' ')
    .trim();
}
