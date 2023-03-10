import * as cheerio from 'cheerio';

export const getImgName = (el: cheerio.Element): string | undefined => {
  const $ = cheerio.load(el);

  const imgName = $(el).find('img').first().attr('alt')?.length
    ? $(el).find('img').first().attr('alt')
    : $(el).find('img').first().attr('data-image-key');

  if (imgName?.includes('.png')) return imgName.slice(0, -4);
  if (imgName?.includes('.gif')) return imgName.slice(0, -4);

  return imgName;
};
