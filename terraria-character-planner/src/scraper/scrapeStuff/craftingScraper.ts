import * as cheerio from 'cheerio';
import { Crafting, CraftingStation, Ingredient } from './../types/types';
import { getImg } from '../scraperFunctions/getImg.js';
import { getImgName } from '../scraperFunctions/getImgName.js';
import { getQuantity } from './../scraperFunctions/getQuantity.js';
import { isPCVersion } from './../scraperFunctions/isPCVersion.js';
export const scrapeCrafting = (data: string): Crafting[][] => {
  const $ = cheerio.load(data);
  const usedIn: Crafting[] = [];
  const crafting: Crafting[] = [];
  $('table.crafts table tbody').each((i, el) => {
    if (i === 0) {
      crafting.push(...getRecipe(el));
    } else {
      usedIn.push(...getRecipe(el));
    }
  });

  // console.log('CRAFTING', crafting, 'USED IN', usedIn);
  return [crafting, usedIn];
};

const getRecipe = (el: cheerio.Element): Crafting[] => {
  const $ = cheerio.load(el);
  const craftings: Crafting[] = [];
  const crafting: Crafting = {
    ingredients: [],
    result: undefined,
    cStations: [],
  };

  if (isPCVersion(el)) {
    // use as reference
    crafting.cStations = getCraftingStations(el);

    $(el)
      .find('tr')
      .each((i, el) => {
        crafting.ingredients = getIngredients(el);
        crafting.result = getResult(el);
        if (crafting.ingredients.length) craftings.push({ ...crafting });
      });
  }

  // craftings.forEach(el => console.log(el.ingredients));

  return craftings;
};

const getCraftingStations = (el: cheerio.Element): CraftingStation[] => {
  const $ = cheerio.load(el);
  const craftingStations: CraftingStation[] = [];

  $(el)
    .find('td.station')
    .children('span')
    .each((i, el) => {
      const craftingStation: CraftingStation = {
        img: undefined,
        name: undefined,
      };
      craftingStation.img = getImg(el);
      craftingStation.name = getImgName(el);
      craftingStations.push({ ...craftingStation });
    });

  return craftingStations;
};

const getIngredients = (el: cheerio.Element): Ingredient[][] => {
  const $ = cheerio.load(el);
  const ingredients: Ingredient[][] = [];

  $(el)
    .find('td.ingredients li')
    .each((i, el) => {
      const ingredient: Ingredient = {
        img: undefined,
        name: undefined,
        quantity: undefined,
      };
      if (isPCVersion(el)) {
        const ing = $(el).find('span.i');

        if (ing.length > 1) {
          const possibleIngredients: Ingredient[] = [];
          ing.each((i, el) => {
            ingredient.img = getImg(el);
            ingredient.name = getImgName(el);
            possibleIngredients.push({ ...ingredient });
          });
          ingredients.push(possibleIngredients);
        } else {
          ingredient.img = getImg(el);
          ingredient.name = getImgName(el);
          ingredient.quantity = getQuantity(el);
          ingredients.push([ingredient]);
        }
      }
    });
  return ingredients;
};

const getResult = (el: cheerio.Element) => {
  const $ = cheerio.load(el);
  const result: Ingredient = {
    img: undefined,
    name: undefined,
    quantity: undefined,
  };

  $(el)
    .find('.result span.i')
    .each((i, el) => {
      result.img = getImg(el);
      result.name = getImgName(el);
      result.quantity = getQuantity(el);
    });

  return result;
};
