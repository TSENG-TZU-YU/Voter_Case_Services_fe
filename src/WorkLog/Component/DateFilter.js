import React from 'react';
import '../../styles/caseManagement/_dateFilter.scss';

function DateFilter({ selectDate, disable }) {
  return (
    <>
      <div className="dateFilterContainer">
        <div className="dateFilter">
          <input
            type="date"
            value={selectDate}
            disabled={disable ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default DateFilter;
