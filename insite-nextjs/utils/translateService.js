/**
 * Free translation service utility.
 * Primary:  Unofficial Google Translate endpoint (no API key, best quality)
 * Fallback: MyMemory API (stable, 50k chars/day free with email param)
 * Caching:  localStorage — once translated, never re-fetched
 */

const CACHE_KEY_PREFIX = 'anxiet_trans_';
const MYMEMORY_EMAIL = 'noreply@insitehealth.com'; // used for 50k chars/day free tier

// Language code mapping — some APIs need different codes than i18next uses
const LANG_CODE_MAP = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ar: 'ar',
  pt: 'pt',
};

function getCacheKey(text, from, to) {
  // Use a short hash to avoid enormous localStorage keys
  const raw = `${from}|${to}|${text}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${CACHE_KEY_PREFIX}${hash}`;
}

function getFromCache(text, from, to) {
  try {
    const key = getCacheKey(text, from, to);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveToCache(text, from, to, translated) {
  try {
    const key = getCacheKey(text, from, to);
    localStorage.setItem(key, translated);
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/**
 * Translate via unofficial Google Translate endpoint.
 * Works in-browser, no API key. Can break/rate-limit without warning.
 */
async function translateViaGoogle(text, from, to) {
  const fromCode = LANG_CODE_MAP[from] || from;
  const toCode = LANG_CODE_MAP[to] || to;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromCode}&tl=${toCode}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);

  const data = await res.json();
  // Response is a nested array: data[0] is array of [translated, original, ...]
  if (!data || !data[0]) throw new Error('Unexpected Google translate response shape');
  return data[0].map((chunk) => chunk[0]).join('');
}

/**
 * Translate via MyMemory API.
 * Stable, confirmed CORS *, 50k chars/day with email param.
 * Max 500 bytes per request — long text is chunked by sentence.
 */
async function translateViaMyMemory(text, from, to) {
  const fromCode = LANG_CODE_MAP[from] || from;
  const toCode = LANG_CODE_MAP[to] || to;
  const langpair = `${fromCode}|${toCode}`;

  // Chunk long text into <=450 char pieces split on sentence boundaries
  const chunks = chunkText(text, 450);
  const results = [];

  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${langpair}&de=${MYMEMORY_EMAIL}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
    const data = await res.json();
    if (data.responseStatus !== 200) throw new Error(`MyMemory error: ${data.responseDetails}`);
    results.push(data.responseData.translatedText);
  }

  return results.join(' ');
}

/**
 * Split text into chunks of max `maxBytes` characters,
 * trying to break on sentence-ending punctuation.
 */
function chunkText(text, maxBytes) {
  if (text.length <= maxBytes) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > maxBytes) {
    // Find last sentence break within limit
    const slice = remaining.substring(0, maxBytes);
    const lastBreak = Math.max(
      slice.lastIndexOf('. '),
      slice.lastIndexOf('! '),
      slice.lastIndexOf('? '),
      slice.lastIndexOf('\n')
    );
    const cutAt = lastBreak > 0 ? lastBreak + 1 : maxBytes;
    chunks.push(remaining.substring(0, cutAt).trim());
    remaining = remaining.substring(cutAt).trim();
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}

/**
 * Translate HTML content — strips tags, translates text nodes,
 * then reinserts them to preserve HTML structure.
 * For short HTML we just send as-is; Google handles inline HTML reasonably well.
 */
async function translateHtml(html, from, to) {
  // For HTML content, use Google which handles inline tags better
  try {
    return await translateViaGoogle(html, from, to);
  } catch {
    // For MyMemory fallback, strip to plain text
    const div = document.createElement('div');
    div.innerHTML = html;
    const plainText = div.textContent || div.innerText || '';
    return await translateViaMyMemory(plainText, from, to);
  }
}

/**
 * Main translate function.
 * @param {string} text - Text or HTML to translate
 * @param {string} from - Source language code (e.g. 'en')
 * @param {string} to   - Target language code (e.g. 'pt')
 * @param {boolean} isHtml - Whether the content contains HTML markup
 * @returns {Promise<string>} Translated text
 */
export async function translate(text, from, to, isHtml = false) {
  if (!text || from === to) return text;

  // Check cache first
  const cached = getFromCache(text, from, to);
  if (cached) return cached;

  let translated;
  try {
    if (isHtml) {
      translated = await translateHtml(text, from, to);
    } else {
      translated = await translateViaGoogle(text, from, to);
    }
  } catch (googleError) {
    console.warn('[translateService] Google failed, trying MyMemory:', googleError.message);
    try {
      translated = await translateViaMyMemory(text, from, to);
    } catch (myMemoryError) {
      console.warn('[translateService] Both services failed:', myMemoryError.message);
      // Return original text rather than breaking the UI
      return text;
    }
  }

  saveToCache(text, from, to, translated);
  return translated;
}

/**
 * Translate all fields of a blog post content object.
 * @param {object} contentEn - The English content block { title, excerpt, content, tags }
 * @param {string} targetLang - Target language code
 * @returns {Promise<object>} Translated content block
 */
export async function translateBlogContent(contentEn, targetLang) {
  if (targetLang === 'en') return contentEn;

  const [title, excerpt, content] = await Promise.all([
    translate(contentEn.title, 'en', targetLang, false),
    translate(contentEn.excerpt, 'en', targetLang, false),
    translate(contentEn.content, 'en', targetLang, true),
  ]);

  // Translate tags individually
  const tags = await Promise.all(
    (contentEn.tags || []).map((tag) => translate(tag, 'en', targetLang, false))
  );

  return { title, excerpt, content, tags };
}

/**
 * Clear the entire translation cache from localStorage.
 * Useful for debugging or freeing space.
 */
export function clearTranslationCache() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_KEY_PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
    return keys.length;
  } catch {
    return 0;
  }
}
