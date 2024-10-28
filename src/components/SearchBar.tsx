import AsyncSelect from "react-select/async";
import { DestinationOption } from '../types/types';
import { ActionMeta, SingleValue } from "react-select";
import { GlobalSearchIcon } from "hugeicons-react";

interface SearchBarProps {
  selectedDestinationOption: DestinationOption | null;
  handleDestinationChange: (newValue: SingleValue<DestinationOption>, actionMeta: ActionMeta<DestinationOption>) => void;
  loadDestinationOptions: (inputValue: string, callback: (options: DestinationOption[]) => void) => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLight: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  selectedDestinationOption, 
  handleDestinationChange, 
  loadDestinationOptions, 
  handleSubmit,
  isLight 
}) => {
  const styles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `2px solid ${isLight ? 'black' : 'white'}`,
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': {
        borderBottom: `2px solid ${isLight ? 'black' : 'white'}`,
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isLight ? 'black' : 'white',
      opacity: 0.7,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isLight ? 'black' : 'white',
    }),
    input: (provided: any) => ({
      ...provided,
      color: isLight ? 'black' : 'white',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        : 'transparent',
      color: isLight ? 'black' : 'white',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: () => ({
      display: 'none',
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full">
      <AsyncSelect<DestinationOption>
        className={`text-prim placeholder-${isLight ? 'black' : 'white'} placeholder-opacity-70`}
        value={selectedDestinationOption}
        onChange={handleDestinationChange}
        loadOptions={loadDestinationOptions}
        placeholder="Search for a city..."
        styles={{
          ...styles,
          container: (provided) => ({
            ...provided,
            width: '100%',
          }),
        }}
      />
      <button 
        type="submit" 
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isLight ? 'text-black' : 'text-white'} hover:text-sky-700 transition-colors`}
      >
        <GlobalSearchIcon size={24} />
      </button>
    </form>
  );
};

export default SearchBar;
