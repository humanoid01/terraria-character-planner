import allAccessories from '../../../data/vanilla/accessories/allAccessories.json';
import { SelectItem } from './../../SelectItem/SelectItem';

interface SelectProps {
  img: string;
  name: string;
  id: number;
}

export const Accessory = () => {
  return (
    <SelectItem
      options={allAccessories as SelectProps[]}
      placeholder={'Accessory'}
      width={'200px'}
    />
  );
};
