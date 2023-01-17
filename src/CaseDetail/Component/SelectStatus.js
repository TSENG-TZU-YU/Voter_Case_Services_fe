import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../utils/use_auth';

import '../../styles/caseDetail/_selectStatus.scss';

function SelectStatus({
  needState,
  needSumLen,
  needLen,
  selectData,
  postVal,
  setSelectRemind,
  handlePostVal,
  selectRemind,
  setAddStateForm,
}) {
  const location = useLocation();
  // 從網址上抓到關鍵字
  let params = new URLSearchParams(location.search);
  let HId = params.get('HId');
  let WebPage = parseInt(params.get('page'));

  const { member, setMember } = useAuth();
  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/login/auth`,
          {
            withCredentials: true,
          }
        );

        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();
  }, []);

  return (
    <>
      {WebPage === 2 &&
      HId !== '' &&
      (member.manage === 1 || member.handler === 1) &&
      needState !== 1 &&
      needState !== 6 &&
      needState !== 7 &&
      needState !== 8 &&
      needState !== 9 &&
      needState !== 10 &&
      needState !== 11 &&
      needSumLen !== needLen ? (
        <div className="selectContain">
          {/* <StateFilter /> */}
          <div className="selContain">
            <select
              name="status"
              value={postVal.status}
              onChange={(e) => {
                setSelectRemind(false);
                handlePostVal(e);
              }}
            >
              <option value="">----請選擇處理狀態----</option>
              {selectData.map((v) => {
                return (
                  <option value={v.name} key={uuidv4()}>
                    {v.name}
                  </option>
                );
              })}
            </select>
            {selectRemind ? (
              <div className="selectRemind">*請選擇處理狀態</div>
            ) : (
              ''
            )}
          </div>

          <button
            className="confirmBtn"
            onClick={() => {
              if (postVal.status === '') {
                setSelectRemind(true);
                return;
              }
              setAddStateForm(true);
            }}
          >
            確認
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default SelectStatus;
