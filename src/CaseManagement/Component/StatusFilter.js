import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

function ActivitySelect({ allStatusData, setNowStatus, member }) {
  // const [selectSortOption, setSelectSortOption] = useState(null);
  // console.log('m',member.manage)
  let newData = [];
  for (let i = 3; i < allStatusData.length; i++) {
    newData.push({
      value: allStatusData[i].id,
      label: allStatusData[i].name,
    });
  }
  const sortOption = [{ value: '', label: '請選擇狀態' }, ...newData];
  // console.log('n', sortOption);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      height: '32px',
      // width: '15%',
      // fontSize: '18px',
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
      width: '170px',
      // fontSize: '18px',
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
  return (
    <>
      <Select
        defaultValue={sortOption[0]}
        onChange={(e) => {
          // console.log(e.value);
          setNowStatus(e.value);
        }}
        options={sortOption}
        styles={customStyles}
        isSearchable={false}
      />
    </>
  );
}

export default ActivitySelect;
