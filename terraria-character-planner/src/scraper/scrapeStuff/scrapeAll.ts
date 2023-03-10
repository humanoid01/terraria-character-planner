import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeWeapon } from './weaponScraper.js';
import { getImgName } from './../scraperFunctions/getImgName.js';
import { scrapeAccessory } from './accessoryScraper.js';
import { isPCVersion } from './../scraperFunctions/isPCVersion.js';
import { scrapeArmor } from './armorScraper.js';

async function getItemsNames(url: string, isModded: boolean) {
  const itemNames: string[] = [];
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  if (isModded) {
    if (url.includes('Armor')) {
      let isMiscFirst = false;
      let isMiscSecond = false;
      $('.mw-parser-output')
        .children()
        .each((i, el) => {
          if ($(el).text().toLowerCase().includes('miscellaneous')) {
            if (isMiscFirst) isMiscSecond = true;
            isMiscFirst = true;
          }
          if (!isMiscSecond) {
            $(el).each((i, el) => {
              $(el)
                .find('tr')
                .each((i, el) => {
                  $(el)
                    .find('td')
                    .each((i, el) => {
                      if (i === 1) {
                        let name = $(el).text();
                        if (name?.includes(' '))
                          name = name.replaceAll(' ', '_');
                        if (name?.includes(`'`))
                          name = name.replaceAll(`'`, '%27');
                        if (name) itemNames.push(name);
                      }
                    });
                });
            });
          }
        });

      return itemNames;
    } else {
      const table = $('table.terraria tbody tr');
      table.each((i, el) => {
        let name = $(el).find('span.i.block.alignleft').text();

        if (name?.includes(' ')) name = name.replaceAll(' ', '_');
        if (name?.includes(`'`)) name = name.replaceAll(`'`, '%27');
        if (name) itemNames.push(name);
      });

      return itemNames;
    }
  }

  let isBoostedGear = false;
  $('.mw-parser-output')
    .children()
    .each((i, el) => {
      if (
        $(el).text().toLowerCase().includes('the following items will boost') ||
        $(el).text().toLowerCase().includes('certain armor sets')
      ) {
        isBoostedGear = true;
      }

      if (!isBoostedGear) {
        $(el).each((i, el) => {
          $(el)
            .find('tr')
            .each((i, el) => {
              if (isPCVersion(el)) {
                let name = getImgName(el);
                if (name?.includes('(')) {
                  const bracketIndex = name.indexOf('(');
                  name = name.slice(0, bracketIndex).trim();
                }
                if (name?.includes(' ')) name = name.replaceAll(' ', '_');
                if (name?.includes(`'`)) name = name.replaceAll(`'`, '%27');
                if (name) itemNames.push(name as string);
              }
            });
        });
      }
    });

  return itemNames;
}

async function saveItemsData(isModded: boolean = false) {
  const terrariaItems = {
    vanillaWeapons: [
      ['Melee_weapons', 1],
      ['Ranged_weapons', 100],
      ['Magic_weapons', 2000],
      ['Summon_weapons', 3000],
    ],
    vanillaAccessories: [
      ['Movement_Accessories', 5000],
      ['Informational_Accessories', 6000],
      ['Health_and_Mana_Accessories', 7000],
      ['Combat_Accessories', 7500],
      ['Construction_Accessories', 8000],
      ['Fishing_Accessories', 9000],
      ['Yoyo_Accessories', 10000],
      ['Miscellaneous_Accessories', 11000],
      ['Vanity_Accessories', 12000],
      ['Music_Box_Accessories', 13000],
      ['Expert_Mode_Accessories', 14000],
    ],
    vanillaArmors: [['Armor', 30000]],
    calamityWeapons: [
      ['Melee_weapons', 16000],
      ['Ranged_weapons', 17000],
      ['Magic_weapons', 18000],
      ['Summon_weapons', 19000],
      ['Rogue_weapons', 20000],
      ['Classless_weapons', 21000],
    ],
    calamityAccessories: [
      ['Restorative_Accessories', 21000],
      ['Combat_Accessories', 22000],
      ['Mining_Accessories', 23000],
      ['Fishing_Accessories', 24000],
      ['Revengeance_Mode_Accessories', 25000],
      ['Movement_Accessories', 26000],
    ],
    calamityArmors: [['Armor', 40000]],
  };

  const getPageItems = async (pageUrl: string, id: number, type: string) => {
    let theData = [];
    const itemNames = await getItemsNames(pageUrl, isModded);
    let i = 0;
    for (const name of itemNames) {
      if (type === 'weapons') {
        theData.push(
          scrapeWeapon(
            `https://${
              isModded ? 'calamitymod' : 'terraria'
            }.fandom.com/wiki/${name}`,
            id + i,
            isModded
          )
        );
      }
      if (type === 'accessories') {
        theData.push(
          scrapeAccessory(
            `https://${
              isModded ? 'calamitymod' : 'terraria'
            }.fandom.com/wiki/${name}`,
            id + i,
            isModded
          )
        );
      }
      if (type === 'armors') {
        theData.push(
          scrapeArmor(
            `https://${
              isModded ? 'calamitymod' : 'terraria'
            }.fandom.com/wiki/${name}`,
            id + i,
            isModded
          )
        );
      }
      i++;
    }
    return theData;
  };

  const transformName = (str: string): string => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const scrapeAllItems = async (isModded: boolean, type: string) => {
    for (const [name, id] of isModded
      ? terrariaItems[
          ('calamity' + transformName(type)) as keyof typeof terrariaItems
        ]
      : terrariaItems[
          ('vanilla' + transformName(type)) as keyof typeof terrariaItems
        ]) {
      const pageUrl = `https://${
        isModded ? 'calamitymod' : 'terraria'
      }.fandom.com/wiki/${name}`;
      const promisedData = await getPageItems(pageUrl, id as number, type);
      const data = await Promise.all(promisedData);
      fs.writeFileSync(
        `./${
          isModded ? `../data/calamity/${type}` : `../data/vanilla/${type}`
        }/${name}.json`,
        JSON.stringify(data, null, 2)
      );
    }
  };

  await scrapeAllItems(isModded, 'weapons');
  await scrapeAllItems(isModded, 'accessories');
  await scrapeAllItems(isModded, 'armors');
}

const scrapeAll = async () => {
  await saveItemsData();
  // await saveItemsData(true);
};

scrapeAll();
