import * as cheerio from 'cheerio';
import { transformTooltip } from './transformTooltip.js';

export const getTooltip = (el: cheerio.Element): string[][] => {
  const $ = cheerio.load(el);
  const itemDescription: string[][] = [];
  // let toolTags: string[] | undefined = undefined;

  if ($(el).find('i').first().find('span.key').length) {
    const toolTags = $(el)
      .find('i')
      .first()
      .html()
      ?.split('<br>')
      .map(t => transformTooltip(t));

    return [toolTags as []];
  }

  $(el)
    .find('i')
    .first()
    .find('span')
    .each((i, el) => {
      const tooltipDesc = $(el)
        .html()
        ?.split('<br>')
        .map(t => transformTooltip(t));

      if (tooltipDesc) itemDescription.push(tooltipDesc);
    });

  const toolTags = $(el)
    .find('i')
    .first()
    .html()
    ?.split('<br>')
    .map(t => transformTooltip(t));

  return itemDescription.length ? itemDescription : [toolTags as []];
};
