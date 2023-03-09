import * as cheerio from 'cheerio';

export const isPCVersion = (el: cheerio.Element): boolean => {
  const $ = cheerio.load(el);
  const version = $('span.eico').first().attr('title')?.toLowerCase();
  const divVersion = $('div.version-note');

  if (divVersion.text().length) {
    let pcVer = false;
    divVersion.find('a').each((i, el) => {
      const ver = $(el).attr('title')?.toLowerCase();
      if (ver?.includes('pc')) {
        pcVer = true;
      }
    });
    return pcVer;
  }

  if (!version || version.includes('pc')) return true;

  return false;
};
