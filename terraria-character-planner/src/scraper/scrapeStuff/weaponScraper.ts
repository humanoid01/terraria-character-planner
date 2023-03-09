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

interface Weapon extends Item {
  damage: string | undefined;
  mana: string | undefined;
  useTime: string | undefined;
  knockback: string | undefined;
  critChance: string | undefined;
  velocity: string | undefined;
}

const getDamage = (el: cheerio.Element) => {
  const $ = cheerio.load(el);
  const text = $('td').text();
  const pcIndex = text.indexOf('/');
  if (pcIndex === -1) return text;
  return text.slice(0, pcIndex).trim() + ' (Melee)';
};

export const scrapeWeapon = async (
  url: string,
  id?: number,
  isModded: boolean = false
) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
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
  const weapon: Weapon = {
    id: undefined,
    img: undefined,
    name: undefined,
    type: undefined,
    damage: undefined,
    mana: undefined,
    useTime: undefined,
    knockback: undefined,
    critChance: undefined,
    velocity: undefined,
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

  $('div.infobox.item').each((i, el) => {
    if (isPCVersion(el) || isModded) {
      let buffActive: boolean;
      weapon.img = getImg(el);
      weapon.name = getName(el);
      $(el)
        .find('tr')
        .each((i, el) => {
          const lowerLabel = getLabelToLower(el);
          const value = $(el).find('td').text();

          switch (lowerLabel) {
            case 'damage':
              weapon.damage = getDamage(el);
              break;

            case 'mana':
              weapon.mana = value;
              break;

            case 'use time':
              weapon.useTime = value;
              break;

            case 'knockback':
              weapon.knockback = value;
              break;

            case 'critical chance':
              weapon.critChance = value;
              break;

            case 'velocity':
              weapon.velocity = value;
              break;

            case 'type':
              weapon.type = getType(el);
              break;

            case 'tooltip':
              weapon.tooltip = getTooltip(el);
              break;

            case isModded ? 'inflicts debuff' : 'debuff':
              buffActive = false;
              debuffs.img = getImg(el);
              debuffs.name = getImgName(el);
              debuffs.chance = getDebuffChance(el);
              break;

            case 'debuff tooltip':
              debuffs.tooltip = value;
              if (isModded) weapon.debuffs?.push({ ...debuffs });
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
                weapon.debuffs?.push({ ...debuffs });
              }

              if (buffActive === true) {
                buffs.duration = value;
                weapon.buffs?.push({ ...buffs });
              }
              break;

            case 'buff tooltip':
              buffs.tooltip = value;
              if (isModded) weapon.buffs?.push({ ...buffs });
              break;

            case 'buff duration':
              buffs.duration = value;
              break;

            case 'rarity':
              weapon.rarity = getRarity(el);
              break;

            default:
              break;
          }
        });
    }

    weapon.projectiles = getProjectiles(el);
  });

  weapon.crafting = scrapeCrafting(data)[0];
  weapon.usedIn = scrapeCrafting(data)[1];

  weapon.droppedBy = scrapeDroppedBy(data);

  console.log(weapon);
};

scrapeWeapon('https://terraria.fandom.com/wiki/Daybreak');
