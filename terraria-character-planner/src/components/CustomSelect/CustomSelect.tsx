import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

interface CustomSelectProps {
  options: { img: string; name: string; id: number }[];
  placeholder: string;
}

export const CustomSelect = ({ options, placeholder }: CustomSelectProps) => {
  return (
    <FormControl fullWidth sx={{ marginTop: '10px' }}>
      <InputLabel> {placeholder} </InputLabel>
      <Select style={{ width: '200px' }} variant={'standard'}>
        {options.map(option => (
          <MenuItem key={option.id} value={option.id}>
            <img
              src={option.img}
              alt={option.name}
              style={{ width: '15px', marginRight: '15px' }}
            />
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
