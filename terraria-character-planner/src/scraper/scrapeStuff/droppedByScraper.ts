import * as cheerio from 'cheerio';
import { DroppedBy } from '../types/types';
import { getImg } from '../scraperFunctions/getImg.js';
import { getImgName } from '../scraperFunctions/getImgName.js';
import { isPCVersion } from '../scraperFunctions/isPCVersion.js';

export const scrapeDroppedBy = (html: string): DroppedBy[] => {
  const $ = cheerio.load(html);
  const allDrops: DroppedBy[] = [];

  $('div.drop').each((i, el) => {
    const droppedBy: DroppedBy = {
      itemsName: [],
      entityName: undefined,
      entityImg: undefined,
      quantity: undefined,
      rate: undefined,
    };

    $(el)
      .find('div.title a')
      .each((i, el) => {
        const imgName = getImgName(el);
        if (imgName) droppedBy.itemsName.push(imgName);
      });

    $(el)
      .find('tbody tr')
      .each((i, el) => {
        // skip first iteration because there's no useful data
        if (i === 0) return;
        if (isPCVersion(el)) {
          droppedBy.entityImg = getImg(el);
          droppedBy.entityName = getImgName(el);
          droppedBy.quantity = getDroppedByQuantity(el);
          droppedBy.rate = getDroppedByRate(el);
          if (
            droppedBy.entityImg ||
            droppedBy.entityName ||
            droppedBy.quantity ||
            droppedBy.rate
          )
            allDrops.push({ ...droppedBy });
        }
      });
  });
  return allDrops;
};

const getDroppedByRate = (el: cheerio.Element): string => {
  const $ = cheerio.load(el);
  let text = '';
  let firstRateIndex = 0;
  $(el)
    .find('td')
    .each((i, el) => {
      if (i === 2) {
        text = $(el).text();
        firstRateIndex = text.indexOf('%');
      }
    });
  return text.slice(0, firstRateIndex);
};
const getDroppedByQuantity = (el: cheerio.Element): string => {
  const $ = cheerio.load(el);
  let text = '';
  $(el)
    .find('td')
    .each((i, el) => {
      if (i === 1) {
        text = $(el).text();
      }
    });

  return text;
};
