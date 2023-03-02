import * as cheerio from 'cheerio';
import { transformType } from './transformType.js';

export const getType = (el: cheerio.Element | null): string | undefined => {
  if (!el) return;
  const $ = cheerio.load(el);

  const type = transformType($(el).find('td').first().html() as string);

  return type.length ? type : undefined;
};
