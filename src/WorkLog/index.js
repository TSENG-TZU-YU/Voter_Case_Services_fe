import React, { useEffect, useState } from 'react';
import './_index.scss';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { AiFillCloseSquare } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';

import DateFilter from './Component/DateFilter.js';
import DateFilterAll from './Component/DateFilterAll.js';
import { useAuth } from '../utils/use_auth';
function WorkLog() {
  const [log, setLog] = useState([]);
  const [addWorkLog, setAddWorkLog] = useState([
    { workCategory: '', workLog: '' },
  ]);
  const [eyeDetail, setEyeDetail] = useState([]);
  const [mobileToggle, setMobileToggle] = useState(true);
  const [disable, setDisable] = useState(false);
  //使用者資料
  const { member } = useAuth();

  //date
  let nowDate = moment().format(`YYYY-MM-DD`);
  const [selectDate, setSelectDate] = useState(nowDate);
  // 取前六個月
  let dateObj = new Date(nowDate);
  dateObj.setMonth(dateObj.getMonth() - 6);
  // 將日期轉換為指定格式的字串
  let newDateString = dateObj.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  let dateAgo = newDateString.replace(/\//g, '-');
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(dateAgo);
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);

  // 日誌
  const [EyeWorkLogForm, setEyeWorkLogForm] = useState(false);
  const [addWorkLogForm, setAddWorkLogForm] = useState(false);

  const handleChange = (val, input) => {
    let newData = [...addWorkLog];
    if (input === 'workCategory') newData[0].workCategory = val;
    if (input === 'workLog') newData[0].workLog = val;

    setAddWorkLog(newData);
  };

  useEffect(() => {
    async function audit() {
      let no = localStorage.getItem('memberID');
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/workLog?minDate=${minDate}&maxDate=${maxDate}`,
          { staff_code: no }
        );
        setLog(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [addWorkLogForm, minDate, maxDate]);
  //TODO: 刷新時畫面沒重新渲染
  //查看詳細
  async function detail(create_time) {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/workLog/detail`,
        {
          create_time: create_time,
        },
        {
          withCredentials: true,
        }
      );
      setEyeDetail(response.data);
    } catch (err) {
      console.log('sub', err);
    }
  }

  // 送出申請表sweet
  function submitCheck(tit) {
    if (addWorkLog[0].workCategory === '' || addWorkLog[0].workLog === '') {
      Swal.fire({
        icon: 'error',
        title: '請填寫完整內容',
        confirmButtonColor: '#f2ac33',
      });
    }

    if (addWorkLog[0].workCategory !== '' && addWorkLog[0].workLog !== '') {
      Swal.fire({
        title: tit,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '確定送出',
        denyButtonText: `取消送出`,
        confirmButtonColor: '#f2ac33',
        denyButtonColor: '#ccc',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: '送出成功',
            confirmButtonColor: '#f2ac33',
          }).then(() => {
            setAddWorkLogForm(false);
          });
          submit();
        } else if (result.isDenied) {
          Swal.fire({
            icon: 'info',
            title: '已取消送出',
            confirmButtonColor: '#f2ac33',
          });
        }
      });
    }
  }

  //送出表單內容
  async function submit() {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/workLog/submit`,
        {
          ...addWorkLog[0],
          time: selectDate,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log('sub', err);
    }
  }
  return (
    <div className="workLogContainer">
      <div className="logContainer">
        <div className="sortSelect">
          <div className="logBetween">
            <div>
              <button
                className="addButton"
                onClick={() => {
                  setAddWorkLogForm(true);
                  setDisable(false);
                }}
              >
                新增工作日誌
              </button>
            </div>
            <div className="mobileToggle ">
              {mobileToggle ? (
                <BsToggleOn
                  size="35"
                  onClick={() => {
                    setMobileToggle(false);
                  }}
                />
              ) : (
                <BsToggleOff
                  size="35"
                  onClick={() => {
                    setMobileToggle(true);
                  }}
                />
              )}
            </div>
          </div>
          <DateFilterAll
            dateRemind={dateRemind}
            setDateRemind={setDateRemind}
            setMaxDate={setMaxDate}
            setMinDate={setMinDate}
            maxDateValue={maxDateValue}
            setMaxDateValue={setMaxDateValue}
            minDateValue={minDateValue}
            setMinDateValue={setMinDateValue}
            dateAgo={dateAgo}
            nowDate={nowDate}
          />
        </div>

        <table
          className={`logContain ${mobileToggle ? ' mobileCaseLog' : ''}
              `}
        >
          <thead>
            <tr>
              <th>使用者</th>
              <th>詳細資訊</th>
              <th>工作類型</th>
              <th>工作說明</th>
              <th>時間</th>
            </tr>
          </thead>
          {log.length !== 0 ? (
            <>
              {log.map((v, i) => {
                const {
                  user,
                  job_category,
                  Job_description,
                  create_time,
                  time,
                } = v;
                return (
                  <tbody key={i} className="bodyLog">
                    <tr>
                      <td data-title="使用者">{user}</td>
                      <td data-title="詳細資訊">
                        <FaEye
                          className="icons"
                          onClick={() => {
                            detail(create_time);
                            setEyeWorkLogForm(true);
                            setDisable(true);
                          }}
                        />
                      </td>
                      <td data-title="工作類型" className="overText">
                        {job_category}
                      </td>
                      <td data-title="工作說明" className="overText">
                        {Job_description}
                      </td>
                      <td data-title="時間">{time}</td>
                    </tr>
                  </tbody>
                );
              })}
            </>
          ) : (
            <tbody className="noData">
              <tr>
                <td colSpan={5} className="noTd">
                  目前沒有資料
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {addWorkLogForm ? (
        <div className="addWorkLogContain">
          <div className="addWorkLog">
            <AiFillCloseSquare
              className="closeBtn"
              onClick={() => {
                setAddWorkLogForm(false);
              }}
            />
            <div className="title">新增工作日誌</div>

            {/* 表單內容 */}
            <div className="addWorkLogFormContain">
              <div className="box ">
                <div className="gap">
                  <div className="contents18">日期</div>
                  <DateFilter
                    selectDate={selectDate}
                    setSelectDate={setSelectDate}
                    disable={disable}
                  />
                </div>
              </div>

              <div className="box ">
                {/*  工作類別  */}
                <div className="gap">
                  <div className="contents18">
                    工作類別(字數限制16) <span>*必填</span>
                  </div>
                  <input
                    className="handler contents18"
                    type="text"
                    maxLength="16"
                    onChange={(e) => {
                      handleChange(e.target.value, 'workCategory');
                    }}
                  />
                </div>
              </div>
              <div className="add">
                <div>
                  {/* <FaTrashAlt
              size="17"
              onClick={() => {
                delCheck('確定要刪除所有需求內容?', handleClearNeed);
              }}
              className="clearIcon"
            /> */}
                  {/* <MdOutlineAddBox size="20" onClick={addN} className="addIcon" /> */}
                </div>
              </div>
              <div className="needs">
                {/* {addNeed.map((v, i) => {
          return ( */}
                <div className="need">
                  <div className="one">
                    <div className="contents18">
                      工作說明(字數限制500)<span>*必填</span>
                    </div>
                  </div>

                  <div>
                    <textarea
                      className="input contents18 "
                      name="ttt"
                      cols="30"
                      rows="10"
                      maxLength="500"
                      style={{ resize: 'none', height: '120px' }}
                      onChange={(e) => {
                        handleChange(e.target.value, 'workLog');
                      }}
                    ></textarea>
                  </div>
                </div>
                {/* );
        })} */}
              </div>
            </div>
            <button
              onClick={() => {
                submitCheck('確認送出?');
              }}
            >
              確認
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
      {EyeWorkLogForm ? (
        <div className="addWorkLogContain">
          <div className="addWorkLog">
            <AiFillCloseSquare
              className="closeBtn"
              onClick={() => {
                setEyeWorkLogForm(false);
              }}
            />
            <div className="title">工作日誌</div>

            {/* 表單內容 */}
            {eyeDetail.map((v, i) => {
              const { job_category, Job_description, time } = v;
              return (
                <div className="addWorkLogFormContain">
                  <div className="box ">
                    <div className="gap">
                      <div className="contents18">日期</div>
                      <DateFilter selectDate={time} disable={disable} />
                    </div>
                  </div>
                  <div className="box ">
                    <div className="gap">
                      <div className="contents18">工作類別</div>
                      <input
                        className="handler contents18"
                        type="text"
                        value={job_category}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="needs">
                    <div className="need">
                      <div className="one">
                        <div className="contents18">工作說明</div>
                      </div>

                      <div>
                        <textarea
                          className="input contents18 "
                          cols="30"
                          rows="10"
                          style={{ resize: 'none', height: '120px' }}
                          value={Job_description}
                          disabled
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default WorkLog;
