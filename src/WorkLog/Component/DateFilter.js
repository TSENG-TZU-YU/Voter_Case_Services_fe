import React from 'react';
import '../../styles/caseManagement/_dateFilter.scss';

function DateFilter({ selectDate, setSelectDate }) {
  return (
    <>
      <div className="dateFilterContainer">
        <div className="dateFilter">
          <input
            type="date"
            value={selectDate}
            onChange={(e) => {
              setSelectDate(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default DateFilter;
