import * as cheerio from 'cheerio';
import axios from 'axios';
import { Buffs, Debuffs, Item } from '../types/types';
import { getTooltip } from '../scraperFunctions/getTooltip.js';
import { getImg } from '../scraperFunctions/getImg.js';
import { getRarity } from '../scraperFunctions/getRarity.js';
import { isPCVersion } from './../scraperFunctions/isPCVersion.js';
import { getName } from '../scraperFunctions/getName.js';
import { getType } from '../scraperFunctions/getType.js';
import { getLabelToLower } from '../scraperFunctions/getLabelToLower.js';
import { getImgName } from '../scraperFunctions/getImgName.js';
import { getDebuffChance } from '../scraperFunctions/getDebuffChance.js';
import { getProjectiles } from '../scraperFunctions/getProjectiles.js';
import { scrapeCrafting } from './craftingScraper.js';
import { scrapeDroppedBy } from './droppedByScraper.js';

interface Accessory extends Item {
  defense: string | undefined;
  bodySlot: string | undefined;
  damage: string | undefined;
}

const getDamage = (el: cheerio.Element) => {
  const $ = cheerio.load(el);
  const text = $('td').text();
  const pcIndex = text.indexOf('/');
  if (pcIndex === -1) return text;
  return text.slice(0, pcIndex).trim();
};

export const scraperAccessory = async (
  url: string,
  id?: number,
  isModded: boolean = false
) => {
  const buffs: Buffs = {
    name: undefined,
    img: undefined,
    duration: undefined,
    tooltip: undefined,
  };
  const debuffs: Debuffs = {
    name: undefined,
    img: undefined,
    chance: undefined,
    duration: undefined,
    tooltip: undefined,
  };
  const accessory: Accessory = {
    id: undefined,
    img: undefined,
    name: undefined,
    type: undefined,
    damage: undefined,
    bodySlot: undefined,
    defense: undefined,
    tooltip: [],
    debuffs: [],
    buffs: [],
    rarity: undefined,
    projectiles: [],
    crafting: [],
    usedIn: [],
    droppedBy: [],
    summons: [],
  };
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $('div.infobox.item').each((i, el) => {
    if (isPCVersion(el) || isModded) {
      let buffActive: boolean;
      accessory.img = getImg(el);
      accessory.name = getName(el);
      $(el)
        .find('tr')
        .each((i, el) => {
          const lowerLabel = getLabelToLower(el);
          const value = $(el).find('td').text();

          switch (lowerLabel) {
            case 'damage':
              accessory.damage = getDamage(el);
              break;

            case 'defense':
              accessory.defense = value;
              break;

            case 'body slot':
              accessory.bodySlot = value;
              break;

            case 'type':
              accessory.type = getType(el);
              break;

            case 'tooltip':
              accessory.tooltip = getTooltip(el);
              break;

            case isModded ? 'inflicts debuff' : 'debuff':
              buffActive = false;
              debuffs.img = getImg(el);
              debuffs.name = getImgName(el);
              debuffs.chance = getDebuffChance(el);
              break;

            case 'debuff tooltip':
              debuffs.tooltip = value;
              if (isModded) accessory.debuffs?.push({ ...debuffs });
              break;

            case 'chance':
              debuffs.chance = getDebuffChance(el);
              break;

            case 'debuff duration':
              debuffs.duration = value;
              break;

            case isModded ? 'grants buff' : 'buff':
              buffActive = true;
              buffs.img = getImg(el);
              buffs.name = $(el).children('td').find('img').attr('alt');
              break;

            case 'duration':
              if (buffActive === false) {
                debuffs.duration = value;
                accessory.debuffs?.push({ ...debuffs });
              }

              if (buffActive === true) {
                buffs.duration = value;
                accessory.buffs?.push({ ...buffs });
              }
              break;

            case 'buff tooltip':
              buffs.tooltip = value;
              if (isModded) accessory.buffs?.push({ ...buffs });
              break;

            case 'buff duration':
              buffs.duration = value;
              break;

            case 'rarity':
              accessory.rarity = getRarity(el);
              break;

            default:
              break;
          }
        });
    }

    accessory.projectiles = getProjectiles(el);
  });

  const [crafting, usedIn] = scrapeCrafting(data);

  accessory.crafting = crafting;
  accessory.usedIn = usedIn;

  accessory.droppedBy = scrapeDroppedBy(data);
};

scraperAccessory('https://terraria.fandom.com/wiki/Bee_Cloak');
