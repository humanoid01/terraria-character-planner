import allWeapons from '../../../data/vanilla/weapons/allWeapons.json';
import { SelectItem } from '../../SelectItem/SelectItem';

interface SelectProps {
  img: string;
  name: string;
  id: number;
}

export const Weapon = () => {
  return (
    <SelectItem
      options={allWeapons as SelectProps[]}
      placeholder={'Weapons'}
      width={'200px'}
    />
  );
};
