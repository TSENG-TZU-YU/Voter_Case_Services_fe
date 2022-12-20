import React from 'react';
import '../../styles/caseManagement/_dateFilter.scss';

function DateFilter({
  dateRemind,
  setDateRemind,
  setMaxDate,
  setMinDate,
  setMaxDateValue,
  setMinDateValue,
  maxDateValue,
  minDateValue,
}) {
  return (
    <>
      <div className="dateFilterContainer">
        <div className="dateFilter">
          <input
            type="date"
            onChange={(e) => {
              let newDate = e.target.value;
              setMinDateValue(newDate);
              setDateRemind('');
            }}
          />
          <div className="mx-2">-</div>
          <input
            type="date"
            onChange={(e) => {
              let newDate = e.target.value;
              setMaxDateValue(newDate);
              setDateRemind('');
            }}
          />
          <button
            onClick={() => {
              if (minDateValue === '' || maxDateValue === '') {
                setDateRemind('請選擇開始及結束的日期');
              } else if (minDateValue > maxDateValue) {
                setDateRemind('開始日期不得大於結束日期');
              } else if (minDateValue !== '' && maxDateValue !== '') {
                setMinDate(minDateValue);
                setMaxDate(maxDateValue);
                setDateRemind('');
              } else {
                setDateRemind('');
                setMinDate('');
                setMaxDate('');
              }
            }}
          >
            篩選
          </button>
        </div>

        <div className="dateRemind">{dateRemind}</div>
      </div>
    </>
  );
}

export default DateFilter;
