import * as cheerio from 'cheerio';

export const getName = (el: cheerio.Element): string => {
  const $ = cheerio.load(el);

  return $(el).find('.title').first().text();
};
