import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

const sortOption = [
  { value: '', label: '----請選擇狀態----' },
  { value: 1, label: '主管待審核' },
  { value: 2, label: '主管審核中' },
  { value: 3, label: '主管退件' },
  { value: 4, label: '申請中' },
  { value: 5, label: '評估中' },
  { value: 6, label: '案件進行中' },
  { value: 7, label: '需補件' },
  { value: 8, label: '已完成' },
  { value: 9, label: '處理人員退件' },
  { value: 10, label: '取消申請' },
  { value: 11, label: '轉件中' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    height: '32px',
    // width: '15%',
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
    minHeight: '32px',
    width: '150px',
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
