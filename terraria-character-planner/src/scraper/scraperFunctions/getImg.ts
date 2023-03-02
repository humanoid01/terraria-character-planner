import * as cheerio from 'cheerio';
import { transformLink } from './transformLink.js';

export const getImg = (el: cheerio.Element): string | undefined => {
  const $ = cheerio.load(el);

  const img = $(el).find('img').first().attr('data-src')?.length
    ? $(el).find('img').first().attr('data-src')
    : $(el).find('img').first().attr('src');

  return transformLink(img);
};
