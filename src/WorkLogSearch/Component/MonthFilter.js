import React from 'react';
import Select from 'react-select';

function ActivitySelect({ setMaxDate, setMinDate }) {
  const today = new Date();
  const months = [];

  for (let i = 0; i < 6; i++) {
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - i);

    const year = sixMonthsAgo.getFullYear();
    let month = sixMonthsAgo.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    months.push({
      value: `${year}${month}`,
      label: `${year}-${month}`,
    });
  }
  // console.log(months);

  const sortOption = [{ value: '', label: '請選擇年月份' }, ...months];

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

  return (
    <>
      <Select
        defaultValue={sortOption[0]}
        onChange={(e) => {
          // console.log(e.value);
          let year = e.value.slice(0, 4);
          let month = e.value.slice(4, 6);
          let max = `${year}/${month}/31`;
          let min = `${year}/${month}/01`;

          // console.log(max, min);
          setMaxDate(max);
          setMinDate(min);
        }}
        options={sortOption}
        styles={customStyles}
        isSearchable={false}
      />
    </>
  );
}

export default ActivitySelect;
