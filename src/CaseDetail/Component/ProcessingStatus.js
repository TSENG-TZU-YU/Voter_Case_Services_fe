import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaTelegramPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../utils/use_auth';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import SelectStatus from './SelectStatus';
import '../../styles/caseDetail/_processingStatus.scss';

function ProcessingStatus({
  needState,
  needSumLen,
  needLen,
  selectData,
  postVal,
  setSelectRemind,
  handlePostVal,
  selectRemind,
  setAddStateForm,
  handleStateChecked,
  selCheckData,
  selVal,
  setSelVal,
  handlepopulaceMsg,
  nowSelState,
  loading,
  setLoading,
}) {
  const { member, setMember } = useAuth();
  const [submitMessage, setSubmitMessage] = useState('');
  const [nowState, setNowState] = useState('');
  const [submitMsgTrue, setSubmitMsgTrue] = useState(false);
  const [handleStData, setHandleStData] = useState([]);
  const { num } = useParams();
  const location = useLocation();
  // 從網址上抓到關鍵字
  let params = new URLSearchParams(location.search);
  let HId = params.get('HId');
  let User = params.get('user');
  let WebPage = parseInt(params.get('page'));

  // 檢查會員
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
        // console.log(response.data);
        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();
  }, []);

  // get
  useEffect(() => {
    let handleHandleStatus = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData/getHandleStatus/${num}`,
        {
          withCredentials: true,
        }
      );
      setHandleStData(response.data.result);
      setNowState(response.data.stResult[0].status_id);

      // console.log('r', response.data.stResult[0].status_id);
    };

    handleHandleStatus();
  }, [member, loading]);

  // post 案件處理情形
  let handlePostStatus = async (e) => {
    e.preventDefault();
    if (submitMessage === '') return;

    let response = await axios.post(
      `${API_URL}/applicationData/postHandleStatus`,
      { num, submitMessage },
      {
        withCredentials: true,
      }
    );
    Swal.fire({
      icon: 'success',
      title: '填寫完成',
      confirmButtonColor: '#f2ac33',
    });
    setSubmitMessage('');
    setLoading(!loading);
  };

  // 修改民眾反饋
  function handleChange(e) {
    const newpopulace = { ...selVal, [e.target.name]: e.target.value };

    // console.log('campingData', newpopulace);
    setSelVal(newpopulace);
  }
  return (
    <>
      <div className="dealWithContainer">
        {selCheckData.map((v, i) => {
          return (
            <div key={i}>
              <div className="dealWithContain">
                <div className="reply">
                  <div className="dealTit">回覆情況：</div>
                  <div className="">
                    <input
                      type="checkbox"
                      className="ms-2"
                      checked={v.responded_client === 1 ? true : false}
                      disabled={
                        WebPage === 2 &&
                        HId !== '' &&
                        member.handler === 1 &&
                        HId === member.name &&
                        needState !== 1 &&
                        needState !== 4 &&
                        needState !== 8 &&
                        needState !== 9 &&
                        needState !== 10 &&
                        needSumLen !== needLen
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        handleStateChecked(
                          v.id,
                          e.target.checked,
                          'rc',
                          v.case_number
                        );
                      }}
                    />
                    已回覆當事人情況
                  </div>
                  <div className="">
                    <input
                      type="checkbox"
                      className="ms-2"
                      checked={v.called === 1 ? true : false}
                      disabled={
                        WebPage === 2 &&
                        HId !== '' &&
                        member.handler === 1 &&
                        HId === member.name &&
                        needState !== 1 &&
                        needState !== 4 &&
                        needState !== 8 &&
                        needState !== 9 &&
                        needState !== 10 &&
                        needSumLen !== needLen
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        handleStateChecked(
                          v.id,
                          e.target.checked,
                          'called',
                          v.case_number
                        );
                      }}
                    />
                    請委員/議員致電陳情人
                  </div>
                </div>
                <div className="reply">
                  <div className="dealTit">辦理進度： {nowSelState}</div>
                  <SelectStatus
                    needState={needState}
                    needSumLen={needSumLen}
                    needLen={needLen}
                    selectData={selectData}
                    postVal={postVal}
                    setSelectRemind={setSelectRemind}
                    handlePostVal={handlePostVal}
                    selectRemind={selectRemind}
                    setAddStateForm={setAddStateForm}
                  />
                </div>

                {/* <div className="col-12 col-lg-3">
            <input type="checkBox" />
            辦理中(會勘/公文往返)
          </div>
          <div className="col-12 col-lg-3">
            <input type="checkBox" />
            追蹤
          </div>
          <div className="col-12 col-lg-3">
            <input type="checkBox" />
            已完成
          </div> */}

                {nowSelState !== '結案' ? (
                  ''
                ) : (
                  <>
                    <div className="reply">
                      <div className="dealTit">辦理結果：</div>
                      <div className="">
                        <input
                          type="radio"
                          className="ms-2"
                          name="result"
                          checked={v.success === 1 ? true : false}
                          disabled={
                            member.handler === 1 &&
                            HId === member.name &&
                            WebPage === 2
                              ? false
                              : true
                          }
                          onChange={(e) => {
                            handleStateChecked(
                              v.id,
                              e.target.checked,
                              'succ',
                              v.case_number
                            );
                          }}
                        />
                        成功
                      </div>
                      <div className="">
                        <input
                          type="radio"
                          className="ms-2"
                          name="result"
                          checked={v.fail === 1 ? true : false}
                          disabled={
                            member.handler === 1 &&
                            HId === member.name &&
                            WebPage === 2
                              ? false
                              : true
                          }
                          onChange={(e) => {
                            handleStateChecked(
                              v.id,
                              e.target.checked,
                              'fail',
                              v.case_number
                            );
                          }}
                        />
                        失敗
                      </div>
                    </div>
                  </>
                )}
              </div>

              {nowSelState !== '結案' ? (
                ''
              ) : (
                <>
                  {/* 民眾反饋 */}
                  <div className="feedbackContainer">
                    <div className="dealTit">民眾反饋：</div>
                    <div className="feedbackContain">
                      <textarea
                        className="feedback"
                        placeholder="請輸入民眾反饋..."
                        rows="3"
                        name="populace"
                        disabled={
                          member.handler === 1 &&
                          HId === member.name &&
                          WebPage === 2
                            ? false
                            : true
                        }
                        value={selVal.populace}
                        onChange={handleChange}
                      ></textarea>
                      {member.handler === 1 &&
                      HId === member.name &&
                      WebPage === 2 ? (
                        <FaTelegramPlane
                          className="submitIcon"
                          onClick={() => {
                            handlepopulaceMsg(v.id);
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 處理訊息 */}
      <div className="userName">
        {/* <BsFillPersonFill className="userIcon" /> {User} */}
        處理人處理情形
      </div>
      <div className={`chatContainer`}>
        <div className={`handleStatus`}>
          {handleStData.length !== 0
            ? handleStData.map((v, i) => {
                return (
                  <div
                    className={`msgContainer ${i !== 0 ? 'mTop' : ''} `}
                    key={uuidv4()}
                  >
                    <div className="handler">處理人：{v.name}</div>
                    <div className="msgContain">{v.content}</div>
                    <div className="time">{v.create_time}</div>
                  </div>
                );
              })
            : '目前沒有訊息'}
        </div>
      </div>

      {/* chatBar */}
      {/* bar member.manage === 1 &&*/}
      {nowState !== 1 &&
      nowState !== 4 &&
      nowState !== 8 &&
      nowState !== 9 &&
      nowState !== 10 &&
      member.handler === 1 &&
      HId === member.name &&
      WebPage === 2 ? (
        <div className="chatBarContain">
          <textarea
            className="submitMsg"
            placeholder="請輸入處理情形..."
            name="ttt"
            rows="2"
            value={submitMessage}
            onChange={(e) => {
              let msg = e.target.value;
              setSubmitMessage(msg);
              // console.log(msg);
              if (msg !== '') {
                setSubmitMsgTrue(true);
              } else {
                setSubmitMsgTrue(false);
              }
            }}
          ></textarea>
          <FaTelegramPlane
            className={`submitIcon ${submitMsgTrue ? 'submitTrue' : ''}`}
            onClick={(e) => {
              handlePostStatus(e);
            }}
          />
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default ProcessingStatus;
