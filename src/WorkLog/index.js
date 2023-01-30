import React, { useEffect, useState } from 'react';
import './_index.scss';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';

import { AiFillCloseSquare } from 'react-icons/ai';

import DateFilter from './Component/DateFilter.js';
function WorkLog() {
  const [log, setLog] = useState([]);
  const [addWorkLog, setAddWorkLog] = useState([
    { workCategory: '', workLog: '' },
  ]);
  //日誌驗證空值
  // const [need, setNeed] = useState(false);
  const [category, setCategory] = useState(false);

  //date
  let nowDate = moment().format(`YYYY-MM-DD`);
  const [selectDate, setSelectDate] = useState(nowDate);
  // 日誌
  const [addWorkLogForm, setAddWorkLogForm] = useState(false);

  const handleChange = (val, input) => {
    let newData = [...addWorkLog];
    if (input === 'workCategory') newData[0].workCategory = val;
    if (input === 'workLog') newData[0].workLog = val;

    setAddWorkLog(newData);
  };

  useEffect(() => {
    async function audit() {
      try {
        let res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/workLog`,
          { test: '' },
          {
            withCredentials: true,
          }
        );

        setLog(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [addWorkLogForm]);

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
      console.log('123');
      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/workLog/post`,
        {
          ...addWorkLog[0],
          time: selectDate,
        },
        {
          withCredentials: true,
        }
      );
      console.log('456');
      // setAddWorkLogForm(false);
    } catch (err) {
      console.log('sub', err);
    }
  }
  console.log('setAddWorkLogForm', addWorkLogForm);
  return (
    <div className="workLogContainer">
      <div className="logContainer">
        <button
          onClick={() => {
            setAddWorkLogForm(true);
          }}
        >
          新增工作日誌
        </button>
        <table className="caseContain">
          <thead>
            <tr>
              <th>使用者</th>
              <th>工作類型</th>
              <th>工作說明</th>
              <th>時間</th>
            </tr>
          </thead>
          {log.length !== 0 ? (
            <>
            {/* TODO: */}
              {log.map((v, i) => {
                const { user, job_category, Job_description, time } = v;
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{user}</td>
                      <td>{job_category}</td>
                      <td className='overText'>{Job_description}</td>
                      <td>{time}</td>
                    </tr>
                  </tbody>
                );
              })}
            </>
          ) : (
            <tbody className="noData">
              <tr>
                <td colSpan={3} className="noTd">
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
                  <DateFilter
                    selectDate={selectDate}
                    setSelectDate={setSelectDate}
                  />
                </div>
              </div>

              <div className="box ">
                {/*  工作類別  */}
                <div className="gap">
                  <div className="contents18">
                    工作類別 <span>*</span>
                    {category ? <span>請填欄位</span> : <span>必填</span>}
                  </div>
                  <input
                    className="handler contents18"
                    type="text"
                    onChange={(e) => {
                      handleChange(e.target.value, 'workCategory');
                    }}
                  />
                </div>
              </div>
              <div className="add">
                {/* <span className={`${need ? 'view' : ''}`}>*欄位不得為空</span> */}
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
                      工作說明<span>*必填</span>
                    </div>
                  </div>
                  {/* 
                <div>
                  <input
                    className="input"
                    type="text"
                    name="tt"
                    value={addNeed[i].title}
                    placeholder="標題"
                    onChange={(e) => {
                      needChangerHandler(e.target.value, i, 'tt');
                      if (e.target.value !== '') {
                        setNeed(false);
                      }
                    }}
                  />
                </div> */}
                  <div>
                    <textarea
                      className="input contents18 "
                      // placeholder="請詳細說明"
                      name="ttt"
                      cols="30"
                      rows="10"
                      maxLength="500"
                      // value={addNeed[i].text}
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
    </div>
  );
}

export default WorkLog;
