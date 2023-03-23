import { Autocomplete, TextField, Box } from '@mui/material';
interface CustomSelectProps {
  options: { img: string; name: string; id: number }[];
  placeholder: string;
  width: string;
}

export const SelectItem = ({
  options,
  placeholder,
  width,
}: CustomSelectProps) => {
  return (
    <Autocomplete
      id='country-select-demo'
      sx={{ width }}
      options={options}
      autoHighlight
      getOptionLabel={option => option.name as string}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}>
          <img loading='lazy' width='20' src={option.img} alt={option.name} />
          {option.name}
        </Box>
      )}
      renderInput={params => <TextField {...params} label={placeholder} />}
    />
  );
};
