import React, { useEffect, useState } from 'react';
import './_index.scss';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { AiFillCloseSquare } from 'react-icons/ai';
import { FaPencilAlt } from 'react-icons/fa';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { GiCheckMark } from 'react-icons/gi';

import DateFilter from './Component/DateFilter.js';
import DateFilterAll from './Component/DateFilterAll.js';
import Loader from '../Loader';

import { useAuth } from '../utils/use_auth';
function WorkLog() {
  const [log, setLog] = useState([]);
  const [addWorkLog, setAddWorkLog] = useState([{ workLog: '' }]);
  const [eyeDetail, setEyeDetail] = useState([]);
  const [mobileToggle, setMobileToggle] = useState(true);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  // const [maxDate, setMaxDate] = useState(nowDate);
  // const [minDate, setMinDate] = useState(dateAgo);

  // 最大及最小日期初值
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth());

  let month = sixMonthsAgo.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  const maxM = `${sixMonthsAgo.getFullYear()}/${month}/31`;
  const minM = `${sixMonthsAgo.getFullYear()}/${month}/01`;

  const [maxDate, setMaxDate] = useState(maxM);
  const [minDate, setMinDate] = useState(minM);

  // 每月的1-31天
  const start_date = new Date(minDate);
  const end_date = new Date(maxDate >= nowDate ? nowDate : maxDate);
  const allDate = [];
  for (let d = start_date; d <= end_date; d.setDate(d.getDate() + 1)) {
    let newD = d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (newD.slice(5, 7) === minDate.slice(5, 7)) allDate.push(newD);
  }
  const sortAllDate = allDate.sort((a, b) => new Date(b) - new Date(a));

  // 日誌
  const [EyeWorkLogForm, setEyeWorkLogForm] = useState(false);
  const [addWorkLogForm, setAddWorkLogForm] = useState(false);

  const handleChange = (val, input) => {
    let newData = [...addWorkLog];
    // if (input === 'workCategory') newData[0].workCategory = val;
    if (input === 'workLog') newData[0].workLog = val;

    setAddWorkLog(newData);
  };

  useEffect(() => {
    async function audit() {
      let no = localStorage.getItem('memberID');
      setIsLoading(true);
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/workLog?minDate=${minDate}&maxDate=${maxDate}`,
          { staff_code: no, sortAllDate: sortAllDate },
          {
            withCredentials: true,
          }
        );
        setLog(res.data);
        setTimeout(() => {
          setIsLoading(false);
        });
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [addWorkLogForm, minDate, maxDate]);

  //查看詳細
  async function detail(time, staff_code) {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/workLog/detail`,
        {
          create_time: time,
          staff_code: staff_code,
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
    if (addWorkLog[0].workLog === '') {
      Swal.fire({
        icon: 'error',
        title: '請填寫完整內容',
        confirmButtonColor: '#f2ac33',
      });
    }
    // addWorkLog[0].workCategory !== '' &&
    if (addWorkLog[0].workLog !== '') {
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
            <div>請選擇年月份：</div>
            <div className="me-2">
              {/* <button
                className="addButton"
                onClick={() => {
                  setAddWorkLogForm(true);
                  setDisable(false);
                }}
              >
                新增工作日誌
              </button> */}
              <DateFilterAll setMaxDate={setMaxDate} setMinDate={setMinDate} />
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
        </div>

        <table className={`logContain ${mobileToggle ? ' mobileCaseLog' : ''}`}>
          <thead>
            <tr>
              <th>使用者</th>
              <th>詳細資訊</th>
              {/* <th>工作類型</th> */}
              <th>工作說明</th>
              <th>時間</th>
              <th></th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody className="noData">
              <tr>
                <td colSpan={10} className="noTd">
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              {log.length !== 0 ? (
                <>
                  {log.map((v, i) => {
                    const { user, staff_code, Job_description, time } = v;
                    return (
                      <tbody
                        key={i}
                        className={`bodyLog ${
                          Job_description === '' ? 'description noText' : ''
                        }`}
                      >
                        <tr>
                          <td data-title="使用者">{user}</td>
                          <td data-title="詳細資訊">
                            <FaPencilAlt
                              className="icons"
                              onClick={() => {
                                detail(time, staff_code);
                                setAddWorkLogForm(true);
                                setDisable(true);
                                setSelectDate(time);
                              }}
                            />
                          </td>
                          <td data-title="工作說明" className="overText">
                            {Job_description}
                          </td>
                          <td data-title="時間">{time}</td>
                          <td>
                            {Job_description !== '' ? (
                              <GiCheckMark size="20" />
                            ) : (
                              ''
                            )}
                          </td>
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
            </>
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
            {eyeDetail.map((v, i) => {
              const { Job_description, time } = v;
              return (
                <div key={i} className="addWorkLogFormContain">
                  <div className="box ">
                    <div className="gap">
                      <div className="contents18">日期</div>
                      <DateFilter selectDate={time} disable={disable} />
                    </div>
                  </div>
                  {/* <div className="box ">
                    <div className="gap">
                      <div className="contents18">工作類別</div>
                      <input
                        className="handler contents18"
                        type="text"
                        value={job_category}
                        disabled
                      />
                    </div>
                  </div> */}
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
                          onChange={(e) => {
                            handleChange(
                              (v.Job_description = e.target.value),
                              'workLog'
                            );
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  {/* <div className="box ">
                    <div className="gap">
                      <div className="contents18">工作類別</div>
                      <input
                        className="handler contents18"
                        type="text"
                        value={job_category}
                        disabled
                      />
                    </div>
                  </div> */}
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
