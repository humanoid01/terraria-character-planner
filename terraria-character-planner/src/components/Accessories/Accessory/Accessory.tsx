import allAccessories from '../../../data/vanilla/accessories/allAccessories.json';
export const Accessory = () => {
  return (
    <select>
      {allAccessories.map(accessory => {
        return <option value=''> {accessory.name} </option>;
      })}
    </select>
  );
};
