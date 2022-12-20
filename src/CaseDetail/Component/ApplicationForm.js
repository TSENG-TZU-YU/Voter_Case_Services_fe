import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/use_auth';
import { API_URL } from '../../utils/config';

import '../../styles/caseDetail/_applicationForm.scss';
import EditNeedPage from './EditNeedPage';
import AddStateForm from './AddStateForm';

function ApplicationForm({
  setAddStatus,
  addStatus,
  handlerSelect,
  setHandlerSelect,
  caseId,
  caseNum,
  delCheck,
}) {
  const { num } = useParams();
  const navigate = useNavigate();
  const [editPage, setEditPage] = useState(false);
  const [addStateForm, setAddStateForm] = useState(false);
  const { member, setMember } = useAuth();
  const [needState, setNeedState] = useState('');
  const [needData, setNeedData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [handleData, setHandleData] = useState([]);
  const [handlerData, setHandlerData] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [handlerVal, setHandlerVal] = useState({ val: '' });
  const [postVal, setPostVal] = useState({
    caseNumber: '',
    handler: '',
    status: '',
    transfer: '',
    remark: '',
    finishTime: '',
  });

  const [selectRemind, setSelectRemind] = useState(false);
  const [postValRemind, setPostValRemind] = useState(false);
  const [editVerifyPage, setEditVerifyPage] = useState(false);
  // 職權
  const [director, setDirectors] = useState(true);
  const [handler, setHandler] = useState(true);

  const [needLoading, setNeedLoading] = useState(false);
  const [needLen, setNeedLen] = useState('');
  const [needSumLen, setNeedSumLen] = useState('');

  const [editNeed, setEditNeed] = useState([]);
  const [getFile, setGetFile] = useState([]);
  const radioInput = [
    { title: '一次性', value: '1' },
    { title: '短期', value: '2' },
    { title: '長期', value: '3' },
  ];

  // console.log('selectData', selectData);

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

    if (member.permissions_id === 1) {
      setAddStatus(false);
    }
    if (member.permissions_id === 3) {
      setHandler(false);
    }
  }, []);

  // 取得detail Id 的值
  useEffect(() => {
    let getCampingDetailData = async () => {
      let response = await axios.post(
        `${API_URL}/applicationData/${num}`,
        { caseId },
        {
          withCredentials: true,
        }
      );
      setDetailData(response.data.result);
      setNeedData(response.data.needResult);
      setHandleData(response.data.handleResult);
      setHandlerData(response.data.handlerResult);
      setGetFile(response.data.getFile);

      // selectStatus filter
      if (member.permissions_id === 2) {
        setSelectData(response.data.selectResult.splice(0, 3));
      } else {
        setSelectData(response.data.selectResult.splice(4));
      }
      // setSelectData(response.data.selectResult);
      // 目前狀態
      setNeedState(response.data.result[0].status_id);
      setNeedLen(parseInt(response.data.needResult.length));
      setNeedSumLen(parseInt(response.data.needSum[0].checked));
      // console.log(response.data.result[0].status_id);
      // console.log('c', detailData[0].transfer);
    };

    getCampingDetailData();
  }, [num, needLoading, needState, caseId, caseNum]);

  // 需求 checked
  const handleNeedChecked = async (needId, checked) => {
    if (checked === false) {
      let response = await axios.put(
        `${API_URL}/applicationData/checked/${needId}`,
        {
          withCredentials: true,
        }
      );
      setNeedLoading(!needLoading);
      // console.log('checked', response.data);
    } else {
      let response = await axios.put(
        `${API_URL}/applicationData/unChecked/${needId}`,
        {
          withCredentials: true,
        }
      );
      setNeedLoading(!needLoading);
      // console.log('checked', response.data);
    }
  };

  //   需求修改表單
  // add need
  const handleAddNeed = () => {
    let newData = [
      ...editNeed,
      {
        requirement_name: '',
        directions: '',
        case_number_id: detailData[0].case_number,
      },
    ];
    setEditNeed(newData);
  };

  // del need
  const handleDelNeed = (i) => {
    if (editNeed.length === 1) return;
    let newData = [...editNeed];
    newData.splice(i, 1);
    setEditNeed(newData);
  };

  //   update contain
  const handlerUpdateNeed = (val, i, input) => {
    let newData = [...editNeed];
    if (input === 'tit') newData[i].requirement_name = val;
    if (input === 'dir') newData[i].directions = val;
    setEditNeed(newData);
    setEditVerifyPage(false);
  };

  // post 處理狀態
  const handlePostVal = (e) => {
    let val = {
      ...postVal,
      [e.target.name]: e.target.value,
      handler: detailData[0].handler,
      caseNumber: detailData[0].case_number,
    };
    // console.log(val);
    setPostVal(val);
  };

  // post 處理狀態
  const handlePostHandle = async (e) => {
    e.preventDefault();
    if (postVal.transfer === '' && postVal.status === '轉件中') {
      setPostValRemind(true);
      return;
    }

    let response = await axios.post(
      `${API_URL}/applicationData/postHandle`,
      { ...postVal, ...detailData },
      {
        withCredentials: true,
      }
    );

    console.log('add', response.data);
    Swal.fire({
      icon: 'success',
      title: '申請成功',
    }).then(function () {
      setNeedLoading(!needLoading);
      setAddStateForm(false);
      setPostVal({
        caseNumber: '',
        handler: '',
        status: '',
        transfer: '',
        remark: '',
        finishTime: '',
      });

      navigate(`/header`);
    });
  };

  // post 修改需求
  const hanleAddNeed = async (e) => {
    e.preventDefault();

    for (let i = 0; i < editNeed.length; i++) {
      if (
        editNeed[i].requirement_name === '' ||
        editNeed[i].directions === ''
      ) {
        setEditVerifyPage(true);
        return;
      }
    }

    let response = await axios.post(
      `${API_URL}/applicationData/postAddNeed`,
      [detailData[0].handler, editNeed, caseId],
      {
        withCredentials: true,
      }
    );

    // console.log('add', response.data);
    Swal.fire({
      icon: 'success',
      title: '修改成功',
    }).then(function () {
      setNeedLoading(!needLoading);
      setEditPage(false);

      navigate(`/header`);
    });
  };

  // put 確認接收需求
  const handleCheckAccept = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/putAcceptNeed/${num}`,
      { caseId },
      {
        withCredentials: true,
      }
    );

    console.log('put', response.data);
    Swal.fire({
      icon: 'success',
      title: '已確認接收',
    }).then(function () {
      setNeedLoading(!needLoading);
      navigate(`/header`);
    });
  };

  // put user取消申請
  let handleUserCancle = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/cancleAcc/${detailData[0].case_number}`,
      { user: detailData[0].user, id: caseId },
      {
        withCredentials: true,
      }
    );
    // console(response.data);
    Swal.fire({
      icon: 'success',
      title: '申請案件已取消',
    }).then(function () {
      setNeedLoading(!needLoading);
      navigate(`/header`);
    });
  };

  // 確認接收轉件
  let handleAcceptCase = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/acceptCase`,
      detailData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    Swal.fire({
      icon: 'success',
      title: '已接收此案件',
    }).then(function () {
      setNeedLoading(!needLoading);
      navigate(`/header`);
    });
  };

  // 拒絕接收轉件
  let handleRejectCase = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/rejectCase`,
      detailData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    Swal.fire({
      icon: 'success',
      title: '已拒絕接收此案件',
    }).then(function () {
      setNeedLoading(!needLoading);
      navigate(`/header`);
    });
  };

  // finish
  let handleFinish = async () => {
    let response = await axios.post(
      `${API_URL}/applicationData/applicationFinish/${num}`,
      { caseId },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    Swal.fire({
      icon: 'success',
      title: '案件已完成',
    }).then(function () {
      setNeedLoading(!needLoading);
      navigate(`/header`);
    });
  };

  return (
    <div className="appFormContainer">
      {/* 處理人申請狀態btn */}
      {addStateForm ? (
        <AddStateForm
          setAddStateForm={setAddStateForm}
          handlePostVal={handlePostVal}
          handlerSelect={handlerSelect}
          setHandlerSelect={setHandlerSelect}
          handlerData={handlerData}
          setHandlerVal={setHandlerVal}
          handlerVal={handlerVal}
          postVal={postVal}
          handlePostHandle={handlePostHandle}
          postValRemind={postValRemind}
          setPostValRemind={setPostValRemind}
        />
      ) : (
        ''
      )}

      {/* 修改表單btn */}
      {editPage ? (
        <EditNeedPage
          setEditPage={setEditPage}
          handleAddNeed={handleAddNeed}
          editNeed={editNeed}
          handleDelNeed={handleDelNeed}
          handlerUpdateNeed={handlerUpdateNeed}
          detailData={detailData}
          needData={needData}
          hanleAddNeed={hanleAddNeed}
          editVerifyPage={editVerifyPage}
          setEditVerifyPage={setEditVerifyPage}
          caseId={caseId}
          delCheck={delCheck}
        />
      ) : (
        ''
      )}

      {/* user  需求修改Btn */}
      {needState === 12 && addStatus === false ? (
        <div
          className="editBtn"
          onClick={() => {
            setEditNeed([...needData]);
            setEditPage(true);
          }}
        >
          請點選按鈕進行需求修改
        </div>
      ) : (
        ''
      )}

      {/* handler  接收需求Btn */}
      {needState === 13 && handler === false ? (
        <div className="editBtn" onClick={handleCheckAccept}>
          需求已修改完成，請點選確認接收
        </div>
      ) : (
        ''
      )}

      {/* handler  是否接件 */}
      {needState === 11 &&
      detailData[0].transfer === 1 &&
      detailData[0].valid === 1 ? (
        <>
          <div className="editBtn" onClick={handleAcceptCase}>
            是，確認接收此案件
          </div>
          <div className="editBtn" onClick={handleRejectCase}>
            否，無法接收此案件
          </div>
        </>
      ) : (
        ''
      )}

      {/* 處理狀態 */}
      {handleData.length !== 0 ? (
        <div className="statusFormContainer">
          {handleData.map((v) => {
            return (
              <div className="statusFormContain" key={uuidv4()}>
                <div className="mb-1">
                  <span> &emsp;&emsp;處理人員：</span>
                  <span>{v.handler}</span>
                </div>
                <div className="mb-1">
                  <span>&emsp;&emsp;處理狀態：</span>
                  <span>{v.select_state}</span>
                </div>
                <div className="statusTime mb-1">
                  <span>&emsp;&emsp;處理時間：</span>
                  <span>{v.create_time}</span>
                </div>
                <div className="d-flex mb-1">
                  <span>&emsp;&emsp;&emsp;&emsp;備註：</span>
                  <textarea
                    name=""
                    cols="40"
                    rows="3"
                    placeholder={v.remark}
                    disabled
                  ></textarea>
                </div>
                {v.select_state === '案件進行中' &&
                v.estimated_time !== undefined ? (
                  <div>
                    <span>預計完成時間：</span>
                    <span>{v.estimated_time}</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="editBtn">尚無狀態資料</div>
      )}

      {/* 申請表單 */}
      <div className="tableContainer">
        {detailData.map((v) => {
          return (
            <div key={uuidv4()}>
              <div>
                <div className="pb-1">案件編號</div>
                <input type="text" placeholder={v.case_number} disabled />
              </div>
              <div className="gapContain my-2">
                <div>
                  <div className="pb-1">處理人</div>
                  <input type="text" placeholder={v.user} disabled />
                </div>
                <div>
                  <div className="pb-1">申請類別</div>
                  <input
                    type="text"
                    placeholder={v.application_category}
                    disabled
                  />
                </div>
              </div>
              <div className="gapContain">
                <div>
                  <div className="pb-1">專案名稱</div>
                  <input type="text" placeholder={v.project_name} disabled />
                </div>
                <div>
                  <div className="pb-1">該功能使用次數</div>
                  <div className="d-flex align-items-center">
                    {radioInput.map((d) => {
                      return (
                        <div
                          className="d-flex align-items-center"
                          key={uuidv4()}
                        >
                          <input
                            type="radio"
                            disabled
                            checked={v.cycle === d.value ? true : false}
                          />
                          <label>{d.title}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 需求 */}
        {needData.map((v, i) => {
          return (
            <div className="needContain" key={uuidv4()}>
              <div className="d-flex">
                <input
                  type="checkbox"
                  disabled={
                    addStatus &&
                    needState !== 1 &&
                    needState !== 2 &&
                    needState !== 3 &&
                    needState !== 5 &&
                    needState !== 9 &&
                    needState !== 10 &&
                    needState !== 11 &&
                    needState !== 12 &&
                    needState !== 13 &&
                    needState !== 14 &&
                    needState !== 15 &&
                    needState !== 16
                      ? false
                      : true
                  }
                  checked={v.checked === 1 ? true : false}
                  onChange={(e) => {
                    handleNeedChecked(v.id, e.target.checked);
                  }}
                />
                <span className="title">需求 {i + 1}</span>
              </div>
              <div className="needInput center">
                <span className="pe-1">1.</span>
                <input type="text" placeholder={v.requirement_name} disabled />
              </div>
              <div className="needInput">
                <span className="pe-1">2.</span>
                <textarea
                  name=""
                  rows="3"
                  placeholder={v.directions}
                  disabled
                ></textarea>
              </div>
            </div>
          );
        })}

        {/* 檔案 */}
        {getFile.map((v, i) => {
          return (
            <div key={uuidv4()} className={`needFile ${i < 9 ? 'ps-2' : ''}`}>
              <span>{i + 1}.</span>
              <div className="files">
                {v.file_no}
                {v.name}
              </div>
            </div>
          );
        })}

        {/* 選擇狀態 */}
        {addStatus &&
        needState !== 1 &&
        needState !== 2 &&
        needState !== 3 &&
        needState !== 7 &&
        needState !== 8 &&
        needState !== 9 &&
        needState !== 10 &&
        needState !== 11 &&
        needState !== 12 &&
        needState !== 13 &&
        needState !== 14 &&
        needState !== 15 &&
        needState !== 16 ? (
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
                <option value="" selected>
                  ----請選擇申請狀態----
                </option>
                {selectData.map((v) => {
                  return (
                    <option value={v.name} key={uuidv4()}>
                      {v.name}
                    </option>
                  );
                })}
              </select>
              {selectRemind ? (
                <div className="selectRemind">*請選擇申請狀態</div>
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
            {needSumLen === needLen ? (
              <button className="finishBtn" onClick={handleFinish}>
                完成
              </button>
            ) : (
              ''
            )}
          </div>
        ) : addStatus ? (
          ''
        ) : (
          <>
            {!addStatus &&
            needState !== 1 &&
            needState !== 2 &&
            needState !== 3 &&
            needState !== 6 &&
            needState !== 9 &&
            needState !== 10 &&
            needState !== 11 &&
            needState !== 16 ? (
              <div className="cancle">
                <button className="cancleBtn" onClick={handleUserCancle}>
                  取消申請
                </button>
              </div>
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ApplicationForm;
