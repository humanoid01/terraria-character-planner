import * as cheerio from 'cheerio';

export const isPCVersion = (el: cheerio.Element): boolean => {
  const $ = cheerio.load(el);
  const version = $('span.eico').first().attr('title')?.toLowerCase();
  const divVersion = $('div.version-note');

  if (divVersion.text().length) {
    let isPC = false;
    divVersion.find('a').each((i, el) => {
      const ver = $(el).attr('title');
      if (ver?.includes('pc')) isPC = true;
    });
    return isPC;
  }

  if (!version) return true;
  if (version.includes('pc')) return true;

  return false;
};
