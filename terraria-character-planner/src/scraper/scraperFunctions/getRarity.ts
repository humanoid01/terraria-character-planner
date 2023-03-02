import * as cheerio from 'cheerio';
import { getImg } from './getImg.js';

export const getRarity = (
  el: cheerio.Element
): { img: string; tier: string } | undefined => {
  const $ = cheerio.load(el);
  const img = getImg(el);
  let tier = $(el).find('img').first().attr('alt');

  if (img && tier) return { img, tier: tier[tier.length - 1] };

  return;
};
