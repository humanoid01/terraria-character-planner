import * as cheerio from 'cheerio';

export const getDebuffChance = (el: cheerio.Element): string | undefined => {
  const $ = cheerio.load(el);

  const debuffChance = $(el).children('td').find('.note').text().length
    ? $(el).children('td').find('.note').text()
    : vanillaDebuff(el);

  return debuffChance;
};

const vanillaDebuff = (el: cheerio.Element): string | undefined => {
  const $ = cheerio.load(el);
  const text = $(el).find('td').first().text();
  const transfromText = (text: string) => {
    const endIndex = text.indexOf('/');

    return text.slice(0, endIndex).trim();
  };
  return transfromText(text);
};
