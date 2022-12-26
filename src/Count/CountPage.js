import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';

import '../styles/caseManagement/_caseManagement.scss';
import CategoryFilter from './Component/CategoryFilter.js';
import StatusFilter from './Component/StatusFilter.js';
import DateFilter from './Component/DateFilter.js';
import UnitFilter from './Component/UnitFilter.js';
import FinishFilter from './Component/FinishFilter.js';
import HandlerFilter from './Component/HandlerFilter.js';
import UserFilter from './Component/UserFilter.js';

import { FaEye, FaFireExtinguisher } from 'react-icons/fa';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

function CountPage({ setCaseNum, setCaseId, setHandlerNull, setSender }) {
  const { member, setMember } = useAuth();
  const [number, setNumber] = useState(true);
  const [time, setTime] = useState(true);
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState('');
  const [minDateValue, setMinDateValue] = useState('');
  const [memberId, setMemberId] = useState('');

  // 篩選
  const [nowStatus, setNowStatus] = useState('');
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [finish, setFinish] = useState('');
  const [handler, setHandler] = useState('');
  const [nowUser, setNowUser] = useState('');

  // get data
  const [allData, setAllData] = useState([]);
  const [caseHistory, setCaseHistory] = useState([]);
  const [allUnit, setAllUnitData] = useState([]);
  const [allStatusData, setAllStatusData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allHandlerData, setAllHandlerData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);

  // get total
  const [total, setTotal] = useState('');

  // 檢查會員
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

  // 取得所有資料
  useEffect(() => {
    let getAllData = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData/getAssistantAllApp?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&finish=${finish}&handler=${handler}&user=${nowUser}`,
        {
          withCredentials: true,
        }
      );
      //   console.log(response.data.pagination.total);
      setTotal(response.data.pagination.total);
      setAllData(response.data.result);
      setAllCategoryData(response.data.categoryResult);
      setAllUnitData(response.data.unitResult);
      setAllStatusData(response.data.statusResult);
      setAllHandlerData(response.data.handlerResult);
      setAllUserData(response.data.userResult);
    };
    getAllData();
  }, [
    member,
    nowCategory,
    nowStatus,
    nowUnit,
    minDate,
    maxDate,
    finish,
    handler,
    nowUser,
  ]);

  // 審查 history
  let handleCaseHistory = async (caseNum) => {
    let response = await axios.get(
      `${API_URL}/applicationData/getCaseHistory/${caseNum}`,
      {
        withCredentials: true,
      }
    );
    setCaseHistory(response.data.result);
  };

  return (
    <>
      {/* <Header> */}

      <div className="caseContainer">
        {/* 篩選 */}
        <div className="sortSelect">
          <div className="bothFilter">
            <CategoryFilter
              allCategoryData={allCategoryData}
              setNowCategory={setNowCategory}
            />
            <StatusFilter
              allStatusData={allStatusData}
              setNowStatus={setNowStatus}
            />
            <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
            <FinishFilter setFinish={setFinish} />
            <HandlerFilter
              setHandler={setHandler}
              allHandlerData={allHandlerData}
            />
            <UserFilter setNowUser={setNowUser} allUserData={allUserData} />
          </div>
        </div>
        <DateFilter
          dateRemind={dateRemind}
          setDateRemind={setDateRemind}
          setMaxDate={setMaxDate}
          setMinDate={setMinDate}
          maxDateValue={maxDateValue}
          setMaxDateValue={setMaxDateValue}
          minDateValue={minDateValue}
          setMinDateValue={setMinDateValue}
        />
        <hr />
        <div>總筆次 ： {total}</div>
        <hr />

        <table className="caseContain">
          <thead>
            <tr>
              <th></th>
              <th className="sortBtn">
                案件編號
                {number ? (
                  <MdArrowDropDown
                    className="arrow"
                    onClick={() => {
                      setNumber(false);
                    }}
                  />
                ) : (
                  <MdArrowDropUp
                    className="arrow"
                    onClick={() => {
                      setNumber(true);
                    }}
                  />
                )}
              </th>
              <th>申請單位</th>
              <th>申請人</th>
              <th>處理人</th>
              <th>申請類別</th>
              <th className="sortBtn">
                申請時間
                {time ? (
                  <MdArrowDropDown
                    className="arrow"
                    onClick={() => {
                      setTime(false);
                    }}
                  />
                ) : (
                  <MdArrowDropUp
                    className="arrow"
                    onClick={() => {
                      setTime(true);
                    }}
                  />
                )}
              </th>
              <th>申請狀態</th>
              <th></th>
              <th>需求進度</th>
            </tr>
          </thead>

          {allData.map((v) => {
            return (
              <tbody key={uuidv4()}>
                <tr>
                  <td>
                    {member.permissions_id === 3 && member.name === v.sender
                      ? `轉件人 : ${v.handler}`
                      : ''}
                  </td>
                  <td>{v.case_number}</td>
                  <td>{v.applicant_unit}</td>
                  <td>{v.user}</td>
                  <td>{v.handler}</td>
                  <td>{v.application_category}</td>
                  <td>{v.create_time}</td>
                  <td
                    onClick={() => {
                      handleCaseHistory(v.case_number);
                    }}
                  >
                    <span className="viewList">{v.name}</span>
                  </td>
                  <td className="posClick">
                    <Link to={`caseDetail/application/${v.case_number}`}>
                      <FaEye
                        className={`icons ${
                          v.name === '處理人評估中' &&
                          member.permissions_id === 3
                            ? 'eyeBcg'
                            : ''
                        }`}
                        onClick={() => {
                          setCaseNum(v.case_number);
                          setCaseId(v.id);
                          setHandlerNull(v.handler);
                          setSender(v.sender);

                          // if (
                          //   v.name === '處理人評估中' &&
                          //   member.permissions_id === 3
                          // ) {
                          //   handleChangeState(v.case_number, v.id);
                          // }
                        }}
                      />
                    </Link>

                    {/* <div className="hadClick">NEW</div> */}
                  </td>
                  <td>
                    進度({v.cou}/{v.sum})
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      {/* </Header> */}
    </>
  );
}

export default CountPage;
