export interface ArmorPiece {
  type: string | undefined;
  defense: string | undefined;
  bodySlot: string | undefined;
  tooltip: string[][];
}

export interface Debuffs {
  name: string | undefined;
  img: string | undefined;
  chance: string | undefined;
  duration: string | undefined;
  tooltip: string | undefined;
}
export interface Buffs {
  name: string | undefined;
  img: string | undefined;
  duration: string | undefined;
  tooltip: string | undefined;
}
export interface Projectile {
  img: string | undefined;
  name: string | undefined;
}
export interface CraftingStation {
  img: string | undefined;
  name: string | undefined;
}
export interface Ingredient {
  img: string | undefined;
  name: string | undefined;
  quantity: string | undefined;
}
export interface Crafting {
  cStations: CraftingStation[];
  ingredients: Ingredient[][];
  result: Ingredient | undefined;
}
export interface DroppedBy {
  entity: string | undefined;
  quantity: string | undefined;
  rate: string | undefined;
}
export interface Summons {
  name: string | undefined;
  img: string | undefined;
}

export interface Rarity {
  img: string;
  tier: string;
}

interface Weapon {
  id: number;
  name: string | undefined;
  img: string | undefined;
  type: string | undefined;
  damage: string | undefined;
  mana: string | undefined;
  useTime: string | undefined;
  knockback: string | undefined;
  critChance: string | undefined;
  velocity: string | undefined;
  tooltip: string[][];
  debuffs: Debuffs[];
  buffs: Buffs[];
  rarity: string[];
  projectiles: Projectile[];
  crafting: Crafting | undefined;
  usedIn: Crafting | undefined;
  droppedBy: DroppedBy | undefined;
  summons: Summons | undefined;
}

interface Accessory {
  id: number;
  name: string | undefined;
  img: string | undefined;
  type: string | undefined;
  defense: string | undefined;
  bodySlot: string | undefined;
  damage: string | undefined;
  tooltip: string[][];
  debuffs: Debuffs[];
  buffs: Buffs[];
  rarity: string[];
  projectiles: Projectile[];
  crafting: Crafting | undefined;
  usedIn: Crafting | undefined;
  droppedBy: DroppedBy | undefined;
  summons: Summons | undefined;
}
