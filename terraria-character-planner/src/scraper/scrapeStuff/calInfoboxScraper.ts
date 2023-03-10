import * as cheerio from 'cheerio';
import { Summons, DroppedBy } from './../types/types';
import { transformLink } from './../scraperFunctions/transformLink.js';

export const scrapeCalamityInfobox = (
  html: string
): { droppedBy: DroppedBy | undefined; summons: Summons | undefined } => {
  const $ = cheerio.load(html);
  const infobox = $('table.infobox');

  const droppedBy: DroppedBy = {
    itemsName: [],
    entityImg: undefined,
    entityName: undefined,
    quantity: undefined,
    rate: undefined,
  };

  const summons: Summons = {
    name: undefined,
    img: undefined,
  };

  infobox.each((i, el) => {
    const label = $(el).find('th').first().text();

    if (label.toLowerCase().includes('drop')) {
      $(el)
        .find('tr')
        .each((i, el) => {
          if (i === 2) {
            $(el)
              .find('td')
              .each((i, el) => {
                // entity
                if (i === 0) {
                  droppedBy.entityName = $(el).text();
                }
                // quantity
                if (i === 1) {
                  droppedBy.quantity = $(el).text();
                }
                // rate
                if (i === 2) {
                  droppedBy.rate = $(el).text();
                }
              });
          }
        });
    } else {
      $(el)
        .find('tr')
        .each((i, el) => {
          const img = $(el).find('img').attr('data-src')?.length
            ? $(el).find('img').attr('data-src')
            : $(el).find('img').attr('src');

          summons.img = transformLink(img);
          summons.name = $(el).find('img').attr('alt')?.slice(0, -4);
        });
    }
  });

  if (
    !droppedBy.entityName &&
    !droppedBy.quantity &&
    !droppedBy.rate &&
    !summons.img &&
    !summons.name
  )
    return { droppedBy: undefined, summons: undefined };

  if (!droppedBy.entityName && !droppedBy.quantity && !droppedBy.rate)
    return { droppedBy: undefined, summons };

  if (!summons.img && !summons.name) return { droppedBy, summons: undefined };

  return { droppedBy, summons };
};
