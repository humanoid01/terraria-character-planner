import * as cheerio from 'cheerio';

export const getQuantity = (el: cheerio.Element): string => {
  const $ = cheerio.load(el);

  const quantity = $('span.note-text').text().slice(1, -1);

  return quantity;
};
