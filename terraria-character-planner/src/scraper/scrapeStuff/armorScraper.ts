import * as cheerio from 'cheerio';
import axios from 'axios';
import {
  Debuffs,
  Buffs,
  Rarity,
  Item,
  DroppedBy,
  Summons,
} from '../types/types';
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
import { scrapeCalamityInfobox } from './calInfoboxScraper.js';

interface ArmorPiece {
  img: string | undefined;
  name: string | undefined;
  type: string | undefined;
  defense: string | undefined;
  bodySlot: string | undefined;
  tooltip: string[][];
  rarity: Rarity | undefined;
}

interface Armor extends Item {
  defense: string | undefined;
  set: ArmorPiece[];
}

const scrapeSet = (html: string) => {
  const $ = cheerio.load(html);
  const armorPieces: ArmorPiece[] = [];

  $('div.infobox.item').each((i, el) => {
    const armorPiece: ArmorPiece = {
      img: undefined,
      name: undefined,
      type: undefined,
      defense: undefined,
      bodySlot: undefined,
      tooltip: [],
      rarity: undefined,
    };
    const isFullArmor = $(el)
      .find('div.title')
      .first()
      .text()
      .toLowerCase()
      .includes('armor');

    if (isPCVersion(el) && !isFullArmor) {
      armorPiece.name = getName(el);
      armorPiece.img = getImg(el);

      $(el)
        .find('tr')
        .each((i, el) => {
          const lowerLabel = getLabelToLower(el);
          const value = $(el).find('td').text();
          switch (lowerLabel) {
            case 'type':
              armorPiece.type = getType(el);
              break;
            case 'defense':
              armorPiece.defense = value;
              break;
            case 'body slot':
              armorPiece.bodySlot = value;
              break;
            case 'tooltip':
              armorPiece.tooltip = getTooltip(el);
              break;

            case 'rarity':
              armorPiece.rarity = getRarity(el);
              break;

            default:
              break;
          }
        });

      armorPieces.push(armorPiece);
    }
  });
  return armorPieces;
};
export const scrapeArmor = async (
  url: string,
  id?: number,
  isModded: boolean = false
): Promise<Armor> => {
  const armor: Armor = {
    id,
    img: undefined,
    name: undefined,
    type: undefined,
    defense: undefined,
    tooltip: [],
    debuffs: [],
    buffs: [],
    rarity: undefined,
    projectiles: [],
    crafting: [],
    usedIn: [],
    set: [],
    droppedBy: [],
    summons: [],
  };
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
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $('div.infobox.item').each((i, el) => {
    const isFullArmor = $(el)
      .find('div.title')
      .first()
      .text()
      .toLowerCase()
      .includes('armor');
    if (isPCVersion(el) && isFullArmor) {
      armor.img = getImg(el);
      armor.name = getName(el);
      let buffActive: boolean;
      $(el)
        .find('tr')
        .each((i, el) => {
          const lowerLabel = getLabelToLower(el);
          const value = $(el).find('td').text();

          switch (lowerLabel) {
            case 'type':
              armor.type = getType(el);
              break;

            case 'defense':
              armor.defense = value;
              break;

            case 'set bonus':
              armor.tooltip = getTooltip(el);
              break;

            case 'tooltip':
              armor.tooltip = getTooltip(el);
              break;

            case isModded ? 'inflicts debuff' : 'debuff':
              buffActive = false;
              debuffs.img = getImg(el);
              debuffs.name = getImgName(el);
              debuffs.chance = getDebuffChance(el);
              break;

            case 'debuff tooltip':
              debuffs.tooltip = value;
              if (isModded) armor.debuffs?.push({ ...debuffs });
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
                armor.debuffs?.push({ ...debuffs });
              }

              if (buffActive === true) {
                buffs.duration = value;
                armor.buffs?.push({ ...buffs });
              }
              break;

            case 'buff tooltip':
              buffs.tooltip = value;
              if (isModded) armor.buffs?.push({ ...buffs });
              break;

            case 'buff duration':
              buffs.duration = value;
              break;

            case 'rarity':
              armor.rarity = getRarity(el);
              break;

            default:
              break;
          }
        });

      armor.projectiles = getProjectiles(el);
    }
  });
  armor.set = scrapeSet(data);

  if (isModded) {
    const [crafting, usedIn] = scrapeCrafting(data, true);
    const { droppedBy, summons } = scrapeCalamityInfobox(data);
    armor.crafting = crafting;
    armor.usedIn = usedIn;
    armor.droppedBy = [droppedBy as DroppedBy];
    armor.summons = [summons as Summons];
    return armor;
  }

  const [crafting, usedIn] = scrapeCrafting(data);
  armor.crafting = crafting;
  armor.usedIn = usedIn;
  armor.droppedBy = scrapeDroppedBy(data);
  return armor;
};
