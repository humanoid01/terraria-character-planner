import * as cheerio from 'cheerio';
import { getImg } from './getImg.js';
import { getImgName } from './getImgName.js';

interface ProjectileInfo {
  img: string | undefined;
  name: string | undefined;
}

export const getProjectiles = (el: cheerio.Element): ProjectileInfo[] => {
  const $ = cheerio.load(el);
  const calamity = $('div.proj');
  const vanilla = $('div.section.projectile');

  const getProjectileImgAndName = (isModded: boolean = false) => {
    const projectiles: ProjectileInfo[] = [];

    if (isModded) {
      $('div.proj').each((i, el: cheerio.Element) => {
        const projInfo: ProjectileInfo = {
          img: undefined,
          name: undefined,
        };

        projInfo.img = getImg(el);
        projInfo.name = getImgName(el);

        projectiles.push({ ...projInfo });
      });

      return projectiles;
    } else {
      $('div.section.projectile ul.infobox-inline li').each(
        (i, el: cheerio.Element) => {
          const projInfo: ProjectileInfo = {
            img: undefined,
            name: undefined,
          };

          projInfo.img = getImg(el);
          projInfo.name = getImgName(el);

          projectiles.push({ ...projInfo });
        }
      );

      return projectiles;
    }
  };

  if (calamity.length) return getProjectileImgAndName(true);
  if (vanilla.length) return getProjectileImgAndName();

  return [];
};
