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
  itemsName: string[];
  entityName: string | undefined;
  entityImg: string | undefined;
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

export interface Item {
  id?: number;
  name: string | undefined;
  img: string | undefined;
  type: string | undefined;
  tooltip: string[][];
  debuffs: Debuffs[];
  buffs: Buffs[];
  rarity: Rarity | undefined;
  projectiles: Projectile[];
  crafting: Crafting[];
  usedIn: Crafting[];
  droppedBy: DroppedBy[];
  summons: Summons[];
}
