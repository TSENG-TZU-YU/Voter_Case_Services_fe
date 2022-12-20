import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

const sortOption = [
  { value: '', label: '----請選擇申請類別----' },
  { value: 1, label: '新專案建置' },
  { value: 2, label: '現有系統增修' },
  { value: 3, label: '問題回報' },
  // { value: 4, label: '其他' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    height: '32px',
    // width: '170px',
    color: state.isSelected ? '#fff' : '#444',
    background: state.isSelected ? '#817161' : '#fff',
    ':active': {
      ...provided[':active'],
      backgroundColor: !state.isDisabled
        ? state.isSelected
          ? '#817161'
          : '#81716180'
        : undefined,
    },
    ':hover': {
      ...provided[':hover'],
      backgroundColor: !state.isDisabled
        ? state.isSelected
          ? '#817161'
          : '#81716180'
        : undefined,
    },
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '32px',
    width: '32px',
  }),
  control: (base, state) => ({
    ...base,
    border: '1px solid #817161',
    // borderRadius: '0px',
    minHeight: '32px',
    width: '170px',
    borderColor: state.isFocused ? '#817161' : 'hsl(0, 0%, 80%)',
    boxShadow: 0,
    '&:hover': {
      border: state.isFocused ? '1px solid #817161' : '1px solid #817161',
    },
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};
function ActivitySelect({ setOrder }) {
  const [selectSortOption, setSelectSortOption] = useState(null);

  return (
    <>
      <Select
        className="me-3"
        defaultValue={sortOption[0]}
        onChange={(e) => {
          // console.log(e.value);
          //   setOrder(e.value);
        }}
        options={sortOption}
        styles={customStyles}
        isSearchable={false}
      />
    </>
  );
}

export default ActivitySelect;
