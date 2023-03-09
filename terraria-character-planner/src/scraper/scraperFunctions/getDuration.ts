import * as cheerio from 'cheerio';

export const getDuration = (el: cheerio.Element) => {
  const $ = cheerio.load(el);
  const text = $('td').text();
  const pcIndex = text.indexOf('/');
  if (pcIndex === -1) {
    if (text.includes('(')) {
      const bracketIndex = text.indexOf('(');
      return text.slice(0, bracketIndex).trim();
    }
    return text;
  }

  return text.slice(0, pcIndex).trim();
};
