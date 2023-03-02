import * as cheerio from 'cheerio';

export const getLabelToLower = (el: cheerio.Element): string => {
  const $ = cheerio.load(el);

  return $(el).find('th').text().toLowerCase();
};
