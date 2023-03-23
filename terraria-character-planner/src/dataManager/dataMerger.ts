import fs from 'fs';

// Accessories
import vanillaCombat from '../data/vanilla/accessories/Combat_Accessories.json' assert { type: 'json' };
import vanillaConstrction from '../data/vanilla/accessories/Construction_Accessories.json' assert { type: 'json' };
import vanillaExpert from '../data/vanilla/accessories/Expert_Mode_Accessories.json' assert { type: 'json' };
import vanillaFishing from '../data/vanilla/accessories/Fishing_Accessories.json' assert { type: 'json' };
import vanillaHealthMana from '../data/vanilla/accessories/Health_and_Mana_Accessories.json' assert { type: 'json' };
import vanillaInfo from '../data/vanilla/accessories/Informational_Accessories.json' assert { type: 'json' };
import vanillaMisc from '../data/vanilla/accessories/Miscellaneous_Accessories.json' assert { type: 'json' };
import vanillaMove from '../data/vanilla/accessories/Movement_Accessories.json' assert { type: 'json' };
// import vanillaVanity from '../data/vanilla/accessories/Vanity_Accessories.json'
// import vanillaYoyo from '../data/vanilla/accessories/Yoyo_Accessories.json'
// Weapons
import vanillaMelee from '../data/vanilla/weapons/Melee_weapons.json' assert { type: 'json' };
import vanillaMagic from '../data/vanilla/weapons/Magic_weapons.json' assert { type: 'json' };
import vanillaRanged from '../data/vanilla/weapons/Ranged_weapons.json' assert { type: 'json' };
import vanillaSummon from '../data/vanilla/weapons/Summon_weapons.json' assert { type: 'json' };
import { deleteDuplicates } from './deleteDuplicates.js';
import { deleteEmpty } from './deleteEmpty.js';

const dataMerger = () => {
  const newVanillaMove = vanillaMove.filter(
    item => !item.name.toLowerCase().includes('wing')
  );

  const vanillaAccessories = deleteEmpty(
    deleteDuplicates([
      ...vanillaCombat,
      ...vanillaConstrction,
      ...vanillaExpert,
      ...vanillaFishing,
      ...vanillaHealthMana,
      ...vanillaInfo,
      ...vanillaMisc,
      ...newVanillaMove,
      // ...vanillaVanity, it's bugged for now
      // ...vanillaYoyo, it's bugged for now
    ])
  );

  const vanillaWeapons = deleteEmpty(
    deleteDuplicates([
      ...vanillaMelee,
      ...vanillaMagic,
      ...vanillaRanged,
      ...vanillaSummon,
    ])
  );

  fs.writeFileSync(
    `../data/vanilla/accessories/allAccessories.json`,
    JSON.stringify(vanillaAccessories, null, 2)
  );

  fs.writeFileSync(
    `../data/vanilla/weapons/allWeapons.json`,
    JSON.stringify(vanillaWeapons, null, 2)
  );
};

dataMerger();
