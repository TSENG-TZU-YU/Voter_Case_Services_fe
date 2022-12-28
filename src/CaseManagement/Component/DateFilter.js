import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/use_auth';

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
  dateAgo,
  nowDate,
}) {
  const { member, setMember } = useAuth();

  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(`http://localhost:3001/api/login/auth`, {
          withCredentials: true,
        });
        // console.log(response.data);
        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();
  }, []);
  return (
    <>
      <div className="dateFilterContainer">
        <div className="dateFilter">
          <input
            type="date"
            defaultValue={dateAgo}
            onChange={(e) => {
              let newDate = e.target.value;
              setMinDateValue(newDate);
              setDateRemind('');
            }}
          />
          <div className="mx-2">-</div>
          <input
            type="date"
            defaultValue={nowDate}
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
