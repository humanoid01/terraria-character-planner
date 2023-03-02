import * as cheerio from 'cheerio';
import axios from 'axios';
import {
  Debuffs,
  Buffs,
  Projectile,
  Crafting,
  DroppedBy,
  Summons,
  Rarity,
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

interface ArmorPiece {
  img: string | undefined;
  name: string | undefined;
  type: string | undefined;
  defense: string | undefined;
  bodySlot: string | undefined;
  tooltip: string[][];
  rarity: Rarity | undefined;
}

interface Armor {
  img: string | undefined;
  name: string | undefined;
  type: string | undefined;
  defense: string | undefined;
  setBonus: string[][];
  debuffs: Debuffs[];
  buffs: Buffs[];
  rarity: Rarity | undefined;
  projectiles: Projectile[];
  crafting: Crafting[];
  usedIn: Crafting[];
  set: ArmorPiece[];
  helmVars: ArmorPiece[];
  droppedBy: DroppedBy[];
  summons: Summons[];
}

const scrapeArmor = async (
  url: string,
  id?: number,
  isModded: boolean = false
) => {
  const armor: Armor = {
    img: undefined,
    name: undefined,
    type: undefined,
    defense: undefined,
    setBonus: [],
    debuffs: [],
    buffs: [],
    rarity: undefined,
    projectiles: [],
    crafting: [],
    usedIn: [],
    set: [],
    helmVars: [],
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
  const projectile: Projectile = {
    img: undefined,
    name: undefined,
  };

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  $('div.infobox.item').each((i, el) => {
    if (isPCVersion(el) || isModded) {
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
              armor.setBonus = getTooltip(el);
              break;
            case 'tooltip':
              armor.setBonus = getTooltip(el);
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

  console.log(armor);
};

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

    if (isPCVersion(el) === null) {
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

scrapeArmor('https://terraria.fandom.com/wiki/Moon_Lord_Legs');
