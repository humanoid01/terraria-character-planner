import allAccessories from '../../../data/vanilla/accessories/allAccessories.json';
import { CustomSelect } from './../../CustomSelect/CustomSelect';

interface SelectProps {
  img: string;
  name: string;
  id: number;
}

export const Accessory = () => {
  return (
    <CustomSelect
      options={allAccessories as SelectProps[]}
      placeholder={'Accessory'}
    />
  );
};
