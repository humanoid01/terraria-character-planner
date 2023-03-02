import * as cheerio from 'cheerio';

export const isPCVersion = (el: cheerio.Element): boolean | null => {
  const $ = cheerio.load(el);
  const version = $('span.eico').first().attr('title')?.toLowerCase();

  if (!version) return null;
  if (version.includes('pc')) return true;
  if (version.includes('old')) return false;

  return null;
};
